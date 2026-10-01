import type { DestinationProbe } from '../types'

// 목적지 페이지 두 개가 공유하는 렌더. 값은 서버 컴포넌트가 받은 params/searchParams 그대로다.
export function flatten(sp: Record<string, string | string[] | undefined>): Record<string, string> {
  return Object.fromEntries(
    Object.entries(sp).map(([k, v]) => [k, Array.isArray(v) ? v.join(',') : (v ?? '')]),
  )
}

export function ProbeView({ probe }: { probe: DestinationProbe }) {
  return (
    <main
      data-rewrite-probe={JSON.stringify(probe)}
      className="space-y-2 rounded-lg border border-zinc-300 p-4 text-sm dark:border-zinc-700"
    >
      <h1 className="font-bold">목적지 페이지: {probe.destination}</h1>
      <p className="text-xs text-zinc-500">이 페이지가 실제로 받은 값입니다. 요청 URL이 아니라 rewrite가 만든 목적지 기준입니다.</p>
      <dl className="font-mono text-xs">
        <dt className="font-bold">params</dt>
        <dd>{JSON.stringify(probe.params)}</dd>
        <dt className="font-bold">searchParams</dt>
        <dd>{JSON.stringify(probe.searchParams)}</dd>
        <dt className="font-bold">renderedAt</dt>
        <dd>{probe.renderedAt}</dd>
      </dl>
    </main>
  )
}
