import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'
import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import { Lab } from './components/Lab'

export const metadata: Metadata = getDemoMetadata('cache', 'functions/cookies/suspense-boundary')

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="cookies()를 Suspense 안팎에서 읽을 때 정적 셸 도착 순서"
        concept="Cache Components에서 cookies()는 요청 시점 API라 정적 셸에 들어갈 수 없습니다. 읽는 컴포넌트만 <Suspense>로 감싸면 바깥 마크업은 먼저 도착하고 쿠키 영역만 뒤따라 스트리밍되며, 감싸지 않으면 응답 전체가 쿠키 읽기를 기다립니다."
        steps={[
          {
            step: 1,
            title: '쿠키 없는 상태로 [inside 측정], [outside 측정] 누르기',
            description: '두 라우트의 HTML 응답 스트림을 읽어 정적 마커, fallback, 쿠키 영역이 도착한 시각과 순서를 기록합니다.',
            actionBadge: '응답 스트림 측정',
          },
          {
            step: 2,
            title: '[쿠키 발급] 후 같은 측정을 다시 하기',
            description: 'Server Action이 데모 경로 전용 httpOnly 쿠키를 저장합니다. 서버가 읽은 값이 달라져도 도착 순서는 같은지 확인합니다.',
            actionBadge: 'Server Action',
            observe: '표의 "서버가 읽은 값"이 none → kim-shopping으로 바뀌고 도착 순서는 유지됨',
            observeAt: 'playground',
          },
          {
            step: 3,
            title: '검증 패널에서 inside/outside 판정 확인',
            description: 'inside는 fallback이 먼저 오고 쿠키 영역이 뒤따르며, outside는 fallback 없이 함께 도착해야 합니다.',
            actionBadge: '검증',
            observe: '쿠키 없음·있음 조합을 모두 측정하면 검증 완료로 바뀜',
            observeAt: 'verification',
          },
        ]}
      />
      <Lab />
    </DemoContainer>
  )
}
