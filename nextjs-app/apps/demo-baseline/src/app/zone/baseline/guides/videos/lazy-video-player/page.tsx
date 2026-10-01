import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'
import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import { LazyVideoDemo } from './components/LazyVideoDemo'

export const metadata: Metadata = getDemoMetadata('baseline', 'guides/videos/lazy-video-player')

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="IntersectionObserver로 상품 홍보 영상 지연 로딩 및 자동 재생"
        concept="영상은 용량이 커서 화면 밖에서 미리 받으면 데이터를 낭비한다. src 없이 preload='none'으로 두었다가 IntersectionObserver가 뷰포트 진입을 알려 줄 때 src를 부여하고, muted 상태로 자동 재생한다."
        steps={[
          {
            step: 1,
            title: '스크롤 전에 [현재 요청 수·재생 상태 측정] 클릭',
            description: '아직 화면에 들어오지 않은 영상이 요청을 보내지 않았는지 브라우저와 서버 양쪽에서 확인합니다.',
            actionBadge: '진입 전 측정',
            observe: '요청 0건, src 없음, readyState 0',
            observeAt: 'verification',
          },
          {
            step: 2,
            title: '스크롤 박스를 아래로 내려 영상을 보이게 한다',
            description: '영상이 25% 이상 보이면 src가 부여되고 Range 요청이 나간 뒤 muted로 자동 재생됩니다. 진입 이벤트 시각이 박스 아래에 표시됩니다.',
            actionBadge: '뷰포트 진입',
            observe: 'loadstart → loadedmetadata → loadeddata → playing 순서와 경과 시간',
            observeAt: 'playground',
          },
          {
            step: 3,
            title: '다시 [현재 요청 수·재생 상태 측정] 클릭, 필요하면 [즉시 로드 영상 마운트]로 비교',
            description: '진입 후 요청 수·206 응답·readyState·paused를 읽습니다. 즉시 로드 영상은 스크롤 없이 요청이 발생하는 것을 보여 줍니다.',
            actionBadge: '진입 후 측정',
          },
        ]}
      />
      <LazyVideoDemo />
    </DemoContainer>
  )
}
