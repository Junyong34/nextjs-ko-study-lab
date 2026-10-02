/** 이 데모의 Route Handler(sample/route.ts)가 만드는 로컬 SVG 이미지 경로 */
export const SAMPLE_PATH = '/zone/baseline/config/images/remote-patterns-security/sample'

/** getImageProps·/_next/image 측정에 넣는 원격 이미지 URL. 예약 TLD(.example)라 실제로 요청되지 않는다. */
export const REMOTE_SAMPLE_URL = 'https://cdn.shop.example/products/shoes/runner.png'

/** next/image 기본 로더가 만드는 최적화 URL 형식: /_next/image?url=…&w=…&q=… */
export function optimizerPath(url: string, width = 640, quality = 75): string {
  return `/_next/image?url=${encodeURIComponent(url)}&w=${width}&q=${quality}`
}
