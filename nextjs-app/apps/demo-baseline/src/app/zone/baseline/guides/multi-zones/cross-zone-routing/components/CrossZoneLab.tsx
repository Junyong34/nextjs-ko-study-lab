'use client'
import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard, DemoResetButton } from '@study/demo-kit'
import type { ServerSeen } from '../types'
import { useZoneProbe } from '../hooks/useZoneProbe'
import { useHopObserver } from '../hooks/useHopObserver'
import { ProbePanel } from './ProbePanel'
import { HopFrame } from './HopFrame'
import { VerificationFooter } from './VerificationFooter'

export function CrossZoneLab({ serverSeen }: { serverSeen: ServerSeen }) {
  const probe = useZoneProbe()
  const hop = useHopObserver()

  const resetAll = () => {
    probe.reset()
    hop.reset()
  }

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="셸 rewrites로 한 origin 아래 두 zone 연결하기"
        concept="셸의 next.config rewrites가 /zone/{slug}/*와 /demo-static/{slug}/*를 각 zone 서버로 전달한다. 같은 origin에 문서를 요청해 실제로 어느 zone이 응답하는지 확인하고, zone 경계를 <Link>와 <a>로 넘을 때 문서가 새로 로드되는지 측정한다."
        steps={[
          {
            step: 1,
            title: '[같은 origin 응답 측정] 실행',
            description: '학습자 URL, 이 페이지의 내부 URL, cache zone 페이지와 그 정적 자산을 지금 origin에 요청해 응답한 zone을 script 접두사와 헤더로 판별합니다.',
            actionBadge: '문서 요청',
            observe: '경로별 응답 zone과 x-powered-by 차이',
            observeAt: 'playground',
          },
          {
            step: 2,
            title: '아래 iframe에서 같은 zone 링크 2개 클릭',
            description: '<Link>와 <a>로 같은 baseline 화면에 갑니다. 한 번 누른 뒤 [출발 화면으로]를 눌러 다음 링크를 시험합니다.',
            actionBadge: '같은 zone 이동',
            observe: '문서 유지(soft) / 새 문서 로드',
            observeAt: 'playground',
          },
          {
            step: 3,
            title: 'cache zone 링크 2개 클릭',
            description: '<Link>는 경계를 넘지 못해 멈추거나 전체 로드로 대체되고, <a>는 전체 로드로 cache zone 화면에 도착합니다.',
            actionBadge: 'zone 경계 이동',
            observe: 'iframe 문서의 timeOrigin, 주소, script 접두사',
            observeAt: 'verification',
          },
        ]}
      />
      <DemoPlaygroundCard title="같은 origin에서 baseline zone과 cache zone 응답 비교">
        <div className="space-y-4">
          <ProbePanel serverSeen={serverSeen} run={probe.run} error={probe.error} isPending={probe.isPending} onProbe={probe.probe} />
          <HopFrame
            frameRef={hop.frameRef}
            frameKey={hop.frameKey}
            onLoad={hop.onLoad}
            pending={hop.pending}
            hops={hop.hops}
            onBack={hop.backToStart}
          />
          <div className="flex justify-end">
            <DemoResetButton onReset={resetAll} />
          </div>
        </div>
      </DemoPlaygroundCard>
      <VerificationFooter run={probe.run} hops={hop.hops} />
    </DemoContainer>
  )
}
