/** [category]/layout.tsx 안의 클라이언트 프로브가 보고하는 한 시점의 관측값 */
export interface LayoutReport {
  /** pathname + search (쿼리 변경도 이동으로 본다) */
  location: string
  pathname: string
  /** layout이 await params로 받은 category 값 */
  category: string
  /** layout 서버 렌더마다 새로 만들어지는 ID와 시각 */
  renderId: string
  renderedAt: string
  /** layout이 실제로 받은 params의 raw JSON과 props 키 목록 */
  paramsJson: string
  propKeys: string[]
  /** layout 아래 클라이언트 컴포넌트 인스턴스 ID와 그 안의 상태 */
  mountId: string
  counter: number
  memo: string
}

/** 하위 page.tsx가 보고하는 자기 props 관측값 */
export interface PageReport {
  pathname: string
  paramsJson: string
  searchParamsJson: string
}

export interface Transition {
  from: LayoutReport
  to: LayoutReport
}

export type CheckStatus = 'pass' | 'fail' | 'pending'

export interface CheckResult {
  label: string
  status: CheckStatus
  detail: string
}
