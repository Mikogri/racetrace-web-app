import { spawnSync } from 'node:child_process'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import openapiTS, { astToString } from 'openapi-typescript'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const backend = resolve(root, '../racetrace-api')
const specification = join(backend, 'contracts/openapi.json')
const definitions = join(root, 'src/types/generated/api.d.ts')
const normalize = text => text.replaceAll('\r\n', '\n')

export async function generateTypes(document) {
  return '// Generated from the backend OpenAPI document. Do not edit.\n' + astToString(await openapiTS(document))
}

export async function checkCurrent(path, generated) {
  const committed = await readFile(path, 'utf8').catch(error => { if (error.code === 'ENOENT') return ''; throw error })
  if (normalize(committed) !== normalize(generated)) throw new Error(`${path} is out of date. Run npm run contracts:generate.`)
}

function exportDocument(output) {
  const result = spawnSync('dotnet', ['run', '--project', join(backend, 'tools/OpenApiExport'),
    '--artifacts-path', join(backend, '.codex-build/contracts'), '--', output],
  { cwd: backend, stdio: 'inherit', windowsHide: true })
  if (result.error) throw result.error
  if (result.status !== 0) throw new Error(`OpenAPI export failed (${result.status}).`)
}

async function main(mode) {
  if (!['export', 'generate', 'check'].includes(mode)) throw new Error('Expected export, generate, or check.')
  const temporary = await mkdtemp(join(tmpdir(), 'racetrace-contracts-'))
  try {
    const path = mode === 'check' ? join(temporary, 'openapi.json') : specification
    exportDocument(path)
    const document = await readFile(path, 'utf8')
    if (mode === 'export') return
    const generated = await generateTypes(JSON.parse(document))
    if (mode === 'check') {
      await checkCurrent(specification, document)
      await checkCurrent(definitions, generated)
      console.log('OpenAPI and TypeScript contracts are current.')
    } else {
      await mkdir(dirname(definitions), { recursive: true })
      await writeFile(definitions, generated)
      console.log(`Generated ${definitions}`)
    }
  } finally { await rm(temporary, { recursive: true, force: true }) }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main(process.argv[2]).catch(error => { console.error(error.message); process.exitCode = 1 })
}
