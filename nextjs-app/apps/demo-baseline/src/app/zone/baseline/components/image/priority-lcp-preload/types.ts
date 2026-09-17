export type PreloadVariant = 'none' | 'priority' | 'preload'

export interface VariantOption {
  id: PreloadVariant
  label: string
  hint: string
  deprecated?: boolean
}

export interface ExpectedState {
  /** 'lazy' 문자열이 실려야 하면 'lazy', 속성 자체가 없어야 하면 null */
  loading: 'lazy' | null
  preloadLink: boolean
}

export interface ActualState {
  loading: string | null
  fetchPriority: string | null
  preloadLink: boolean
  preloadLinkHref: string | null
  imgSrc: string | null
}
