import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'
import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import { FormStatusDemo } from './components/FormStatusDemo'

export const metadata: Metadata = getDemoMetadata('baseline', 'guides/forms/use-form-status-spinner')

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard title="useFormStatus로 서버 제출 상태 관찰"
        concept="useFormStatus는 form 안의 자식에서 제출 중 pending과 data를 읽습니다. 폼 밖의 훅은 그 제출을 구독하지 않습니다."
        steps={[
          { step: 1, title: '수량 2로 예시 주문 접수', description: '상품을 확인하고 수량 2를 입력한 뒤 예시 주문 접수 버튼을 누릅니다.', actionBadge: '제출' },
          { step: 2, title: '서버 응답 전후 비교', description: '1.2초 관측용 서버 지연 동안 스피너·disabled·data를 확인하세요. 폼 밖 pending은 false입니다.', actionBadge: '관찰' },
          { step: 3, title: '수량 0으로 서버 거절 확인', description: '수량 0을 제출하면 서버 오류가 표시됩니다. pending 종료와 접수 성공을 구별하고 이번 제출 이력을 확인하세요.', actionBadge: '거절 비교', observe: '이번 제출의 false → true → false 및 서버 입력 일치', observeAt: 'playground' },
          { step: 4, title: '[예제 초기화] 후 재실행', description: '예제 초기화를 누르면 응답과 관측 이력이 비워지고 검증 대기로 돌아갑니다.', actionBadge: '초기화', observe: '서버 응답과 이전 관측 이력이 사라지고 검증 대기 표시', observeAt: 'verification' },
        ]} />
      <FormStatusDemo />
    </DemoContainer>
  )
}
