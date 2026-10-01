import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { getDemoMetadata } from '@study/demos'
import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import { CspScripts } from './components/CspScripts'
import { CspLab } from './components/CspLab'

export const metadata: Metadata = getDemoMetadata('baseline', 'guides/content-security-policy/nonce-injection')

export default async function DemoPage() {
  // headers()는 요청 시점 API라 이 페이지를 동적 렌더링으로 만든다. nonce가 요청마다 달라야 하기 때문이다.
  const h = await headers()
  const nonce = h.get('x-nonce')
  const requestCsp = h.get('content-security-policy')

  return (
    <DemoContainer className="space-y-6">
      {/* 위반 이벤트 수집기가 DOM에서 가장 먼저 실행되도록 맨 위에 둔다 */}
      <CspScripts nonce={nonce} />
      <DemoGuideCard
        title="Proxy nonce 기반 CSP 헤더 주입"
        concept="proxy.ts가 요청마다 새 nonce를 만들어 CSP 응답 헤더와 x-nonce 요청 헤더에 담습니다. 서버 컴포넌트가 headers()로 nonce를 읽어 스크립트에 붙이면 브라우저는 nonce가 일치하는 스크립트만 실행하고, 나머지는 차단하며 securitypolicyviolation 이벤트를 남깁니다."
        steps={[
          {
            step: 1,
            title: '이 페이지가 받은 nonce와 스크립트 실행 결과 확인',
            description: '서버가 발급한 nonce, nonce가 있는 스크립트와 없는 스크립트의 실행 여부, 파싱 중 발생한 위반 이벤트가 표시됩니다.',
            actionBadge: '초기 관찰',
            observe: 'nonce 스크립트는 true, nonce 없는 스크립트는 false',
            observeAt: 'playground',
          },
          {
            step: 2,
            title: '[새 요청으로 nonce 확인]을 2회 이상 클릭',
            description: '같은 URL을 다시 요청해 응답 헤더의 nonce와 HTML의 nonce 속성을 같은 응답에서 비교하고, 요청마다 값이 바뀌는지 봅니다.',
            actionBadge: 'nonce 대조',
            observe: '요청1 → 요청2 nonce가 서로 다름',
            observeAt: 'network',
          },
          {
            step: 3,
            title: '[XSS 주입 시도] 클릭 후 [페이지 새로고침]',
            description: 'nonce 없는 onerror 핸들러를 DOM에 넣으면 브라우저가 막습니다. 새로고침하면 이 페이지의 nonce도 달라집니다.',
            actionBadge: '차단·갱신 확인',
            observe: '모든 항목 [O] → 검증 완료',
            observeAt: 'verification',
          },
        ]}
      />
      <CspLab nonce={nonce} requestCsp={requestCsp} />
    </DemoContainer>
  )
}
