import type { HandlerIdentityProbe } from '../types'

/**
 * 이 앱의 next.config.ts는 cacheHandlers를 등록하지 않았다.
 * 공식 문서(cacheHandlers.md): "If you don't configure cacheHandlers, Next.js uses an
 * in-memory LRU (Least Recently Used) cache for both default and remote."
 * 이 카드는 그 문장을 Next.js 내부 레지스트리(globalThis)를 직접 읽어 실측으로 확인한다 —
 * 가짜 Redis 패널이 아니라, 실제로 실행 중인 프로세스의 실제 상태다.
 */
export function HandlerIdentityCard({ probe }: { probe: HandlerIdentityProbe }) {
  if (!probe.initialized) {
    return (
      <div className="rounded-md border border-amber-300 bg-amber-50/60 p-3 text-[11px] text-amber-800 dark:border-amber-800 dark:bg-amber-950/20 dark:text-amber-300">
        캐시 핸들러 레지스트리를 아직 찾지 못했다. 위 두 카드가 채워진 뒤 새로고침해 보라.
      </div>
    )
  }

  return (
    <div
      className={`rounded-md border p-3 text-[11px] ${
        probe.sameInstance
          ? 'border-blue-300 bg-blue-50/60 dark:border-blue-800 dark:bg-blue-950/20'
          : 'border-emerald-300 bg-emerald-50/60 dark:border-emerald-800 dark:bg-emerald-950/20'
      }`}
    >
      <div className="mb-1 font-sans text-xs font-semibold text-zinc-900 dark:text-zinc-100">
        내부 캐시 핸들러 레지스트리 실측 (globalThis[Symbol.for(&apos;@next/cache-handlers-map&apos;)])
      </div>
      <dl className="grid grid-cols-2 gap-x-3 gap-y-1 font-mono text-zinc-700 dark:text-zinc-300">
        <dt className="text-zinc-500">&apos;default&apos; 핸들러 인스턴스</dt>
        <dd className="text-right">{probe.defaultHandlerId}</dd>
        <dt className="text-zinc-500">&apos;remote&apos; 핸들러 인스턴스</dt>
        <dd className="text-right">{probe.remoteHandlerId}</dd>
        <dt className="text-zinc-500">Object.is(default, remote)</dt>
        <dd className={`text-right font-bold ${probe.sameInstance ? 'text-blue-700 dark:text-blue-300' : 'text-emerald-700 dark:text-emerald-300'}`}>
          {String(probe.sameInstance)}
        </dd>
      </dl>
      <p className="mt-2 font-sans leading-relaxed text-zinc-600 dark:text-zinc-400">
        {probe.sameInstance
          ? 'cacheHandlers.remote를 등록하지 않아 두 지시어가 같은 내장 in-memory 저장소를 공유한다 — "원격" 계층은 아직 존재하지 않는다.'
          : 'cacheHandlers.remote가 등록되어 두 지시어가 서로 다른 저장소를 쓴다.'}
      </p>
    </div>
  )
}
