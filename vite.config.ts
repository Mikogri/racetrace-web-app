import { existsSync, readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

const apiUserSecretsId = 'racetrace-api-2026'

function readDotnetApiSecret() {
  const secretDirectories = [
    process.env.APPDATA && join(process.env.APPDATA, 'Microsoft', 'UserSecrets'),
    join(homedir(), '.microsoft', 'usersecrets'),
  ].filter((directory): directory is string => Boolean(directory))

  for (const directory of secretDirectories) {
    const secretFile = join(directory, apiUserSecretsId, 'secrets.json')

    if (!existsSync(secretFile)) continue

    try {
      const contents = readFileSync(secretFile, 'utf8').replace(/^\uFEFF/, '')
      const secrets = JSON.parse(contents) as Record<string, unknown>
      const secret = secrets['ApiAccess:ReadSecret']

      if (typeof secret === 'string' && secret.trim()) return secret.trim()
    } catch {
      // Fall through to environment/appsettings defaults when the local store is unreadable.
    }
  }

  return undefined
}

export default defineConfig(({ mode }) => {
  const serverEnv = loadEnv(mode, process.cwd(), '')
  const apiProxyTarget = serverEnv.API_PROXY_TARGET || 'http://127.0.0.1:5017'
  const usesLocalApi = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(apiProxyTarget)
  const apiReadSecret =
    (usesLocalApi ? readDotnetApiSecret() : undefined) ||
    serverEnv.API_READ_SECRET ||
    'dev-read-secret'

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: apiProxyTarget,
          changeOrigin: true,
          headers: {
            Authorization: `Bearer ${apiReadSecret}`,
          },
        },
      },
    },
  }
})
