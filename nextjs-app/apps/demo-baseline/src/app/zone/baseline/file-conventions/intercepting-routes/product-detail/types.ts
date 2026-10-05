/** 목록 카드를 그릴 수 있는 최소 정보. 목록 화면이 이미 갖고 있는 값이다. */
export interface ProductSummary {
  id: string
  name: string
  category: string
  price: number
  /** Tailwind 그라데이션 클래스 (썸네일 대용) */
  color: string
}

/** 서버에서 따로 받아야 하는 정보. 요약에는 들어 있지 않다. */
export interface ProductExtra {
  description: string
  specs: string[]
  stock: number
}

export type ProductDetail = ProductSummary & ProductExtra

/** 이 화면이 어느 파일에서 렌더됐는가 — 모달(@modal/(.)products) 또는 정식 페이지(products) */
export type EntryMode = 'modal' | 'direct'
