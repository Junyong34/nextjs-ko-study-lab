'use client'

import { usePathname } from 'next/navigation'
import { ExpectedActualPanel } from '@study/demo-kit'
import { useBootProbe } from '../hooks/useBootProbe'
import type { GroupId } from '../types'
import { RouteGroupsDeepDive } from './RouteGroupsDeepDive'

const GROUP_LABEL: Record<GroupId, string> = {
  index: '실습 홈 (그룹 밖)',
  shop: '(shop) 그룹 — /products',
  admin: '(admin) 그룹 — /dashboard',
}

export function VerificationFooter({ currentGroup }: { currentGroup: GroupId }) {
  const pathname = usePathname()
  const probe = useBootProbe(currentGroup)

  const hasCrossed = probe !== null && probe.crossedGroup
  const previousLabel = probe?.previousGroup ? GROUP_LABEL[probe.previousGroup] : '없음'

  const expected = !hasCrossed
    ? '아직 (shop) ↔ (admin) 그룹 간 이동 기록이 없습니다.\n실습 화면에서 다른 그룹의 페이지로 이동해 보세요.'
    : '이 zone은 이미 최상위 app/layout.tsx가 <html>/<body>를 정의하고 있어,\n(shop)/(admin) 하위 layout.tsx는 공식 정의상 root layout이 될 수 없다.\n→ 그룹을 넘나들어도 문서 전체 리로드 없이 소프트 내비게이션으로 유지돼야 한다.'

  const actual = !hasCrossed
    ? `usePathname(): "${pathname}"\nBOOT_ID: ${probe?.currentBootId ?? '측정 준비 중'}\n그룹 간 이동 기록: 없음`
    : [
        `usePathname(): "${pathname}"`,
        `직전 그룹 → 현재 그룹: ${previousLabel} → ${GROUP_LABEL[currentGroup]}`,
        `직전 BOOT_ID: ${probe!.previousBootId}`,
        `현재 BOOT_ID: ${probe!.currentBootId}`,
        `판정: ${
          probe!.survivedNavigation
            ? 'BOOT_ID 유지됨 → 소프트 내비게이션 확인 (전체 리로드 없음)'
            : 'BOOT_ID 변경됨 → 문서 전체 리로드가 실제로 발생함'
        }`,
      ].join('\n')

  const isMatched = hasCrossed ? probe!.survivedNavigation === true : undefined

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="(shop) ↔ (admin) 이동 시 실제 리로드 여부"
        expected={<>{expected}</>}
        actual={<>{actual}</>}
        isMatched={isMatched}
        description="모듈 스코프 상수 BOOT_ID가 그룹 이동 전후로 같은 값을 유지하는지 sessionStorage에 실측 기록해 비교합니다. 값이 유지되면 JS 실행 컨텍스트가 살아있었다는 뜻이라 소프트 내비게이션, 값이 바뀌면 문서가 통째로 다시 로드된 것입니다."
      />
      <RouteGroupsDeepDive />
    </div>
  )
}
