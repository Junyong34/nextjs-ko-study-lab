/**
 * 가이드의 InlineScript 헬퍼 그대로.
 * 서버 렌더에서는 text/javascript로 파싱 중 동기 실행되고,
 * 클라이언트 렌더(소프트 내비게이션)에서는 text/plain이라 실행되지 않는다.
 * type 차이는 suppressHydrationWarning이 흡수한다.
 */
export function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === 'undefined' ? 'text/javascript' : 'text/plain'}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
