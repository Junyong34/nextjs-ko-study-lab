'use client'
import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'

export interface VerificationFooterProps {
  isMatched?: boolean
  expected?: React.ReactNode
  actual?: React.ReactNode
  status?: string | number | null
  description?: string
  isLoaded?: boolean
  logs?: string[]
  count?: number
  [key: string]: any
}

export function VerificationFooter(props: VerificationFooterProps = {}) {
  const {
    isMatched: propIsMatched,
    expected: propExpected,
    actual: propActual,
    status,
    description: propDescription,
    isLoaded,
    logs,
    count,
    ...rest
  } = props

  const isMatched =
    propIsMatched !== undefined
      ? propIsMatched
      : status !== undefined && status !== null
      ? typeof status === 'number'
        ? status >= 200 && status < 400
        : status === 'success' || status === 'valid' || status === 'completed' || status === 'ok'
      : isLoaded !== undefined
      ? Boolean(isLoaded)
      : logs && Array.isArray(logs) && logs.length > 0
      ? true
      : count !== undefined && count > 0
      ? true
      : undefined

  const defaultExpected = "• output: 'export' 정적 산출물 생성의 동작과 기대 결과를 확인합니다."
  const defaultActual = "• 사용자 조작 후 실제 결과를 표시합니다."

  const actualContent =
    propActual !== undefined
      ? propActual
      : isMatched === true
      ? defaultActual
      : isMatched === false
      ? '• 상호작용 실패 또는 불일치가 확인되었습니다. 동작을 다시 확인해 주세요.'
      : '• 상호작용 대기 중 (상단 예제의 조작 요소를 실행해 결과를 확인해 주세요.)'

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="output: 'export' 정적 산출물 생성 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
            <DemoDeepDiveCard title="next.config.ts output: 'export' 완전 정적 HTML 빌드 (SSG/SPA)">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p><code>output: 'export'</code> (<code>next.config.ts</code>) 설정은 Node.js 서버 런타임 없이 완전히 독립적으로 실행 가능한 순수 정적 HTML, CSS, 자바스크립트 파일만을 <code>out/</code> 디렉토리에 생성하는 완전 정적 내보내기(Static Export) 빌드 스펙입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 <code>next build</code> 실행 시 모든 페이지를 정적 HTML 파일로 컴파일하여 생성하고, AWS S3, GitHub Pages, Nginx 등 Node.js 서버가 없는 순수 웹서버 환경에 배포하여 고속으로 서빙되는 아키텍처를 검증합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>서버 운영 비용 제로</strong>: Node.js 백엔드 서버를 띄울 필요 없이 S3/CloudFront나 Cloudflare Pages에 무료 또는 극저비용으로 호스팅합니다.</li>
              <li><strong>무한 확장성(Scalability)</strong>: 글로벌 CDN 엣지에서 정적 파일만 서빙하므로 대규모 트래픽 폭증에도 서버 장애가 발생하지 않습니다.</li>
              <li><strong>완벽한 보안 격리</strong>: 서버 사이드 런타임 취약점이나 원격 코드 실행(RCE) 위험이 원천적으로 존재하지 않습니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>회사 소개, 브랜드 랜딩 페이지, 이용약관 등 정적 웹사이트 배포</li>
              <li>GitHub Pages 또는 AWS S3 기반의 기술 문서 및 블로그</li>
              <li>모바일 하이브리드 앱(Capacitor, Cordova, Electron) 내장 웹 리소스 패키징</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>서버 전용 기능 사용 불가</strong>: <code>output: 'export'</code> 모드에서는 Server Actions, Route Handlers(동적), <code>cookies()</code>, <code>headers()</code>, 미들웨어(middleware), SSR 동적 렌더링 기능을 사용할 수 없으며 모든 데이터는 빌드 시점(<code>generateStaticParams</code>) 또는 클라이언트 SWR/React Query로 처리해야 합니다.</li>
              <li><strong>이미지 최적화 제약</strong>: 기본 Next.js 이미지 최적화 서버가 동작하지 않으므로 <code>images.unoptimized: true</code> 또는 Cloudinary 등 외부 로더를 설정해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
