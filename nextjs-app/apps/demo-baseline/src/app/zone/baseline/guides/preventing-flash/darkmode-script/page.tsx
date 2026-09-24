import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'
import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import { ComparisonPlayground } from './components/ComparisonPlayground'
import { DeepDive } from './components/DeepDive'

export const metadata: Metadata = getDemoMetadata('baseline', 'guides/preventing-flash/darkmode-script')

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="다크모드 SSR 인라인 스크립트 FOUC 방지"
        concept="서버는 localStorage를 모르므로 기본 테마로 HTML을 만든다. useEffect는 페인트 뒤에 실행돼 한동안 기본 테마가 보이지만, HTML 파싱 중 동기 실행되는 인라인 스크립트는 첫 페인트 전에 data-theme을 맞춘다."
        steps={[
          {
            step: 1,
            title: '[dark 저장 후 두 방식 새로고침] 클릭',
            description:
              '데모 전용 키에 dark를 저장하고 A(useEffect)·B(인라인 스크립트) 하위 라우트를 iframe으로 다시 하드 로드합니다.',
            actionBadge: '저장 + 하드 로드',
          },
          {
            step: 2,
            title: '측정표에서 첫 rAF 프레임과 잘못된 프레임 수 비교',
            description:
              '각 문서가 프레임마다 기록한 data-theme·배경색, FCP, 하이드레이션 시점 값을 봅니다. DevTools에서 CPU를 느리게 하면 A의 차이가 커집니다.',
            actionBadge: '실측 비교',
            observe: 'A는 첫 프레임이 light였다가 하이드레이션 뒤 dark, B는 첫 프레임부터 dark',
            observeAt: 'playground',
          },
          {
            step: 3,
            title: '검증 패널 확인 후 [저장값 삭제(초기화)]',
            description: 'B가 경고 없이 첫 프레임부터 목표 테마인지 확인하고, 데모 키를 지워 원래 상태로 되돌립니다.',
            actionBadge: '검증 + 초기화',
            observe: 'B의 잘못된 프레임 0, hydration 경고 0',
            observeAt: 'verification',
          },
        ]}
      />
      <ComparisonPlayground />
      <DeepDive />
    </DemoContainer>
  )
}
