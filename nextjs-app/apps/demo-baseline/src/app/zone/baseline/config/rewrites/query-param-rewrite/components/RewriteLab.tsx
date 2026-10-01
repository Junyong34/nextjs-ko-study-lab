'use client'
import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { useRewriteProbe } from '../hooks/useRewriteProbe'
import { RewritePanel } from './RewritePanel'
import { VerificationFooter } from './VerificationFooter'

export function RewriteLab() {
  const s = useRewriteProbe()
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="rewrites() 쿼리 파라미터 매핑 라우팅"
        concept="redirect는 3xx로 브라우저에 새 주소를 알려 URL이 바뀌지만, rewrite는 같은 요청 안에서 내부 목적지만 바꿔 URL이 그대로다. has(query)의 캡처 그룹과 :파라미터로 /old?id=123 같은 요청을 /products/123?source=rewrite 로 매핑한 뒤, 목적지 페이지가 실제로 받은 값을 잰다."
        steps={[
          { step: 1, title: '값 입력과 예측', description: '숫자 값을 정하고, 이 요청에 next.config의 rewrite가 적용될지 예측합니다.', actionBadge: '예측' },
          { step: 2, title: '[쿼리 → 경로] 요청', description: '/old?id=값 으로 실제 fetch를 보냅니다. 목적지 /products/[id]가 받은 params·searchParams를 응답 HTML에서 읽습니다.', actionBadge: '요청 실행', observe: '요청 URL과 렌더된 목적지가 다르고 상태는 200', observeAt: 'playground' },
          { step: 3, title: '[경로 → 쿼리], [has 값 불일치], [쿼리 없음], [목적지 직접 접근] 비교', description: '규칙이 적용되는 요청과 적용되지 않는 요청을 나란히 보냅니다. 적용되지 않으면 /old에는 page가 없어 404입니다.', actionBadge: '비교', observe: 'source=rewrite는 rewrite를 거친 요청에만 존재', observeAt: 'playground' },
          { step: 4, title: '검증 패널 확인', description: '가장 최근 요청의 실측값을 규칙에서 도출한 기대값과 항목별로 대조합니다. 예측이 틀리면 불일치입니다.', actionBadge: '결과 확인', observe: '항목별 ✅/❌', observeAt: 'verification' },
        ]}
      />
      <DemoPlaygroundCard title="rewrite 요청 실측 실습">
        <RewritePanel
          value={s.value}
          onValueChange={s.changeValue}
          prediction={s.prediction}
          onPredict={s.setPrediction}
          results={s.results}
          error={s.error}
          isPending={s.isPending}
          onSend={s.send}
          onReset={s.reset}
        />
      </DemoPlaygroundCard>
      <VerificationFooter latest={s.results[0]} />
    </DemoContainer>
  )
}
