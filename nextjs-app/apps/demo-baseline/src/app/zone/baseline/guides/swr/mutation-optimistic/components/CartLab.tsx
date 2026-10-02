'use client'
import React, { useMemo, useState } from 'react'
import { SWRConfig } from 'swr'
import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import { createFetcher, resetServerCart } from '../lib/client-api'
import { DEDUPING_INTERVAL } from '../hooks/useCartMutation'
import { useEventLog } from '../hooks/useEventLog'
import { LabBody } from './LabBody'

export function CartLab() {
  const log = useEventLog()
  // 초기화 때 key를 바꿔 SWRConfig를 다시 마운트한다. provider가 새 Map을 만들어 이 데모의 캐시만 비운다.
  const [cacheGen, setCacheGen] = useState(0)
  const fetcher = useMemo(() => createFetcher(log.record), [log.record])

  const reset = async () => {
    await resetServerCart()
    log.clear()
    setCacheGen((g) => g + 1)
  }

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="SWR mutate() 낙관적 갱신과 롤백"
        concept="mutate(키, 쓰기 Promise, { optimisticData, rollbackOnError, populateCache, revalidate })는 같은 키를 읽는 모든 컴포넌트의 화면을 서버 응답 전에 바꾸고, 응답이 오면 서버 확정값으로 교체하거나 실패 시 이전 값으로 되돌린다. 실제 Route Handler에 지연·실패를 걸고 요청 순서와 화면 값 이력을 함께 잰다."
        steps={[
          { step: 1, title: '수량 [+] 누르기', description: 'PATCH 응답 지연 1500ms로 두고 텀블러 수량을 올립니다. 목록과 상단 배지가 응답 전에 함께 바뀝니다.', actionBadge: '낙관적 갱신', observe: '화면 값 변경이 PATCH 응답보다 먼저 기록됨', observeAt: 'playground' },
          { step: 2, title: '재고 상한 넘기기', description: '텀블러를 3개(재고)에서 한 번 더 올리면 화면은 4를 먼저 보이고, 서버가 3으로 확정한 응답이 오면 3으로 바뀝니다.', actionBadge: '서버 확정값' },
          { step: 3, title: '[서버가 PATCH를 500으로 거절] 켜고 다시 변경', description: '서버는 저장하지 않고 500을 돌려줍니다. rollbackOnError가 화면을 이전 값으로 되돌립니다.', actionBadge: '롤백', observe: '최종 표시값 = 변경 전 값, 서버 저장소도 그대로', observeAt: 'verification' },
          { step: 4, title: '[같은 키 구독 컴포넌트 추가]', description: '마지막 GET 후 2초 안과 밖에서 각각 눌러 dedupingInterval에 따른 요청 생략을 확인합니다.', actionBadge: '중복 제거', observe: '새 GET 0회 또는 1회', observeAt: 'verification' },
        ]}
      />
      <SWRConfig
        key={cacheGen}
        value={{
          provider: () => new Map(),
          fetcher,
          dedupingInterval: DEDUPING_INTERVAL,
          // 창 포커스 재검증은 끈다. 실습 조작과 무관한 GET이 기록에 섞이지 않게 하기 위해서다.
          revalidateOnFocus: false,
        }}
      >
        <LabBody log={log} onReset={reset} />
      </SWRConfig>
    </DemoContainer>
  )
}
