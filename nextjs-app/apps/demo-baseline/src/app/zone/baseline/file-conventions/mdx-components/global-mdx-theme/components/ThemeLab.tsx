'use client'
import type { ReactNode } from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard, DemoResetButton } from '@study/demo-kit'
import { useThemeProbe } from '../hooks/useThemeProbe'
import { THEME_NAME } from '../expectations'
import { SnapshotTable } from './SnapshotTable'
import { VerificationFooter } from './VerificationFooter'

const btn =
  'cursor-pointer rounded bg-zinc-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900'
const pane = 'rounded border border-zinc-200 bg-white p-4 text-sm text-zinc-800 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200'

export function ThemeLab({ raw, mapped }: { raw: ReactNode; mapped: ReactNode }) {
  const s = useThemeProbe()
  const latest = s.snapshots[s.themeOn ? 'on' : 'off']
  return (
    <DemoContainer className="space-y-4">
      <DemoGuideCard
        title="src/mdx-components.tsx로 모든 MDX에 스타일 입히기"
        concept="mdx-components.tsx의 useMDXComponents가 돌려준 매핑은 앱의 모든 MDX에 적용된다. 같은 MDX를 전역 매핑 그대로, 그리고 매핑을 되돌린 채로 렌더해 무엇이 달라지는지 잰다."
        steps={[
          { step: 1, title: '[스타일 측정] (테마 래퍼 켬)', description: '왼쪽(매핑 되돌림)과 오른쪽(전역 매핑) 영역의 h1·h2·p·code·a를 getComputedStyle로 읽습니다.', actionBadge: '측정 1', observe: '두 영역의 태그 순서, class, 글자 크기·색', observeAt: 'playground' },
          { step: 2, title: `data-mdx-theme="${THEME_NAME}" 끄고 다시 측정`, description: '두 영역을 감싼 래퍼의 data 속성을 떼고 한 번 더 잽니다. 전역 매핑의 강조색은 이 래퍼 안에서만 켜지도록 작성돼 있습니다.', actionBadge: '측정 2', observe: '오른쪽 a·h1 색이 바뀌는지', observeAt: 'playground' },
          { step: 3, title: '검증 패널 확인', description: '태그 종류 불변, 전역 class 유무, 기본 타이포 유지, 테마 범위를 판정합니다.', actionBadge: '결과 확인', observe: '항목별 ✅/❌', observeAt: 'verification' },
        ]}
      />
      <DemoPlaygroundCard title="content/sample.mdx × 2 — components prop으로 되돌림 / src/mdx-components.tsx 전역 매핑">
        <div className="space-y-3 text-sm">
          <div className="flex flex-wrap items-center gap-3 border-b pb-3 text-xs dark:border-zinc-800">
            <label className="flex cursor-pointer items-center gap-1.5 font-bold text-zinc-700 dark:text-zinc-300">
              <input type="checkbox" checked={s.themeOn} onChange={(e) => s.setThemeOn(e.target.checked)} />
              래퍼에 data-mdx-theme=&quot;{THEME_NAME}&quot;
            </label>
            <button type="button" onClick={s.measure} className={btn}>스타일 측정 ({s.themeOn ? '테마 켬' : '테마 끔'})</button>
            <DemoResetButton onReset={s.reset} />
          </div>
          <div data-mdx-theme={s.themeOn ? THEME_NAME : undefined} className="grid gap-3 sm:grid-cols-2">
            <div>
              <p className="mb-1 font-mono text-xs text-zinc-500">&lt;Sample components={'{'}RAW_TAGS{'}'} /&gt; — 매핑 되돌림</p>
              <div ref={s.rawRef} className={pane}>{raw}</div>
            </div>
            <div>
              <p className="mb-1 font-mono text-xs text-zinc-500">&lt;Sample /&gt; — 전역 매핑 적용</p>
              <div ref={s.mappedRef} className={pane}>{mapped}</div>
            </div>
          </div>
          {latest ? <SnapshotTable snapshot={latest} /> : <p className="text-xs text-zinc-500">현재 테마 상태로 [스타일 측정]을 누르기 전입니다.</p>}
          <p className="font-mono text-xs text-zinc-500">
            측정 기록: 테마 켬 {s.snapshots.on?.measuredAt ?? '-'} · 테마 끔 {s.snapshots.off?.measuredAt ?? '-'}
          </p>
        </div>
      </DemoPlaygroundCard>
      <VerificationFooter snapshots={s.snapshots} />
    </DemoContainer>
  )
}
