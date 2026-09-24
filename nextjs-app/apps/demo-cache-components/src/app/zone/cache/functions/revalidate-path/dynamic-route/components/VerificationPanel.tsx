'use client'

import React from 'react'
import { ExpectedActualPanel } from '@study/demo-kit'
import type { RoundResult } from '../types'

const MODE_LABEL: Record<RoundResult['mode'], string> = {
  reload: '대조군(다시 요청만)',
  literal: '구체 경로',
  'pattern-page': "패턴 + 'page'",
  'pattern-no-type': 'type 누락 패턴',
}

const formatIds = (ids: string[]) => (ids.length ? ids.map((id) => `/products/${id}`).join(', ') : '없음')

export function VerificationPanel({ round, busy }: { round: RoundResult | null; busy: boolean }) {
  const isMatched = round
    ? round.expectedChanged.length === round.actualChanged.length &&
      round.expectedChanged.every((id) => round.actualChanged.includes(id))
    : undefined

  return (
    <ExpectedActualPanel
      title="어떤 id의 캐시가 재생성됐는가"
      isMatched={isMatched}
      description={
        busy
          ? '각 상품 경로를 다시 요청하고 새 cacheId를 수집하는 중입니다.'
          : '실행 전후 iframe이 보고한 cacheId를 비교해 실제로 재생성된 id를 계산합니다.'
      }
      expected={
        <span>
          {'• 구체 경로 → /products/1 만 재생성\n'}
          {"• 패턴 + 'page' → /products/1, 2, 3 모두 재생성\n"}
          {'• type 누락 패턴 → 재생성 없음 (서버 경고)\n'}
          {'• 대조군 → 재생성 없음'}
          {round && `\n\n이번 실행(${MODE_LABEL[round.mode]}) 기대: ${formatIds(round.expectedChanged)}`}
        </span>
      }
      actual={
        <span>
          {round
            ? `실행: ${round.call}\n재생성된 경로: ${formatIds(round.actualChanged)}`
            : '• 아직 실행 기록이 없습니다. 실습 화면의 버튼을 눌러 주세요.'}
        </span>
      }
    />
  )
}
