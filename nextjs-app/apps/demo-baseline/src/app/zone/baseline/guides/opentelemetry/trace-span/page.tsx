import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'guides/opentelemetry/trace-span')

import React from 'react'
import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import { runTraceProbe } from './lib/probe'
import { TraceLab } from './components/TraceLab'
import { ConceptCard } from './components/ConceptCard'

export default async function DemoPage() {
  // 서버 컴포넌트 렌더링 중 실제 활성 span을 읽고 demo.child span 안에서 echo Route Handler를 호출한다.
  const probe = await runTraceProbe()

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="Trace ID 발급 및 Server Component Span"
        concept="instrumentation.ts에서 @vercel/otel을 등록하면 Next.js가 요청마다 traceId를 발급하고 렌더링 구간을 span으로 기록합니다. 서버 컴포넌트에서 연 커스텀 span과 fetch로 부른 Route Handler가 같은 trace에 이어지는지 이 서버의 span 버퍼에서 직접 확인합니다."
        steps={[
          {
            step: 1,
            title: '페이지 상단의 활성 traceId와 echo가 받은 traceparent 비교',
            description: '이 페이지 요청이 렌더링될 때 서버 컴포넌트가 trace.getActiveSpan()으로 읽은 값입니다. traceparent 가운데 32자리가 같은 traceId여야 합니다.',
            actionBadge: 'Trace ID 확인',
            observe: '활성 traceId = traceparent의 traceId = echo의 traceId',
            observeAt: 'playground',
          },
          {
            step: 2,
            title: '[이 요청의 span 수집] 클릭',
            description: 'spans/route.ts가 instrumentation이 모아 둔 링버퍼에서 이 traceId의 span만 읽어 부모 관계대로 그립니다.',
            actionBadge: 'span 트리',
            observe: '활성 span → demo.child → fetch GET … → GET …/echo(원격 부모)',
            observeAt: 'verification',
          },
          {
            step: 3,
            title: '[새 요청 보내기]와 [브라우저에서 echo 직접 호출] 비교',
            description: '새 요청은 새 traceId를 받습니다(RSC 요청이라 root span 이름이 RSC GET으로 바뀝니다). 브라우저에서 echo를 직접 부르면 traceparent가 없어 trace가 끊기므로 검증이 불일치로 바뀝니다.',
            actionBadge: '전파 비교',
            observe: '검증 완료 ↔ 불일치(traceparent 없음)',
            observeAt: 'verification',
          },
        ]}
      />
      {/* 요청마다 traceId가 바뀌므로 key로 클라이언트 상태(수집 결과)를 새 요청 기준으로 초기화한다. */}
      <TraceLab key={probe.traceId ?? probe.renderedAt} probe={probe} />
      <ConceptCard />
    </DemoContainer>
  )
}
