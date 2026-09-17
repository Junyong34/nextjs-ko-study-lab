import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'
import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import { LinkPrefetchOptionsDemo } from './components/LinkPrefetchOptionsDemo'

export const metadata: Metadata = getDemoMetadata('baseline', 'components/link/prefetch-options')

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="next/link prefetch (auto vs full vs false) 옵션 대조"
        concept={
          '<Link>의 prefetch는 auto(null, 기본값)/true/false 세 값을 받습니다. 대상 라우트를 동적 라우트로 ' +
          '고정해두면 auto는 loading.tsx 경계까지만(부분), true는 동적 데이터까지 전부(전체), false는 아예 ' +
          '요청하지 않는 차이가 실제 네트워크 리소스 로그로 드러납니다. 단, 이 뷰포트 기반 prefetch는 ' +
          'production 빌드에서만 동작합니다.'
        }
        steps={[
          {
            step: 1,
            title: '[실습 화면] 박스 안에서 아래로 스크롤',
            description: '상품 A(auto)/B(full)/C(false) 링크 3개를 실제 브라우저 뷰포트에 순서대로 진입시킵니다.',
            actionBadge: '스크롤',
          },
          {
            step: 2,
            title: '뷰포트 교차 확인 뱃지 확인',
            description: '각 링크 아래 "✓ 뷰포트 교차 확인됨"이 뜨면 이 데모의 IntersectionObserver가 실제 교차를 감지한 것입니다.',
            actionBadge: '교차 확인',
          },
          {
            step: 3,
            title: 'PerformanceObserver 요청 로그 대조',
            description: 'auto/full/false 각각 실제로 몇 건의 fetch 요청이 발생했는지, 크기는 얼마인지 확인합니다.',
            actionBadge: '요청 로그',
            observe: '3단 검증 패널에서 prefetch 옵션별 요청 건수·transferSize와, production/development 빌드에 따른 기대값 차이',
            observeAt: 'verification',
          },
        ]}
      />
      <LinkPrefetchOptionsDemo />
    </DemoContainer>
  )
}
