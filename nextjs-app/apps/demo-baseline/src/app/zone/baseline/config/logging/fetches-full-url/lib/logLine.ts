// next@16.3.2 dist/server/dev/log-requests.js의 logFetchMetric·truncateUrl 규칙을 옮긴 계산이다.
// 실제 터미널 출력을 읽은 값이 아니라, 같은 규칙으로 "이렇게 찍힌다"를 계산해 보여 주기 위한 함수다.
const URL_LIMIT = 48

function truncate(text: string, max: number) {
  return text.length > max ? `${text.substring(0, max)}..` : text
}

export function truncateUrl(url: string) {
  const { protocol, host, pathname, search } = new URL(url)
  return `${protocol}//${truncate(host, 16)}${truncate(pathname, 24)}${truncate(search, 16)}`
}

/** logging.fetches가 설정된 경우의 fetch 로그 두 줄(요청 줄 + cache skip 이유 줄) */
export function fetchLogLines(url: string, status: number, durationMs: number, fullUrl: boolean) {
  const shown = url.length > URL_LIMIT && !fullUrl ? truncateUrl(url) : url
  return [
    ` │ GET ${shown} ${status} in ${durationMs}ms (cache skip)`,
    ' │ │ Cache skipped reason: (cache: no-store)',
  ]
}

export { URL_LIMIT }
