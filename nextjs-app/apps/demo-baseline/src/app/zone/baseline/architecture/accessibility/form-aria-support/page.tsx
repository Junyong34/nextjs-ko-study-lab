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
        concept="ARIA 속성은 입력 오류와 설명을 보조 기술에 전달합니다. 제출과 입력 수정에 따라 실제 속성이 어떻게 바뀌는지 확인하세요."
        steps={[
          {
            step: 1,
            title: '[카드 번호 확인]을 빈 값으로 실행',
            description: '오류가 생길 때만 aria-invalid와 오류 설명 연결이 활성화됩니다.',
            actionBadge: '오류 확인',
          },
          {
            step: 2,
            title: '16자리 값으로 수정',
            description: '첫 제출 후에는 입력을 고치는 즉시 다시 검사합니다. 16자리로 고치면 오류 대신 도움말이 연결됩니다.',
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
          { step: 4, title: '17자리·문자·구분자 비교 후 초기화', description: '예시 버튼으로 값을 채워 검사하고 예제 초기화로 대기 상태에 돌아갑니다.' },
        ]}
      />
      <ArchA11yFormDemo />
    </DemoContainer>
  )
}
