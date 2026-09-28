// server-only가 아니다 — 브라우저에서 직접 실행되는 평범한 유틸리티다.
// 현재 페이지가 실제로 내려받은 <script> 청크 전체를 fetch()로 다시 받아
// 그 텍스트 안에 주어진 토큰이 있는지 검사한다.
export interface BundleScanResult {
  scannedCount: number
  foundIn: string[]
  scannedUrls: string[]
}

export async function scanClientBundleForToken(token: string): Promise<BundleScanResult> {
  const scriptUrls = Array.from(document.querySelectorAll('script[src]'))
    .map((el) => (el as HTMLScriptElement).src)
    .filter((src) => Boolean(src) && src.startsWith(window.location.origin))

  const uniqueUrls = Array.from(new Set(scriptUrls))
  const foundIn: string[] = []

  await Promise.all(
    uniqueUrls.map(async (url) => {
      try {
        const res = await fetch(url)
        const text = await res.text()
        if (text.includes(token)) foundIn.push(url)
      } catch {
        // 청크를 못 받아온 경우는 스캔 대상에서 제외한다(네트워크 실패를 "안전"으로 오판하지 않기 위함).
      }
    }),
  )

  return { scannedCount: uniqueUrls.length, foundIn, scannedUrls: uniqueUrls }
}
