import {
  showcaseDemos,
  groupLabels,
  type DemoGroup,
  type DemoMeta,
  type DemoKey,
} from '@study/ui/reference-visualize/toolkit'

export type NextjsDemoGroup = Exclude<DemoGroup, 'generic'>

/**
 * Next.js와 무관한 범용 모듈(generic)을 제외한 순수 Next.js 시각화 그룹 목록
 */
export const VISUALIZE_GROUPS: NextjsDemoGroup[] = [
  'timeline',
  'nextjs',
  'cache-components',
]

/**
 * Next.js 학습에 직결되는 15개 시각화 데모 컬렉션
 */
export const nextjsVisualizeDemos: DemoMeta[] = showcaseDemos.filter(
  (demo) => demo.group !== 'generic'
)

/**
 * React 핵심 런타임 기능에 해당하는 데모 목록 및 라벨 매핑
 */
const REACT_DEMOS: Record<string, string> = {
  'hydration-timeline': 'React · Selective Hydration',
  'transitions-timeline': 'React · Transitions',
  'optimistic-timeline': 'React · Optimistic UI',
  'streaming-timeline': 'React · Streaming SSR',
}

/**
 * Next.js 및 React 시각화 뱃지 스타일 반환 함수
 * - 화려한 색상을 배제하고 저장소 디자인 가이드에 맞춰 차분한 Zinc 중성색 톤으로 통일
 * - 텍스트 접두사(React · ... / Next.js · ...)로 기술 범주를 명확하게 구분
 */
export function getDemoBadge(demo: { key: string; category: string }): {
  label: string
  className: string
  isReact: boolean
} {
  const reactLabel = REACT_DEMOS[demo.key]
  const isReact = Boolean(reactLabel)

  if (isReact) {
    return {
      label: reactLabel,
      className:
        'border border-zinc-200 bg-zinc-50 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-400',
      isReact: true,
    }
  }

  // Next.js: 살짝 진짜 조금 더 어둡고 또렷한 톤
  return {
    label: demo.category,
    className:
      'border border-zinc-300/80 bg-zinc-100 text-zinc-900 font-semibold dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100',
    isReact: false,
  }
}

export { groupLabels, type DemoGroup, type DemoKey, type DemoMeta }
