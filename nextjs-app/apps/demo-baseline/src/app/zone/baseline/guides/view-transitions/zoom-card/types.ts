// zoom-card 데모 공용 타입. 검증 패널은 TransitionRecord(실측값)만으로 판정한다.

export interface PseudoAnimation {
  /** 예: ::view-transition-group(zoom-card-1) */
  pseudo: string
  /** 그룹 pseudo의 keyframe 속성 이름 (morph면 width/height/transform 등) */
  properties: string[]
  durationMs: number
}

export interface TransitionRecord {
  id: number
  startedAt: number
  /** ViewTransition.types (Link transitionTypes에서 전달됨) */
  types: string[]
  /** ready Promise 상태 */
  ready: 'pending' | 'resolved' | 'rejected'
  finished: boolean
  /** ready 시점의 document.getAnimations() 중 ::view-transition-* pseudo 대상 */
  animations: PseudoAnimation[]
  /** 이 전환이 시작된 시점의 pathname */
  pathname: string
}

export interface NavigationRecord {
  at: number
  pathname: string
}

export interface EnvInfo {
  supported: boolean
  reducedMotion: boolean
}

export interface ProbeState {
  env: EnvInfo | null
  transitions: TransitionRecord[]
  navigations: NavigationRecord[]
  reset: () => void
}

export interface CheckLine {
  ok: boolean | null
  text: string
}

export interface Judgement {
  isMatched: boolean | undefined
  checks: CheckLine[]
}
