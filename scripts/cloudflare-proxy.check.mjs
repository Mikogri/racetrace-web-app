import assert from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import { gzipSync, gunzipSync } from 'node:zlib'
import { onRequest } from '../functions/api/[[path]].js'

const originalFetch = globalThis.fetch
afterEach(() => { globalThis.fetch = originalFetch })
const env = { API_ORIGIN: 'https://racetrace.up.railway.app', API_READ_SECRET: 'server-only-read-key' }
const invoke = (path, init, bindings = env) => onRequest({ request: new Request(`https://racetrace.pages.dev${path}`, init), env: bindings })

test('preserves streamed compression metadata and payload', async () => {
  globalThis.fetch = async () => new Response(gzipSync('{"rating":90}'), { headers: { 'content-type': 'application/json', 'content-encoding': 'gzip' } })
  const response = await invoke('/api/v1/ranking')
  assert.equal(response.headers.get('content-encoding'), 'gzip')
  assert.equal(gunzipSync(Buffer.from(await response.arrayBuffer())).toString(), '{"rating":90}')
})

test('forwards query and server credential, never browser credentials or cookies', async () => {
  globalThis.fetch = async (request) => {
    assert.equal(request.url, 'https://racetrace.up.railway.app/api/v1/ranking?season=2026')
    assert.equal(request.headers.get('authorization'), 'Bearer server-only-read-key')
    assert.equal(request.headers.get('cookie'), null)
    assert.equal(request.headers.get('x-forwarded-for'), null)
    assert.equal(request.headers.get('x-racetrace-client-ip'), '203.0.113.25')
    assert.equal(request.redirect, 'manual')
    return new Response('{"items":[]}', { headers: { 'content-type': 'application/json', 'retry-after': '3', 'set-cookie': 'private=1' } })
  }
  const response = await invoke('/api/v1/ranking?season=2026', { headers: { authorization: 'Bearer attacker', cookie: 'private=1', 'x-forwarded-for': '1.2.3.4', 'cf-connecting-ip': '203.0.113.25', 'x-racetrace-client-ip': '1.2.3.4' } })
  assert.equal(await response.text(), '{"items":[]}')
  assert.equal(response.headers.get('retry-after'), '3')
  assert.equal(response.headers.get('set-cookie'), null)
  assert.equal(response.headers.get('cache-control'), 'no-store')
})

test('blocks administration, imports, encoded paths and arbitrary writes before network access', async () => {
  globalThis.fetch = async () => { assert.fail('Forbidden request reached API') }
  for (const [path, method] of [['/api/admin/editable-resources', 'GET'], ['/api/v1/import/riders/profile-images', 'POST'], ['/api/v1/ranking', 'DELETE'], ['/api/v1/%61dmin', 'GET'], ['/api/v1/riders%2f1', 'GET']]) {
    assert.equal((await invoke(path, { method })).status, 404)
  }
})

test('fails closed for missing bindings or unsafe origins', async () => {
  globalThis.fetch = async () => { assert.fail('Invalid configuration reached network') }
  for (const bindings of [{}, { ...env, API_ORIGIN: 'http://localhost' }, { ...env, API_ORIGIN: 'https://user:pass@example.com' }, { ...env, API_ORIGIN: 'https://example.com/path' }]) {
    assert.equal((await invoke('/api/v1/ranking', undefined, bindings)).status, 503)
  }
})

test('does not relay upstream redirects or leak network errors', async () => {
  globalThis.fetch = async () => new Response(null, { status: 302, headers: { location: 'https://evil.example' } })
  assert.equal((await invoke('/api/v1/ranking')).status, 502)
  globalThis.fetch = async () => { throw new Error('private credentials') }
  const response = await invoke('/api/v1/ranking')
  assert.equal(response.status, 502)
  assert.equal((await response.text()).includes('private credentials'), false)
})

test('preserves API error status and Retry-After', async () => {
  globalThis.fetch = async () => new Response('{"error":{"code":"RATE_LIMITED"}}', { status: 429, headers: { 'retry-after': '12' } })
  const response = await invoke('/api/v1/ranking')
  assert.equal(response.status, 429)
  assert.equal(response.headers.get('retry-after'), '12')
})

test('preserves public round-image HTTPS redirects without following them with credentials', async () => {
  globalThis.fetch = async () => new Response(null, { status: 302, headers: { location: 'https://storage.example/round.webp' } })
  const response = await invoke('/api/v1/rounds/7/image')
  assert.equal(response.status, 302)
  assert.equal(response.headers.get('location'), 'https://storage.example/round.webp')
  globalThis.fetch = async () => new Response(null, { status: 302, headers: { location: 'http://unsafe.example/image' } })
  assert.equal((await invoke('/api/v1/rounds/7/image')).status, 502)
})

test('permits only the existing non-mutating championship POST and bounds its payload', async () => {
  globalThis.fetch = async (request) => {
    assert.equal(request.method, 'POST')
    assert.equal(await request.text(), '[]')
    return new Response('{}')
  }
  assert.equal((await invoke('/api/v1/live/rounds/7/championship', { method: 'POST', body: '[]', headers: { 'content-type': 'application/json' } })).status, 200)
  assert.equal((await invoke('/api/v1/live/rounds/7/championship', { method: 'POST', body: 'x'.repeat(262145) })).status, 413)
})
