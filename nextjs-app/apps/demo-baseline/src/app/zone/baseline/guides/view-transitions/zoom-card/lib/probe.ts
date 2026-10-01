import type { PseudoAnimation, TransitionRecord } from '../types'

type StartViewTransition = (...args: unknown[]) => ViewTransitionLike
interface ViewTransitionLike {
  ready: Promise<void>
  finished: Promise<void>
  types?: Set<string>
}

interface Handlers {
  onStart: (r: TransitionRecord) => void
  onUpdate: (id: number, patch: Partial<TransitionRecord>) => void
}

let seq = 0

export const supportsViewTransition = () => typeof (document as unknown as { startViewTransition?: unknown }).startViewTransition === 'function'

/** document.getAnimations() 중 ::view-transition-* pseudo 요소를 대상으로 하는 애니메이션을 읽는다 */
export function readPseudoAnimations(): PseudoAnimation[] {
  return document
    .getAnimations()
    .flatMap((a) => {
      const effect = a.effect as KeyframeEffect | null
      const pseudo = effect?.pseudoElement
      if (!effect || !pseudo?.startsWith('::view-transition')) return []
      const properties = [...new Set(effect.getKeyframes().flatMap((k) => Object.keys(k)))].filter(
        (k) => !['offset', 'computedOffset', 'easing', 'composite'].includes(k),
      )
      return [{ pseudo, properties, durationMs: Math.round(Number(effect.getComputedTiming().duration)) }]
    })
}

/**
 * document.startViewTransition을 감싸 React가 시작한 전환을 기록한다.
 * React의 <ViewTransition>은 내비게이션 transition 안에서 이 API를 호출하므로 실제 호출 여부가 곧 실측값이다.
 * 반환 함수로 원복한다.
 */
export function installViewTransitionProbe({ onStart, onUpdate }: Handlers): () => void {
  const doc = document as unknown as { startViewTransition?: StartViewTransition }
  const original = doc.startViewTransition
  if (!original) return () => {}

  const patched: StartViewTransition = function (this: unknown, ...args) {
    const vt = original.apply(document, args)
    const id = ++seq
    onStart({
      id,
      startedAt: performance.now(),
      types: vt.types ? [...vt.types] : [],
      ready: 'pending',
      finished: false,
      animations: [],
      pathname: location.pathname,
    })
    vt.ready.then(
      () => onUpdate(id, { ready: 'resolved', animations: readPseudoAnimations(), types: vt.types ? [...vt.types] : [] }),
      () => onUpdate(id, { ready: 'rejected' }),
    )
    vt.finished.then(
      () => onUpdate(id, { finished: true }),
      () => onUpdate(id, { finished: true }),
    )
    return vt
  }

  doc.startViewTransition = patched
  return () => {
    if (doc.startViewTransition === patched) doc.startViewTransition = original
  }
}
