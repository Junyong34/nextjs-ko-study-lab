import type { ProbeResult } from '../types'

export function ProbeCard({ title, runtime, result }: { title: string; runtime: string; result: ProbeResult }) {
  return (
    <div className="rounded border border-zinc-200 bg-zinc-50 p-3 text-xs dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-bold text-zinc-800 dark:text-zinc-200">{title}</span>
        <code className="rounded bg-zinc-200 px-1.5 py-0.5 text-[10px] dark:bg-zinc-800">runtime = &apos;{runtime}&apos;</code>
      </div>
      {result.status === 'idle' && <p className="text-zinc-500">아직 호출하지 않았습니다.</p>}
      {result.status === 'loading' && <p className="text-zinc-500">호출 중...</p>}
      {result.status === 'error' && <p className="text-rose-600">호출 실패: {result.message}</p>}
      {result.status === 'ok' && (
        <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 font-mono text-[11px]">
          <dt className="text-zinc-500">NEXT_RUNTIME</dt>
          <dd>{result.data.nextRuntime}</dd>
          <dt className="text-zinc-500">typeof EdgeRuntime</dt>
          <dd>{result.data.edgeRuntimeGlobal}</dd>
          <dt className="text-zinc-500">읽으려는 파일</dt>
          <dd>{result.data.file}</dd>
          <dt className="text-zinc-500">fs 모듈 로드</dt>
          <dd className={result.data.moduleBlocked ? 'font-bold text-rose-600' : 'text-emerald-600'}>
            {result.data.moduleBlocked ? '차단됨' : '성공'}
          </dd>
          <dt className="text-zinc-500">파일 읽기</dt>
          <dd className={result.data.ok ? 'font-bold text-emerald-600' : 'text-rose-600'}>
            {result.data.ok ? `성공 (${result.data.bytes} bytes)` : '실패'}
          </dd>
          {result.data.errorName && (
            <>
              <dt className="text-zinc-500">에러</dt>
              <dd className="break-all">
                {result.data.errorName}: {result.data.errorMessage}
              </dd>
            </>
          )}
        </dl>
      )}
    </div>
  )
}
