import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'
import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import { ScrollLabWorkbench } from './components/ScrollLabWorkbench'
import { ScrollDeepDive } from './components/ScrollDeepDive'

export const metadata: Metadata = getDemoMetadata('baseline', 'components/link/soft-navigation-scroll')

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="<Link scroll> 기본값 · scroll=false · #해시 스크롤 실측"
        concept="<Link>의 scroll 기본값(true)은 '맨 위로 이동'이 아니라 '새 Page 상단이 뷰포트 밖일 때만 Page 상단이 보이게 스크롤'입니다. scroll=false는 이 처리를 끄고, #id 링크는 대상 요소로 scrollIntoView합니다. 440px 고정 높이 문서에서 window.scrollY를 클릭 전후로 실측하고, performance.timeOrigin이 그대로여서 전체 문서 리로드가 없었음을 함께 확인합니다."
        steps={[
          {
            step: 1,
            title: '실습 창에서 [아래로 900px] 클릭 또는 휠 스크롤',
            description: '1장 Page 상단(article)이 뷰포트 위로 사라질 만큼 내립니다. 헤더의 scrollY 값이 실시간으로 바뀝니다.',
            actionBadge: '스크롤',
          },
          {
            step: 2,
            title: '[다음 장 · 기본] 클릭 후 다시 내려 [다음 장 · scroll=false] 클릭',
            description: '기본값은 scrollY가 0으로 돌아가고, scroll=false는 다른 장으로 바뀌어도 같은 scrollY에 머뭅니다.',
            actionBadge: 'Page 이동',
          },
          {
            step: 3,
            title: '[#s-5 결론 · 기본]과 [#s-3 · scroll=false] 클릭',
            description: '기본 해시 링크는 대상 섹션을 scroll-margin-top 위치로 가져오고, scroll=false 해시 링크는 주소만 바꿉니다.',
            actionBadge: '해시 이동',
          },
          {
            step: 4,
            title: '기록 표와 timeOrigin 비교',
            description: '모든 기록의 timeOrigin이 첫 로드 값과 같고 레이아웃 카운터가 1, 2, 3… 으로 이어지는지 봅니다.',
            actionBadge: '리로드 없음',
            observe: '링크 4종의 scrollY 전→후 실측값과 기대 규칙의 일치 여부, 문서 리로드 0회',
            observeAt: 'verification',
          },
        ]}
      />
      <ScrollLabWorkbench />
      <ScrollDeepDive />
    </DemoContainer>
  )
}
