import type { FormatCase, ImageFormat } from '../types'

export const DEMO_BASE = '/zone/baseline/config/images/formats-avif-webp'
export const ACCEPT_PATH = `${DEMO_BASE}/accept`

/** <Image>와 getImageProps에 넣는 로컬 이미지. accept/route.ts가 SVG로 응답한다. */
export const PRODUCT_SRC = `${ACCEPT_PATH}?mode=img&from=image`

export function optimizerPath(url: string, width = 640, quality = 75): string {
  return `/_next/image?url=${encodeURIComponent(url)}&w=${width}&q=${quality}`
}

/** 2×2 빨간 이미지. 이 데모를 만들 때 sharp로 인코드해 넣은 고정 바이트다(실행 중 변환하지 않는다). */
export const SAMPLE_BASE64: Record<'avif' | 'webp', string> = {
  avif:
    'AAAAHGZ0eXBhdmlmAAAAAG1pZjFhdmlmbWlhZgAAANZtZXRhAAAAAAAAACFoZGxyAAAAAAAAAABwaWN0AAAAAAAAAAAAAAAAAAAAACJpbG9jAAAAAERAAAEAAQAAAAAA+gABAAAAAAAAACMAAAAjaWluZgAAAAAAAQAAABVpbmZlAgAAAAABAABhdjAxAAAAAA5waXRtAAAAAAABAAAAVmlwcnAAAAA4aXBjbwAAAAxhdjFDgSACAAAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAABZpcG1hAAAAAAAAAAEAAQOBAgMAAAArbWRhdBIACgc4ADaQENBpMhYZQmMEwAA0AACQQMkcYUamZtaKyMi2',
  webp: 'UklGRjwAAABXRUJQVlA4IDAAAADwAQCdASoCAAIAAUAmJaACdLoB+AAETAAA/u/9w/8KtwxDNV/9+0vfaXvtL/UIAAA=',
}

export const FORMAT_CONFIGS: { label: string; formats: ImageFormat[] }[] = [
  { label: "기본값 ['image/webp']", formats: ['image/webp'] },
  { label: "['image/avif', 'image/webp']", formats: ['image/avif', 'image/webp'] },
  { label: "['image/webp', 'image/avif']", formats: ['image/webp', 'image/avif'] },
]

const CHROME_LIKE = 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'

/** 개념 확인 문항. 정답은 lib/negotiate.ts가 제출 시점에 계산한다. */
export const FORMAT_CASES: FormatCase[] = [
  { id: 'f1', label: 'AVIF·WebP를 같은 q로 보내는 브라우저', accept: CHROME_LIKE, formats: ['image/webp'] },
  { id: 'f2', label: 'AVIF·WebP를 같은 q로 보내는 브라우저', accept: CHROME_LIKE, formats: ['image/avif', 'image/webp'] },
  { id: 'f3', label: '같은 Accept, 배열 순서만 반대', accept: CHROME_LIKE, formats: ['image/webp', 'image/avif'] },
  { id: 'f4', label: 'WebP만 보내는 브라우저', accept: 'image/webp,*/*', formats: ['image/avif', 'image/webp'] },
  { id: 'f5', label: 'AVIF에 낮은 q를 준 Accept', accept: 'image/webp,image/avif;q=0.5,*/*;q=0.8', formats: ['image/avif', 'image/webp'] },
  { id: 'f6', label: '두 포맷을 명시하지 않는 Accept', accept: 'image/png,image/*;q=0.8,*/*;q=0.5', formats: ['image/avif', 'image/webp'] },
]
