import type { ImageLoader } from 'next/image'
import type { SizesPreset } from '../types'

export const PHOTO_PATH = '/zone/baseline/components/image/responsive-sizes/photo'

/** 재요청마다 브라우저 캐시를 우회하도록 run 번호를 붙인 원본 URL */
export function buildPhotoSrc(run: number): string {
  return `${PHOTO_PATH}?run=${run}`
}

/** 폭 w의 파일 URL. photo/route.ts가 ?w= 값을 intrinsic width로 갖는 SVG로 응답한다. */
export function photoUrl(src: string, width: number): string {
  return `${src}${src.includes('?') ? '&' : '?'}w=${width}`
}

/**
 * 공식 문서 loader 예시와 같은 형태의 공개 ImageLoader. A 카드의 <Image>에 넘기지만,
 * 이 앱은 images.unoptimized: true라 호출되지 않는다는 것 자체가 관찰 대상이다.
 */
export const photoLoader: ImageLoader = ({ src, width }) => photoUrl(src, width)

/**
 * 공식 문서 components/image.md "deviceSizes"·"imageSizes" 절에 적힌 기본값(next.config.js에
 * images 설정이 없을 때 쓰이는 값). next/image 내부 모듈에서 읽지 않고 문서 값을 그대로 옮겼다.
 */
export const DEVICE_SIZES = [640, 750, 828, 1080, 1200, 1920, 2048, 3840] as const
export const IMAGE_SIZES = [32, 48, 64, 96, 128, 256, 384] as const

/**
 * 문서: "imageSizes ... are concatenated with the array of device sizes to form the full array of
 * sizes used to generate image srcset". B 카드의 w 후보는 이 전체 목록이다. 프리셋과 무관하게
 * 후보를 고정해야 sizes 값만 바꿨을 때 브라우저 선택이 어떻게 달라지는지 분리해서 볼 수 있다.
 */
export const ALL_WIDTHS: number[] = [...IMAGE_SIZES, ...DEVICE_SIZES].sort((a, b) => a - b)

/** 네이티브 srcset 문자열: `url 32w, url 48w, …` (URL에 콤마가 없어 파싱이 단순하다) */
export function buildWidthSrcset(src: string, widths: readonly number[]): string {
  return widths.map((w) => `${photoUrl(src, w)} ${w}w`).join(', ')
}

/** C 카드: 고정 크기 이미지용 x 서술자 srcset. 표시 폭 320px → 1x는 320, 2x는 640 파일. */
export const FIXED_WIDTH = 320
export const FIXED_DENSITIES = [1, 2] as const
export function buildDensitySrcset(src: string): string {
  return FIXED_DENSITIES.map((d) => `${photoUrl(src, FIXED_WIDTH * d)} ${d}x`).join(', ')
}

export const SIZES_PRESETS: SizesPreset[] = [
  {
    id: 'grid',
    label: 'sizes = 그리드 실제 폭',
    sizes: '(max-width: 767px) 100vw, 33vw',
    hint: '모바일 1열(100vw), md 이상 3열(33vw) 레이아웃을 그대로 알려준다',
  },
  {
    id: 'omitted',
    label: 'sizes 생략',
    sizes: undefined,
    hint: 'w 서술자 srcset에 sizes가 없으면 브라우저는 100vw로 가정한다',
  },
  {
    id: 'undersized',
    label: 'sizes = 10vw (과소)',
    sizes: '(max-width: 767px) 100vw, 10vw',
    hint: 'md 이상에서 실제보다 작게 알려 흐린 후보를 고르게 만든다',
  },
]
