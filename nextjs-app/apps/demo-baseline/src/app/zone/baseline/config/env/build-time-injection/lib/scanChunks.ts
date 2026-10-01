import type { ChunkScan } from '../types'

/**
 * 브라우저가 이 페이지를 위해 내려받은 JS 파일(performance 리소스 목록)을 다시 fetch해 값을 검색한다.
 * 값은 서버 컴포넌트가 props로 넘겨주므로 이 클라이언트 코드 자체에는 리터럴로 들어 있지 않다.
 */
export async function scanChunks(value: string, identifier: string): Promise<ChunkScan> {
  const urls = Array.from(
    new Set(
      performance
        .getEntriesByType('resource')
        .map((e) => e.name)
        .filter((n) => new URL(n).pathname.endsWith('.js')),
    ),
  )
  const scan: ChunkScan = { scannedFiles: 0, filesWithValue: [], filesWithRawIdentifier: [], failedFiles: 0 }
  await Promise.all(
    urls.map(async (url) => {
      try {
        const text = await (await fetch(url, { cache: 'force-cache' })).text()
        const name = new URL(url).pathname.split('/').pop() ?? url
        scan.scannedFiles += 1
        if (text.includes(value)) scan.filesWithValue.push(name)
        if (text.includes(identifier)) scan.filesWithRawIdentifier.push(name)
      } catch {
        scan.failedFiles += 1
      }
    }),
  )
  return scan
}
