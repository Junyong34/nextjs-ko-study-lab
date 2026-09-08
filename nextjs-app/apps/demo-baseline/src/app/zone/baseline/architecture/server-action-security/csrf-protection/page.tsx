import { getDemoMetadata } from '@study/demos'
import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import type { Metadata } from 'next'
import { ArchServerActionCsrfDemo } from './components/ArchServerActionCsrfDemo'

export const metadata: Metadata = getDemoMetadata('baseline', 'architecture/server-action-security/csrf-protection')

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-4">
      <DemoGuideCard
        title="Server Action 정상 요청과 출처 검사"
        concept="Next.js는 Server Action POST의 Origin과 Host 계열 헤더를 액션 실행 전에 비교합니다. 같은 출처 호출은 액션에 도달하고 불일치는 도달 전에 중단됩니다."
        steps={[
          {
            step: 1,
            title: '[같은 출처 Server Action 실행] 선택',
            description: '브라우저가 실제 Server Action POST 요청을 전송합니다.',
            actionBadge: 'POST 실행',
          },
          {
            step: 2,
            title: '[검증] 요청 헤더 확인',
            description: '액션 내부의 headers()로 Origin, Host, X-Forwarded-Host를 읽습니다.',
            actionBadge: '서버 관찰',
            observe: '요청이 액션에 도달했는지와 서버가 받은 헤더',
            observeAt: 'verification',
          },
          {
            step: 3,
            title: '로컬 차단 실습 펼치기',
            description: '로컬 전용 절차에 따라 정상 POST를 복사하고 Origin만 바꿔 차단 로그를 확인합니다.',
            actionBadge: '네트워크 확인',
            observe: 'POST 메서드와 Server Action 응답',
            observeAt: 'network',
          },
        ]}
      />
      <ArchServerActionCsrfDemo />
    </DemoContainer>
  )
}
