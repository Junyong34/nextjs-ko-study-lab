/**
 * opengraph-image.tsx / twitter-image.tsx의 config export(alt, size, contentType) 원본.
 * 이미지 파일과 클라이언트 검증 코드가 같은 값을 공유해 "기대값"을 하드코딩하지 않는다.
 */
export const OG_IMAGE = {
  alt: 'Aero Runner 2026 타임세일 실시간 할인율 (요청 시 생성)',
  size: { width: 1200, height: 630 },
  contentType: 'image/png',
} as const

export const TWITTER_IMAGE = {
  alt: 'Aero Runner 2026 타임세일 할인율 (빌드 시 스냅샷)',
  size: { width: 1200, height: 600 },
  contentType: 'image/png',
} as const

/** ImageResponse의 headers 옵션으로 이미지와 함께 내보내는 실측용 응답 헤더 이름 */
export const IMAGE_HEADERS = {
  generatedAt: 'x-demo-generated-at',
  rate: 'x-demo-discount-rate',
  slot: 'x-demo-discount-slot',
} as const
