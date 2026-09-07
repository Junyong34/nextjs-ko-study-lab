import { getDemoMetadata } from '@study/demos'
import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import type { Metadata } from 'next'
import { ArchA11yFormDemo } from './components/ArchA11yFormDemo'

export const metadata: Metadata = getDemoMetadata('baseline', 'architecture/accessibility/form-aria-support')

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-4">
      <DemoGuideCard
        title="입력 상태와 함께 바뀌는 결제 폼 접근성"
        concept="ARIA 속성은 성공 화면을 꾸미는 문구가 아니라 현재 입력 상태를 보조 기술에 전달하는 DOM 계약입니다."
        steps={[
          {
            step: 1,
            title: '[카드 번호 확인]을 빈 값으로 실행',
            description: '오류가 생길 때만 aria-invalid와 오류 설명 연결이 활성화됩니다.',
            actionBadge: '오류 확인',
          },
          {
            step: 2,
            title: '[4242 4242 4242 4242] 입력 후 다시 확인',
            description: '16자리 입력이 유효하면 오류 연결이 도움말 연결로 교체됩니다.',
            actionBadge: '정상 전환',
          },
          {
            step: 3,
            title: '[검증] 실제 DOM 속성 확인',
            description: '검증 패널은 입력 요소에서 직접 읽은 aria-* 값과 연결 대상 존재 여부를 표시합니다.',
            actionBadge: 'DOM 관찰',
            observe: 'aria-invalid, aria-describedby, 오류 요소 연결 상태',
            observeAt: 'verification',
          },
        ]}
      />
      <ArchA11yFormDemo />
    </DemoContainer>
  )
}
