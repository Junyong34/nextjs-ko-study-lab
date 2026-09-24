import type { ImageLoader } from 'next/image'
// 아래 두 모듈은 next/image가 <img> 속성을 만들 때 실제로 쓰는 Next.js 16.3.2 내부 구현이다.
// 이 앱은 next.config.ts의 images.unoptimized: true 때문에 <Image>가 srcset을 절대 만들지 않으므로,
// "최적화가 켜진 앱이라면 무엇이 렌더되는가"를 같은 함수에 unoptimized: false 설정만 바꿔 넣어 얻는다.
import { getImgProps } from 'next/dist/shared/lib/get-img-props'
import { imageConfigDefault } from 'next/dist/shared/lib/image-config'
import defaultLoader from 'next/dist/shared/lib/image-loader'
import type { SizesPreset } from '../types'

export const PHOTO_PATH = '/zone/baseline/components/image/responsive-sizes/photo'

/** 재요청마다 브라우저 캐시를 우회하도록 run 번호를 붙인 원본 URL */
export function buildPhotoSrc(run: number): string {
  return `${PHOTO_PATH}?run=${run}`
}

/** 공식 문서 loader 예시와 같은 형태: 요청 폭을 쿼리로 붙여 photo/route.ts가 그 폭의 파일을 응답한다. */
export const photoLoader: ImageLoader = ({ src, width }) =>
  `${src}${src.includes('?') ? '&' : '?'}w=${width}`

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
    hint: 'fill인데 sizes가 없으면 100vw로 가정한다',
  },
  {
    id: 'undersized',
    label: 'sizes = 10vw (과소)',
    sizes: '(max-width: 767px) 100vw, 10vw',
    hint: 'md 이상에서 실제보다 작게 알려 흐린 후보를 고르게 만든다',
  },
]

const OPTIMIZED_CONFIG = { ...imageConfigDefault, unoptimized: false }

type OptimizedInput = { src: string; alt: string; sizes?: string } & (
  | { fill: true }
  | { width: number; height: number }
)

/** Next.js 기본 deviceSizes/imageSizes + unoptimized: false로 getImgProps를 실제 호출한 결과(<img> props). */
export function getOptimizedImgProps(input: OptimizedInput) {
  const { props } = getImgProps(
    { ...input, loader: photoLoader },
    { defaultLoader, imgConf: OPTIMIZED_CONFIG, showAltText: false, blurComplete: false },
  )
  return props
}

export const DEVICE_SIZES = imageConfigDefault.deviceSizes
export const IMAGE_SIZES = imageConfigDefault.imageSizes
