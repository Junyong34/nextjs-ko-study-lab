import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'guides/instant-navigation/loading-skeleton')

/**
 * 시작 화면. 가이드·실습·검증 영역은 공유 layout.tsx가 그리고,
 * 이 page는 layout의 children 슬롯(측정 대상 영역)의 초기 내용만 담당한다.
 */
export default function DemoPage() {
  return (
    <section className="rounded-lg border border-dashed border-zinc-300 p-4 text-xs leading-relaxed text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
      <p className="font-semibold text-zinc-900 dark:text-zinc-100">시작 화면 (loading-skeleton/page.tsx)</p>
      <p className="mt-1">
        위 두 링크 중 하나를 클릭하면 이 영역이 하위 page로 바뀝니다. 클릭 시각, 스켈레톤이 이 영역에 처음 붙은 시각,
        최종 카탈로그가 붙은 시각을 브라우저가 직접 기록합니다.
      </p>
    </section>
  )
}
