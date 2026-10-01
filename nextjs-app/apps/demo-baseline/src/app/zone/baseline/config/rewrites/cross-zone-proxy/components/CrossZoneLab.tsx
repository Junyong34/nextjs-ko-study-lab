'use client'
import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { useCrossZoneProbe } from '../hooks/useCrossZoneProbe'
import { ProxyPanel } from './ProxyPanel'
import { VerificationFooter } from './VerificationFooter'

export function CrossZoneLab({ upstream }: { upstream: string }) {
  const s = useCrossZoneProbe()
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="rewrites() Zone 간 라우팅 및 외부 API 프록시"
        concept="rewrites()의 destination에 외부 URL을 적으면 Next.js 서버가 그 서버로 요청을 프록시하고 응답을 그대로 돌려준다. 이 데모는 baseline zone의 경로 일부를 별도 Next.js 서버인 cache zone으로 실제로 프록시하고, 응답이 어느 zone에서 왔는지 헤더와 본문으로 잰다."
        steps={[
          { step: 1, title: '제목 입력과 예측', description: 'OG 제목을 정하고, 보낼 요청에 어느 zone이 응답할지 예측합니다.', actionBadge: '예측' },
          { step: 2, title: '[Zone 페이지 프록시] 요청', description: '/via-cache/caching/basic 으로 실제 fetch를 보냅니다. 응답 HTML의 자산 경로와 X-Powered-By 헤더로 응답한 zone을 판정합니다.', actionBadge: '요청 실행', observe: 'URL은 그대로, 상태 200, 응답한 zone은 cache', observeAt: 'playground' },
          { step: 3, title: '[Route Handler 프록시]·[업스트림 404 전달]·[대조군] 비교', description: 'cache zone의 OG Route Handler가 만든 PNG를 baseline 자체 /og와 나란히 비교하고, 규칙 밖 경로는 baseline이 그대로 404를 내는지 봅니다.', actionBadge: '비교', observe: '두 이미지의 상단 문구(eyebrow)가 다름', observeAt: 'playground' },
          { step: 4, title: '검증 패널 확인', description: '가장 최근 요청의 실측값을 규칙에서 도출한 기대값과 항목별로 대조합니다. cache zone 서버를 끄고 다시 보내면 실제 500 응답이 표시됩니다.', actionBadge: '결과 확인', observe: '항목별 ✅/❌', observeAt: 'verification' },
        ]}
      />
      <DemoPlaygroundCard title="Zone 간 프록시 요청 실측 실습">
        <ProxyPanel
          upstream={upstream}
          title={s.title}
          onTitleChange={s.setTitle}
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
