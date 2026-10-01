import { pairedNames } from '../lib/judge'
import type { ProbeState } from '../types'

// 실제 startViewTransition 호출과 ready 시점의 pseudo 애니메이션을 그대로 나열한다.
export function TransitionLog({ probe }: { probe: ProbeState }) {
  const { env, transitions } = probe
  return (
    <div className="mt-3 rounded-md border border-zinc-200 bg-zinc-50 p-3 text-[11px] dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="mb-1.5 flex flex-wrap items-center gap-x-3 font-bold text-zinc-800 dark:text-zinc-200">
        <span>관측 로그 (document.startViewTransition 계측)</span>
        <span className="font-mono font-normal text-zinc-500">
          지원: {env ? String(env.supported) : '…'} · prefers-reduced-motion: {env ? String(env.reducedMotion) : '…'}
        </span>
      </div>
      {transitions.length === 0 ? (
        <p className="text-zinc-500">아직 시작된 View Transition이 없습니다. 썸네일을 클릭해 보세요.</p>
      ) : (
        <ol className="space-y-2 font-mono">
          {transitions.map((t) => (
            <li key={t.id} className="space-y-0.5">
              <div className="text-zinc-800 dark:text-zinc-200">
                #{t.id} 출발 {t.pathname.replace(/^.*\/zoom-card/, '…/zoom-card') || '/'} · types [{t.types.join(', ')}] · ready {t.ready}
                {t.finished ? ' · finished' : ''}
              </div>
              <div className="text-zinc-500">
                ::view-transition 애니메이션 {t.animations.length}개
                {t.animations.length > 0 && ` · 공유 쌍 [${pairedNames(t).join(', ')}] · group 속성 [${t.animations.find((a) => a.pseudo.includes('-group('))?.properties.join(', ') ?? '-'}] · ${t.animations[0].durationMs}ms`}
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
