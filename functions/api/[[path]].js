// Pages runs this on the server. Only the read credential belongs here.
export async function onRequest({ request, env }) {
  const url = new URL(request.url)
  const path = url.pathname
  const read = request.method === 'GET' || request.method === 'HEAD'
  const projection = request.method === 'POST' && /^\/api\/v1\/live\/rounds\/\d+\/championship\/?$/.test(path)
  if (!/^\/api\/v1\/[a-z0-9/-]+$/i.test(path) || /\/(?:import|admin)(?:\/|$)/i.test(path) || (!read && !projection)) {
    return failure(404, 'NOT_FOUND', 'Route not found.')
  }

  let origin
  try {
    origin = new URL(env.API_ORIGIN)
    if (origin.protocol !== 'https:' || origin.username || origin.password || origin.pathname !== '/' || origin.search || origin.hash || !env.API_READ_SECRET?.trim()) throw new Error('Invalid configuration')
  } catch {
    return failure(503, 'GATEWAY_UNCONFIGURED', 'API gateway is not configured.')
  }

  const headers = new Headers({ Accept: 'application/json', Authorization: `Bearer ${env.API_READ_SECRET}` })
  const clientIp = request.headers.get('CF-Connecting-IP')
  if (clientIp) headers.set('X-RaceTrace-Client-IP', clientIp)
  let body
  if (projection) {
    // Bound streamed bodies too; Content-Length is optional and untrusted.
    const reader = request.body?.getReader()
    const chunks = []
    let length = 0
    if (reader) {
      while (true) {
        const { value, done } = await reader.read()
        if (done) break
        length += value.byteLength
        if (length > 262144) {
          await reader.cancel()
          return failure(413, 'PAYLOAD_TOO_LARGE', 'Request body is too large.')
        }
        chunks.push(value)
      }
    }
    body = await new Blob(chunks).arrayBuffer()
    headers.set('Content-Type', 'application/json')
  }

  try {
    const upstreamStarted = performance.now()
    const response = await fetch(new Request(`${origin.origin}${path}${url.search}`, {
      method: request.method, headers, body, redirect: 'manual',
      signal: AbortSignal.any([request.signal, AbortSignal.timeout(30000)]),
    }))
    const upstreamHeadersMs = performance.now() - upstreamStarted
    if (response.status >= 300 && response.status < 400) {
      // Images may redirect to public Storage; never follow with the API credential.
      const location = response.headers.get('location')
      if (read && /^\/api\/v1\/rounds\/\d+\/image$/.test(path) && location) {
        const image = new URL(location)
        if (image.protocol === 'https:' && !image.username && !image.password) {
          return new Response(null, { status: response.status, headers: { Location: image.href, 'Cache-Control': 'no-store' } })
        }
      }
      return failure(502, 'UPSTREAM_REDIRECT', 'API returned an unexpected redirect.')
    }
    const output = new Headers({ 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' })
    for (const name of ['content-type', 'content-encoding', 'retry-after', 'server-timing', 'x-request-id']) {
      const value = response.headers.get(name)
      if (value) output.set(name, value)
    }
    // Fetch resolves at headers; this is not SQL duration or complete body transfer time.
    output.append('Server-Timing', `upstream_headers;dur=${upstreamHeadersMs.toFixed(2)}`)
    return new Response(response.body, { status: response.status, headers: output })
  } catch {
    return failure(502, 'UPSTREAM_UNAVAILABLE', 'Unable to connect to the API.')
  }
}

function failure(status, code, message) {
  return Response.json({ error: { code, message } }, { status, headers: { 'Cache-Control': 'no-store' } })
}
