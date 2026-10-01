import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'
import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import { ConditionLab } from './components/ConditionLab'

export const metadata: Metadata = getDemoMetadata('baseline', 'config/redirects/header-query-condition')

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="redirects() 요청 헤더 및 쿼리 기반 조건부 리다이렉트"
        concept="next.config의 redirects()에 has(header/query/cookie/host)와 missing 조건을 걸면, 조건이 맞는 요청만 307으로 보내고 나머지는 그대로 통과시킵니다. 이 화면은 서버가 조건을 실제로 구성한 요청을 보내 상태 코드와 Location을 측정합니다."
        steps={[
          {
            step: 1,
            title: '[규칙 카드] 하나를 고르고 [조건 충족 입력 채우기]',
            description: '카드에 보이는 코드는 next.config에 연결된 실제 규칙입니다. 규칙마다 필요한 헤더·쿠키·쿼리·Host가 입력칸에 채워집니다.',
            actionBadge: '규칙 선택',
          },
          {
            step: 2,
            title: '[서버에서 실제 요청 보내기] 클릭',
            description: 'Server Action이 redirect를 따라가지 않고 요청해 응답을 그대로 읽습니다.',
            actionBadge: '307 확인',
            observe: '상태 코드 307과 destination이 Location으로 표시됨. query 규칙은 campaign 값이 캡처되어 들어감',
            observeAt: 'playground',
          },
          {
            step: 3,
            title: '[조건 미충족 입력 채우기]로 같은 규칙을 다시 요청',
            description: '값을 하나만 어긋나게 하면 리다이렉트 없이 Route Handler의 200 응답이 돌아옵니다. 입력칸을 직접 고쳐 경계도 시험해 보세요.',
            actionBadge: '통과 확인',
            observe: '충족/미충족을 모두 보내면 검증 패널이 검증 완료가 됨',
            observeAt: 'verification',
          },
        ]}
      />
      <ConditionLab />
    </DemoContainer>
  )
}
