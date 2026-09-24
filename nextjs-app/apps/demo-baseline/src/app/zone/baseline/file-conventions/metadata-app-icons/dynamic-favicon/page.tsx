import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { AppIconsDemo } from './components/AppIconsDemo'

// 루트 layout.tsx가 metadata.icons를 직접 지정하고 있어, 그대로 두면 이 세그먼트의
// icon.tsx / apple-icon.tsx 링크가 주입되지 않는다(Next.js는 해석된 icons가 비어 있을 때만
// 파일 기반 아이콘을 넣는다). icons: null로 상속값을 비워 파일 컨벤션이 적용되게 한다.
export const metadata: Metadata = {
  ...getDemoMetadata('baseline', 'file-conventions/metadata-app-icons/dynamic-favicon'),
  icons: null,
}

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="icon.tsx 동적 파비콘 생성"
        concept="세그먼트에 icon.tsx / apple-icon.tsx를 두면 ImageResponse로 만든 이미지가 Route Handler로 서빙되고, 그 세그먼트 페이지의 <head>에 sizes·type·해시가 붙은 <link>가 자동으로 들어간다. 이 문서의 DOM과 실제 응답으로 확인한다."
        steps={[
          {
            step: 1,
            title: '[head 아이콘 링크 읽고 fetch] 클릭',
            description:
              'document에서 rel="icon" / rel="apple-touch-icon" 링크를 읽어 href·sizes·type을 표시하고, 각 href를 실제로 fetch해 status·Content-Type·Cache-Control과 디코딩한 이미지 크기를 보여줍니다.',
            actionBadge: '실측',
          },
          {
            step: 2,
            title: 'generateImageMetadata 결과 확인',
            description:
              'icon.tsx 하나에서 id가 small(32x32) / large(192x192)인 링크 두 개가 생성되고, apple-icon.tsx의 size / contentType export가 180x180 image/png 링크로 반영되는지 봅니다.',
            actionBadge: '링크 3개',
          },
          {
            step: 3,
            title: 'no-reset 비교 라우트와 대조',
            description:
              '루트 layout의 metadata.icons를 그대로 상속한 하위 라우트에서는 이 세그먼트의 파일 아이콘 링크가 빠지는지 확인합니다.',
            actionBadge: '우선순위',
            observe: '3단 검증 패널의 항목별 [일치] / [불일치] 판정',
            observeAt: 'verification',
          },
        ]}
      />
      <DemoPlaygroundCard title="dynamic-favicon/icon.tsx · apple-icon.tsx → 이 문서의 head 링크와 실제 응답">
        <AppIconsDemo />
      </DemoPlaygroundCard>
    </DemoContainer>
  )
}
