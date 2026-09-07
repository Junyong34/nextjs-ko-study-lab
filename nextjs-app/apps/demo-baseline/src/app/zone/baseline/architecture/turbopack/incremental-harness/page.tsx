import { getDemoMetadata } from '@study/demos'
import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import type { Metadata } from 'next'
import { ArchTurbopackHmrDemo } from './components/ArchTurbopackHmrDemo'

export const metadata: Metadata = getDemoMetadata('baseline', 'architecture/turbopack/incremental-harness')

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-4">
      <DemoGuideCard
        title="Turbopack 컴파일 환경과 Fast Refresh 경계"
        concept="Next.js 16에서는 next dev와 next build가 기본적으로 Turbopack을 사용합니다. 컴파일 환경은 페이지에서 확인하고, HMR은 로컬 소스 편집으로 검증합니다."
        steps={[
          {
            step: 1,
            title: '[상태 카운터 증가] 실행',
            description: 'Fast Refresh 전후에 비교할 실제 React 로컬 상태를 만듭니다.',
            actionBadge: '상태 준비',
          },
          {
            step: 2,
            title: '[hmr-marker.ts] 문구를 로컬에서 수정·저장',
            description: '개발 서버가 별도 모듈 변경을 반영하는지 확인합니다. 배포 화면에서는 실행할 수 없는 개발 절차입니다.',
            actionBadge: '소스 저장',
          },
          {
            step: 3,
            title: '[검증] marker와 상태 비교',
            description: '문구가 갱신되고 안전한 경우 카운터가 유지되는지 관찰합니다.',
            actionBadge: 'Fast Refresh',
            observe: 'import.meta.env 값, marker 문구, React 상태 카운터',
            observeAt: 'verification',
          },
        ]}
      />
      <ArchTurbopackHmrDemo />
    </DemoContainer>
  )
}
