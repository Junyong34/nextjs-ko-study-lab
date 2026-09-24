'use client'
import type { SsrProbe } from '../types'

/** 화면 표기용: 백슬래시 + u003c 6글자 */
const ESCAPED_LT = '\\' + 'u003c'

function Row({ label, value, ok }: { label: string; value: string; ok?: boolean }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-zinc-100 py-1 last:border-0 dark:border-zinc-800">
      <span className="text-zinc-500 dark:text-zinc-400">{label}</span>
      <span
        className={`break-all font-mono ${
          ok === undefined ? 'text-zinc-800 dark:text-zinc-200' : ok ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'
        }`}
      >
        {value}
      </span>
    </div>
  )
}

export function SsrProbeResult({ probe }: { probe: SsrProbe }) {
  return (
    <div className="space-y-3 rounded-lg border border-zinc-200 bg-white p-3.5 text-xs dark:border-zinc-800 dark:bg-zinc-950">
      <div className="font-mono text-[11px] font-semibold text-zinc-900 dark:text-zinc-100">
        GET {probe.requestedPath} → {probe.status} · {probe.contentType} · {probe.htmlBytes.toLocaleString()} bytes
      </div>
      <div className="grid grid-cols-1 gap-x-6 md:grid-cols-2">
        <div>
          <Row label="HTML 원문의 ld+json script 수" value={String(probe.ldScriptCount)} ok={probe.ldScriptCount === 1} />
          <Row label="#product-jsonld 발견" value={String(probe.found)} ok={probe.found} />
          <Row label="부모 요소 / body 안" value={`<${probe.parentTag ?? '-'}> / ${probe.inBody}`} ok={probe.inBody} />
          <Row label="HTML 원문 내 위치(offset)" value={`${probe.offset.toLocaleString()} / ${probe.htmlBytes.toLocaleString()}`} />
          <Row label="script 본문의 날것 '<' 개수" value={String(probe.rawLtCount)} ok={probe.rawLtCount === 0} />
          <Row label={`script 본문의 '${ESCAPED_LT}' 개수`} value={String(probe.escapedLtCount)} ok={probe.escapedLtCount > 0} />
          <Row label="본문 === serializeJsonLdSafe(원본)" value={String(probe.matchesSafeSerializer)} ok={probe.matchesSafeSerializer} />
          <Row label="하이드레이션 후 live DOM script 수" value={String(probe.liveDomCount)} ok={probe.liveDomCount === 1} />
        </div>
        <div>
          {probe.parseError && <Row label="JSON.parse" value={probe.parseError} ok={false} />}
          {probe.fields.map((f) => (
            <Row key={f.path} label={f.path} value={f.ok ? f.actual : `${f.actual} ≠ ${f.expected}`} ok={f.ok} />
          ))}
        </div>
      </div>
      <details>
        <summary className="cursor-pointer text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">
          HTML 원문에서 꺼낸 script 본문 보기
        </summary>
        <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap break-all rounded bg-[#24292e] p-2.5 font-mono text-[11px] text-zinc-100">
          {probe.rawText}
        </pre>
      </details>
    </div>
  )
}
