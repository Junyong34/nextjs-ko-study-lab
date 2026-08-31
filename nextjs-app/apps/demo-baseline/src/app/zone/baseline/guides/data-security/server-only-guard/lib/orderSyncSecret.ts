import 'server-only'

// 이 파일은 최상단 'server-only' 임포트로 보호된다.
// 클라이언트 컴포넌트('use client')가 이 모듈을 직접 import하면
// Next.js 빌드가 즉시 컴파일 에러를 발생시켜 실행을 막는다.
const ORDER_SYNC_SECRET = 'sk_live_9f3a7c21b6d84e0f'

export function signOrderSync(productId: string, quantity: number) {
  const digest = Buffer.from(`${productId}:${quantity}:${ORDER_SYNC_SECRET}`)
    .toString('base64')
    .slice(0, 16)

  return {
    digest,
    secretPreview: `${ORDER_SYNC_SECRET.slice(0, 7)}${'*'.repeat(ORDER_SYNC_SECRET.length - 7)}`,
  }
}
