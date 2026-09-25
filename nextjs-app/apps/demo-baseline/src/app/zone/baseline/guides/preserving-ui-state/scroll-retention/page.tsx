import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'
import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import { RetentionWorkbench } from './components/RetentionWorkbench'
import { RetentionDeepDive } from './components/RetentionDeepDive'

export const metadata: Metadata = getDemoMetadata('baseline', 'guides/preserving-ui-state/scroll-retention')

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="searchParams 필터 변경 시 문서 scrollY와 목록 scrollTop 보존 비교"
        concept="?cat=만 바꾸는 필터 이동도 Page 재렌더링이라, 기본 Link·router.push는 Page 상단이 뷰포트 밖이면 문서를 Page 상단으로 올립니다. scroll={false} / { scroll: false }는 문서 위치를 그대로 두고, 목록 컨테이너의 scrollTop은 DOM이 유지되는 한 방법과 무관하게 남습니다(key를 바꾸면 초기화). 고정 높이 창 안의 실제 라우트에서 전후 값을 실측합니다."
        steps={[
          {
            step: 1,
            title: '실습 창의 [측정 준비] 클릭 (또는 두 패널과 문서를 직접 스크롤)',
            description: '패널 A·B scrollTop 240, 문서 scrollY 700으로 Page 상단이 뷰포트 위로 사라집니다. 헤더 HUD 값이 바뀝니다.',
            actionBadge: '스크롤',
          },
          {
            step: 2,
            title: '[Link · 기본]과 [push · 기본] 클릭 — 매번 [측정 준비] 후',
            description: 'URL은 ?cat=만 바뀌고 서버가 새 목록을 렌더링합니다. scrollY는 Page 상단 쪽으로 올라가고, 패널 A는 그대로, 패널 B는 0이 됩니다.',
            actionBadge: '기본값',
          },
          {
            step: 3,
            title: '[Link · scroll={false}] · [push · scroll: false] · [replace · scroll: false] 클릭',
            description: 'scrollY가 전과 같게 남습니다. 패널 결과는 2단계와 같습니다 — 컨테이너 보존은 scroll 옵션이 아니라 DOM 유지가 결정합니다.',
            actionBadge: 'scroll=false',
          },
          {
            step: 4,
            title: '기록 표와 검증 패널 확인',
            description: '서버가 받은 searchParams, 렌더 ID 변화, timeOrigin(문서 재로드 없음)을 함께 봅니다.',
            actionBadge: '검증',
            observe: '5가지 방법의 scrollY·scrollTop 전→후 실측값과 기대 규칙의 일치 여부',
            observeAt: 'verification',
          },
        ]}
      />
      <RetentionWorkbench />
      <RetentionDeepDive />
    </DemoContainer>
  )
}
