import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { StaleTimesProvider } from './components/StaleTimesProvider'
import { NavPanel } from './components/NavPanel'
import { MeasurementBoard } from './components/MeasurementBoard'
import { StaleTimesLab } from './components/StaleTimesLab'
import { VerificationFooter } from './components/VerificationFooter'

/**
 * 공유 layout: static ↔ dynamic 이동 중에도 리마운트되지 않으므로 측정기(StaleTimesProvider)가
 * 이동 전후의 RSC 요청을 모두 관찰한다. 측정 대상은 children 슬롯의 두 page다.
 */
export default function StaleTimesLayout({ children }: { children: React.ReactNode }) {
  return (
    <StaleTimesProvider>
      <DemoContainer className="min-w-0 space-y-4 [&_fieldset]:min-w-0 [&_legend]:max-w-full [&_legend]:break-words">
        <DemoGuideCard
          title="experimental.staleTimes 클라이언트 라우터 캐시 시간 제어"
          concept="staleTimes는 브라우저 Client Cache가 받아 둔 page 세그먼트를 서버 확인 없이 재사용하는 시간(초)입니다. 이 앱은 설정하지 않았으므로 기본값(dynamic 0초, static 300초)에서 <Link> 재방문이 RSC 요청을 다시 보내는지 실측합니다."
          className="min-w-0 break-words"
          steps={[
            {
              step: 1,
              title: '[정적 page로 이동 →] / [동적 page로 이동 →]을 번갈아 3회 이상',
              description: '같은 page로 돌아올 때마다 RSC 요청 수와 렌더 ID(새 렌더/재사용)를 기록합니다.',
              actionBadge: '왕복 이동',
              observe: '표의 "이동 중 RSC 요청"과 "렌더 ID" 열, 응답의 x-nextjs-stale-time',
              observeAt: 'playground',
            },
            {
              step: 2,
              title: '잠시 기다렸다 다시 이동',
              description: '"직전 응답 후" 경과 시간이 stale 시간을 넘기 전과 후에 재요청 여부가 어떻게 다른지 봅니다.',
              actionBadge: '시간 경과',
              observe: '검증 패널의 page별 판정',
              observeAt: 'verification',
            },
            {
              step: 3,
              title: '설정 예제를 읽고 [답안 확인], [이동 기록 초기화]로 다시 시작',
              description: '값을 바꿨을 때의 결과는 이 앱에서 실행하지 않고 별도 앱에서 확인할 절차로 정리했습니다.',
              observe: '개념 확인 판정과 대기 상태 복귀',
              observeAt: 'verification',
            },
          ]}
        />
        <DemoPlaygroundCard title="<Link> 재방문 시 RSC 재요청 실측" className="min-w-0">
          <div className="space-y-4">
            <NavPanel />
            {children}
            <MeasurementBoard />
          </div>
        </DemoPlaygroundCard>
        <StaleTimesLab />
        <VerificationFooter />
      </DemoContainer>
    </StaleTimesProvider>
  )
}
