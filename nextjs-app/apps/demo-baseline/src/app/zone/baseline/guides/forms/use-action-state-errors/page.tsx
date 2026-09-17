import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'
import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import { FormValidationDemo } from './components/FormValidationDemo'

export const metadata: Metadata = getDemoMetadata('baseline', 'guides/forms/use-action-state-errors')

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="useActionState로 서버의 필드 오류 확인하기"
        concept="폼을 제출하면 실제 Server Action의 반환값이 state가 되어 입력 오류와 성공 결과를 표시합니다."
        steps={[
          { step: 1, title: '[주문서 제출 및 검증] 클릭',
            description: '기본값 invalid-email / 0과 기대 시나리오 이메일·수량 오류를 그대로 제출하세요.',
            observe: '두 필드 오류가 함께 표시되고, 서버 거절과 학습 검증 완료가 구분됩니다.', observeAt: 'verification' },
          { step: 2, title: '[올바른 예시 입력] 후 [기대 시나리오]를 성공 응답으로 선택',
            description: 'customer@example.com / 2를 제출해 오류가 사라지고 성공 결과가 나오는지 확인하세요.',
            observe: 'state.status=success, errors={}, data의 이메일과 수량', observeAt: 'verification' },
          { step: 3, title: '[오류 예시 입력] 후 다시 제출',
            description: '성공 응답 기대를 유지하면 불일치가 됩니다. 기대를 이메일·수량 오류로 바꾸어 비교하세요.',
            observe: '실제 서버 반환값은 그대로이고 선택한 기대에 따라 판정이 달라집니다.', observeAt: 'verification' },
          { step: 4, title: '[예제 초기화] 후 재실행',
            description: '입력·응답·기대 시나리오를 초기화합니다. Network에서도 제출마다 실제 POST를 확인할 수 있습니다.',
            observe: '초기화 뒤 검증 패널은 대기 중으로 돌아갑니다.', observeAt: 'verification' },
        ]}
      />
      <FormValidationDemo />
    </DemoContainer>
  )
}
