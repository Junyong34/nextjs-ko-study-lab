import { getDemoMetadata } from '@study/demos'
import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import type { Metadata } from 'next'
import { ArchA11yFocusTrapDemo } from './components/ArchA11yFocusTrapDemo'

export const metadata: Metadata = getDemoMetadata('baseline', 'architecture/accessibility/modal-focus-trap')

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-4">
      <DemoGuideCard
        title="브라우저 modal dialog의 포커스 경계"
        concept="showModal()로 연 실제 다이얼로그는 배경을 비활성화하고 키보드 포커스를 모달 안에 두며, 닫힌 뒤 호출자에게 포커스를 돌려줘야 합니다."
        steps={[
          {
            step: 1,
            title: '[배송지 변경] 선택',
            description: 'dialog.showModal()을 호출하고 첫 입력 요소로 포커스를 옮깁니다.',
            actionBadge: '포커스 진입',
          },
          {
            step: 2,
            title: '[Tab]과 [Shift+Tab]으로 이동',
            description: '활성 요소 id가 다이얼로그 안에서만 바뀌는지 확인합니다.',
            actionBadge: '경계 확인',
          },
          {
            step: 3,
            title: '[Escape] 또는 [적용하고 닫기] 실행',
            description: '닫힌 뒤 배송지 변경 버튼으로 포커스가 복원되는지 확인합니다.',
            actionBadge: '복원 확인',
            observe: '열림 방식, 마지막 활성 요소, 닫기 이유와 복원 대상',
            observeAt: 'verification',
          },
        ]}
      />
      <ArchA11yFocusTrapDemo />
    </DemoContainer>
  )
}
