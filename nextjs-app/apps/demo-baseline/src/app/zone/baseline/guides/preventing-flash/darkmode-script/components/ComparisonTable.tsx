import { frameText, ms, type ProbeSummary } from '../lib/summarize'

type Row = [label: string, pick: (s: ProbeSummary) => string]

const ROWS: Row[] = [
  ['목표 테마 (저장값 판정)', (s) => s.target],
  ['인라인 스크립트가 data-theme 설정', (s) => (s.scriptAt ? `${s.scriptAt.theme} @ ${ms(s.scriptAt.t)}` : '없음')],
  ['first-contentful-paint (화면 표시 시각)', (s) => ms(s.fcp)],
  ['첫 rAF 프레임 (theme / 배경색)', (s) => frameText(s.firstFrame)],
  ['하이드레이션 직후 data-theme', (s) => `${s.themeAtHydration ?? '-'} @ ${ms(s.hydratedAt)}`],
  ['잘못된 테마로 그려진 프레임', (s) => `${s.wrongFrames}프레임 / ${ms(s.wrongMs)}`],
  ['최종 (theme / 배경색)', (s) => frameText(s.finalFrame)],
  ['hydration 경고 (console.error 등)', (s) => `${s.errors.length}건`],
]

/** 두 iframe의 프로브 값을 행 단위로 나란히 보여 준다. 시각은 각 문서의 navigationStart 기준이다. */
export function ComparisonTable({ effect, script }: { effect: ProbeSummary | null; script: ProbeSummary | null }) {
  const cell = (s: ProbeSummary | null, pick: Row[1]) => (s ? pick(s) : '측정 대기')
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full min-w-[560px] border-collapse font-mono text-[11px]">
        <thead>
          <tr className="border-b border-zinc-200 text-left text-zinc-500 dark:border-zinc-800">
            <th className="py-1.5 pr-3 font-medium">측정 항목</th>
            <th className="py-1.5 pr-3 font-medium">A. useEffect</th>
            <th className="py-1.5 font-medium">B. 인라인 스크립트</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map(([label, pick]) => (
            <tr key={label} className="border-b border-zinc-100 align-top dark:border-zinc-900">
              <td className="py-1.5 pr-3 text-zinc-500">{label}</td>
              <td className="py-1.5 pr-3 break-all">{cell(effect, pick)}</td>
              <td className="py-1.5 break-all">{cell(script, pick)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-2 text-[11px] leading-relaxed text-zinc-500">
        rAF 콜백에서 읽은 값이 그 프레임에 그려지는 값입니다(FCP는 화면 표시 시각이라 rAF보다 늦게 찍힙니다).
        CPU가 느릴수록 A의 잘못된 프레임 수가 늘어납니다. DevTools Performance 탭에서 CPU 4x~6x slowdown을 건 뒤
        [두 방식 다시 로드]로 비교해 보세요. hydration 경고는 React 개발 빌드에서만 콘솔로 보고됩니다.
      </p>
    </div>
  )
}
