import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { checkCurrent, generateTypes } from './api-contracts.mjs'

test('freshness check fails on changed or absent generated definitions without overwriting them', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'racetrace-contract-test-'))
  try {
    const file = join(directory, 'api.d.ts')
    await assert.rejects(checkCurrent(file, 'new'), /out of date/)
    await writeFile(file, 'old\r\n')
    await assert.rejects(checkCurrent(file, 'new\n'), /out of date/)
    await checkCurrent(file, 'old\n')
  } finally { await rm(directory, { recursive: true, force: true }) }
})

test('generator retains numeric IDs, nullable values, string enums and date types', async () => {
  const generated = await generateTypes({
    openapi: '3.1.0', info: { title: 'contract fixture', version: '1' }, paths: {},
    components: { schemas: { Rider: { type: 'object', required: ['id', 'state', 'date'], properties: {
      id: { type: 'integer', format: 'int64' },
      state: { type: ['string', 'null'], enum: ['ready', 'pending', null] },
      date: { type: 'string', format: 'date' },
    } } } },
  })
  assert.match(generated, /id: number;/)
  assert.match(generated, /state: "ready" \| "pending" \| null;/)
  assert.match(generated, /date: string;/)
})
