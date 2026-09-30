'use client'

import { ExpectedActualPanel } from '@study/demo-kit'
import { USER_LABELS, type CartUserId, type PrivateCartResult } from '../types'
import { CartDeepDive } from './CartDeepDive'

export interface Observation {
  cacheId: string
  itemIds: string[]
  bodyRuns: number
}

interface Props {
  data: PrivateCartResult
  target: CartUserId | null
  isPending: boolean
  refetches: number
  seen: Partial<Record<CartUserId, Observation>>
}

export function VerificationFooter({ data, target, isPending, refetches, seen }: Props) {
  const a = seen.user_A
  const b = seen.user_B
  const bothSeen = Boolean(a && b)
  const isolated = a && b ? a.cacheId !== b.cacheId && !a.itemIds.some((id) => b.itemIds.includes(id)) : undefined

  // 대기: 아직 전환하지 않았거나 전환 중. 판정: 목표 사용자와 쿠키가 읽은 사용자가 같고, 두 사용자를 봤다면 격리까지 만족.
  const settled = target !== null && !isPending
  const targetOk = data.userId === target
  const isMatched = !settled ? undefined : !targetOk ? false : bothSeen ? isolated : undefined

  const lines = [
    `- 목표 사용자: ${target ? USER_LABELS[target] : '(아직 전환하지 않음)'}`,
    `- 쿠키가 읽힌 사용자: ${data.userId} · cacheId #${data.cacheId} · bodyRuns ${data.bodyRuns}`,
    `- A 관찰: ${a ? `#${a.cacheId} [${a.itemIds.join(',')}]` : '-'} / B 관찰: ${b ? `#${b.cacheId} [${b.itemIds.join(',')}]` : '-'}`,
    `- 격리: ${bothSeen ? (isolated ? 'cacheId·상품 모두 분리됨' : '섞임 감지') : 'A와 B를 모두 조회하면 판정'} · 다시 조회 ${refetches}회`,
  ].join('\n')

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="'use cache: private' 사용자별 격리 검증 결과"
        expected="전환한 사용자의 쿠키를 함수 스코프 안에서 읽어 그 사용자의 장바구니만 반환한다. A와 B를 모두 조회하면 cacheId와 상품이 서로 달라야 한다."
        actual={<span className="whitespace-pre-wrap">{isPending ? '쿠키 변경 및 재렌더 중...' : lines}</span>}
        isMatched={isMatched}
        description={
          !settled
            ? '사용자 전환 버튼을 누르면 실측값으로 판정한다. 쿠키와 목표가 어긋나면 실패, 두 사용자가 섞여도 실패한다.'
            : bothSeen
              ? '실측한 두 사용자의 관찰값을 비교해 판정했다.'
              : '목표 사용자와 일치한다. 다른 사용자도 전환해 격리를 확인하라.'
        }
      />
      <CartDeepDive />
    </div>
  )
}
