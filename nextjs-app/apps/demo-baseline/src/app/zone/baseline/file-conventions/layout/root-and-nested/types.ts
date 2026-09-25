/** 조상 체인의 한 노드. 루트 layout은 data 속성을 달 수 없으므로 html/body 태그 자체로 식별한다. */
export type ChainNode =
  | { kind: 'html'; lang: string }
  | { kind: 'body' }
  | { kind: 'layout'; file: string }
  | { kind: 'page'; file: string }

/** 한 경로에서 page 요소의 실제 DOM 조상을 거슬러 올라가 읽은 관측값 */
export interface RouteObservation {
  /** 데모 기준 경로를 뗀 상대 경로 ('' = 데모 첫 화면) */
  rel: string
  /** html → body → layout… → page 순서의 실제 조상 체인 */
  chain: ChainNode[]
  /** 문서 전체의 html·body 요소 개수 (중첩 layout이 html/body를 또 만들지 않는지) */
  htmlCount: number
  bodyCount: number
  /** head 안 title 요소 개수와 현재 document.title */
  headTitleCount: number
  title: string
  /** 첫 진입(초기 로드)인지, 데모 안 Link 이동 후인지 */
  via: 'initial' | 'link'
}

export type CheckStatus = 'pass' | 'fail' | 'pending'

export interface CheckResult {
  label: string
  status: CheckStatus
  detail: string
}
