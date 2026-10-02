'use client'
import type { ReactNode } from 'react'
import { DemoResetButton } from '@study/demo-kit'
import { COUNTED_TAGS, type SpecMeta } from '../types'
import { EXPECTED_COUNTS } from '../expectations'
import type { useTechDocProbe } from '../hooks/useTechDocProbe'

const btn =
  'cursor-pointer rounded bg-zinc-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900'

// 공유 layout 방식의 스타일: MDX 요소를 바꾸지 않고 감싸는 요소에서 하위 태그에 스타일을 준다.
const docStyle =
  'rounded border border-zinc-200 bg-white p-4 text-sm text-zinc-800 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 [&_blockquote]:my-2 [&_blockquote]:border-l-4 [&_blockquote]:border-zinc-300 [&_blockquote]:pl-3 [&_blockquote]:text-zinc-500 [&_li]:my-0.5 [&_ol]:list-decimal [&_ol]:pl-5 [&_pre]:my-2 [&_pre]:overflow-x-auto [&_pre]:rounded [&_pre]:bg-zinc-950 [&_pre]:p-3 [&_pre]:text-xs [&_pre]:text-zinc-100 [&_table]:my-2 [&_table]:text-xs [&_td]:border [&_td]:border-zinc-300 [&_td]:px-2 [&_th]:border [&_th]:border-zinc-300 [&_th]:px-2 [&_ul]:list-disc [&_ul]:pl-5'

interface Props {
  meta: SpecMeta
  probe: ReturnType<typeof useTechDocProbe>
  children: ReactNode
}

export function TechDocPlayground({ meta, probe: p, children }: Props) {
  return (
    <div className="space-y-3 text-sm">
      <div className="flex flex-wrap items-center gap-3 border-b pb-3 text-xs dark:border-zinc-800">
        <fieldset className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
          <legend className="sr-only">예측</legend>
          <span className="font-bold">1) 파이프 표(| --- |)는</span>
          {(['table', 'text'] as const).map((v) => (
            <label key={v} className="flex cursor-pointer items-center gap-1">
              <input type="radio" name="tech-doc-prediction" checked={p.prediction === v} onChange={() => p.setPrediction(v)} />
              {v === 'table' ? '<table>이 된다' : '문단 텍스트로 남는다'}
            </label>
          ))}
        </fieldset>
        <button type="button" onClick={p.measure} className={btn}>2) 렌더된 DOM 측정</button>
        <button type="button" onClick={p.probeRoute} disabled={p.isPending} className={btn}>
          {p.isPending ? '요청 중...' : '3) page.mdx 라우트 요청'}
        </button>
        <DemoResetButton onReset={p.reset} />
      </div>

      <p className="font-mono text-xs text-zinc-500">
        import {'{'} specMeta {'}'} from &apos;./content/spec.mdx&apos; → sku {meta.sku} · revision {meta.revision} · updatedAt {meta.updatedAt}
      </p>

      <div ref={p.docRef} className={docStyle}>
        {children}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <table className="w-full border-collapse font-mono text-xs">
          <thead>
            <tr className="text-left text-zinc-500"><th className="py-1">태그</th><th>기대</th><th>실측</th></tr>
          </thead>
          <tbody>
            {COUNTED_TAGS.map((tag) => {
              const actual = p.census?.counts[tag]
              const off = actual !== undefined && actual !== EXPECTED_COUNTS[tag]
              return (
                <tr key={tag} className={`border-t border-zinc-200 dark:border-zinc-800 ${off ? 'text-red-600' : ''}`}>
                  <td className="py-0.5">&lt;{tag}&gt;</td><td>{EXPECTED_COUNTS[tag]}</td><td>{actual ?? '-'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <div className="space-y-1 rounded bg-zinc-950 p-3 font-mono text-xs text-zinc-300">
          {p.census ? (
            <>
              <div>측정 시각 {p.census.measuredAt}</div>
              <div>파이프 텍스트가 남은 &lt;p&gt;: <span className="font-bold text-amber-400">{p.census.pipeParagraphs}</span></div>
              <div>JSX로 쓴 &lt;table data-source=&quot;jsx&quot;&gt;: <span className="font-bold text-sky-400">{p.census.jsxTables}</span></div>
            </>
          ) : (
            <div className="text-zinc-500">[렌더된 DOM 측정] 전입니다.</div>
          )}
          <div className="border-t border-zinc-800 pt-1">
            {p.route ? (
              <>
                GET spec-sheet → <span className="font-bold text-emerald-400">{p.route.status}</span> ({p.route.ms}ms, {p.route.contentType.split(';')[0]})
                <div>&lt;title&gt; {p.route.title ?? '(없음)'}</div>
                <div>&lt;h1&gt; {p.route.h1Text ?? '(없음)'}</div>
              </>
            ) : (
              <span className="text-zinc-500">{p.routeError ? `요청 실패: ${p.routeError}` : '[page.mdx 라우트 요청] 전입니다.'}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
