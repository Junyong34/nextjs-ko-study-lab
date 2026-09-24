/**
 * icon.tsx / apple-icon.tsx가 export하는 이미지 메타데이터의 단일 출처.
 * 메타데이터 라우트 파일과 검증 패널이 같은 값을 import하므로, 기대값이
 * 화면에 따로 하드코딩되지 않는다. (파일명이 icon*으로 시작하면 Next.js가
 * 아이콘 파일 컨벤션으로 오인할 수 있어 specs.ts로 둔다.)
 */
export const SEGMENT_PATH = '/zone/baseline/file-conventions/metadata-app-icons/dynamic-favicon'

export interface IconSpec {
  rel: 'icon' | 'apple-touch-icon'
  source: 'icon.tsx' | 'apple-icon.tsx'
  /** generateImageMetadata의 id. 단일 export 방식이면 null */
  id: string | null
  width: number
  height: number
  contentType: 'image/png'
}

/** icon.tsx의 generateImageMetadata가 반환하는 항목 */
export const ICON_VARIANTS = [
  { id: 'small', size: { width: 32, height: 32 }, contentType: 'image/png' },
  { id: 'large', size: { width: 192, height: 192 }, contentType: 'image/png' },
] as const

/** apple-icon.tsx의 size / contentType export */
export const APPLE_ICON_SIZE = { width: 180, height: 180 }
export const APPLE_ICON_CONTENT_TYPE = 'image/png'

export const EXPECTED_ICONS: IconSpec[] = [
  ...ICON_VARIANTS.map((v) => ({
    rel: 'icon' as const,
    source: 'icon.tsx' as const,
    id: v.id,
    width: v.size.width,
    height: v.size.height,
    contentType: v.contentType,
  })),
  {
    rel: 'apple-touch-icon',
    source: 'apple-icon.tsx',
    id: null,
    ...APPLE_ICON_SIZE,
    contentType: APPLE_ICON_CONTENT_TYPE,
  },
]
