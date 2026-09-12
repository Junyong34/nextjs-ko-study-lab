import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'
import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import { RedirectHandler307Demo } from './components/RedirectHandler307Demo'

export const metadata: Metadata = getDemoMetadata('baseline', 'functions/redirect/handler-307')

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="접수 주소가 바뀌어도 POST 본문이 유지될까?"
        concept="이전 접수 주소가 307로 응답하면 브라우저는 새 주소에도 같은 메서드와 본문을 보냅니다."
        steps={[
          {
            step: 1,
            title: '상품·수량을 고르고 POST로 접수 요청 보내기',
            description: '개발자 도구 Network를 열고 접수 요청을 보내세요. submit 요청 뒤 receipt 요청이 이어집니다.',
            actionBadge: '접수 요청 보내기',
          },
          {
            step: 2,
            title: '새 접수 주소가 받은 값을 확인하기',
            description: '검증에서 수신 POST·JSON 본문·상품·수량을 확인하세요. Network의 submit은 307과 Location, receipt는 POST와 최종 200을 보여줍니다.',
            actionBadge: 'POST 보존 확인',
            observe: '새 접수 주소에서 POST와 본문을 그대로 수신하고 검증 완료가 표시됩니다.',
            observeAt: 'verification',
          },
          {
            step: 3,
            title: 'GET으로 바꿔 비교하고 초기화하기',
            description: 'GET으로 다시 보내면 서버는 GET과 query를 받습니다. POST 목표에는 불일치지만 307은 정상 동작한 것입니다. 초기화한 뒤 POST를 다시 보내세요.',
            actionBadge: 'GET 비교',
          },
        ]}
      />
      <RedirectHandler307Demo />
    </DemoContainer>
  )
}
