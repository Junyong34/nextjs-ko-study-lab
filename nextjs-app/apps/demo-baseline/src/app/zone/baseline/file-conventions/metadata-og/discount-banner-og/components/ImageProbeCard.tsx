'use client'
import type { ImageFetchResult, ImageProbe } from '../types'

function FetchRow({ label, r }: { label: string; r: ImageFetchResult }) {
  return (
    <tr className="border-b border-zinc-100 last:border-0 dark:border-zinc-800/60">
      <td className="px-2 py-1 text-zinc-500">{label}</td>
      <td className="px-2 py-1">{r.status}</td>
      <td className="px-2 py-1">{r.contentType}</td>
      <td className="px-2 py-1">{r.byteSize.toLocaleString()} B</td>
      <td className="px-2 py-1">{r.rate ?? '-'}%</td>
      <td className="break-all px-2 py-1">{r.generatedAt ?? '(헤더 없음)'}</td>
      <td className="break-all px-2 py-1 text-zinc-500">{r.cacheControl ?? '-'}{r.nextCache ? ` · ${r.nextCache}` : ''}</td>
    </tr>
  )
}

export function ImageProbeCard({ title, file, probe }: { title: string; file: string; probe?: ImageProbe }) {
  return (
    <div className="space-y-2 rounded-md border border-zinc-200 p-3 dark:border-zinc-800">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h5 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">{title}</h5>
        <code className="text-[11px] text-zinc-500">{file}</code>
      </div>
      {!probe ? (
        <p className="text-xs text-zinc-500">아직 요청하지 않았습니다.</p>
      ) : (
        <>
          <p className="break-all font-mono text-[11px] text-zinc-500">
            meta content: {probe.metaUrl}
            <br />
            실제 요청 경로(동일 출처): {probe.first.requestedPath}
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element -- fetch로 받은 PNG blob을 그대로 보여준다 */}
          <img
            src={probe.previewUrl}
            alt={`${title} 미리보기`}
            className="w-full rounded border border-zinc-200 dark:border-zinc-800"
          />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left font-mono text-[11px] text-zinc-700 dark:text-zinc-300">
              <thead className="text-zinc-500">
                <tr>
                  <th className="px-2 py-1 font-medium">요청</th>
                  <th className="px-2 py-1 font-medium">status</th>
                  <th className="px-2 py-1 font-medium">content-type</th>
                  <th className="px-2 py-1 font-medium">크기</th>
                  <th className="px-2 py-1 font-medium">할인율</th>
                  <th className="px-2 py-1 font-medium">생성 시각(x-demo-generated-at)</th>
                  <th className="px-2 py-1 font-medium">cache</th>
                </tr>
              </thead>
              <tbody>
                <FetchRow label="1회" r={probe.first} />
                <FetchRow label="2회" r={probe.second} />
              </tbody>
            </table>
          </div>
          <p className="font-mono text-[11px] text-zinc-500">
            데이터 원본(discount-data.ts): 생성 시각 기준 {probe.source.atGeneration?.rate ?? '-'}% · 지금(
            {probe.source.serverNow}) {probe.source.current.rate}%
          </p>
        </>
      )}
    </div>
  )
}
