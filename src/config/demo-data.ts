// Temporary preview mode. Set to false to restore live API responses.
export const USE_SIMULATED_API_DATA = false

export function waitForSimulatedApi(signal: AbortSignal, duration = 1200) {
  return new Promise<void>((resolve, reject) => {
    const timeoutId = window.setTimeout(resolve, duration)
    signal.addEventListener('abort', () => {
      window.clearTimeout(timeoutId)
      reject(new DOMException('The simulated request was aborted.', 'AbortError'))
    }, { once: true })
  })
}
