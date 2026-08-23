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

  const defaultExpected = "• basePath: '/shop' 설정에 따른 전체 서브패스 라우팅 사양에 따른 정상 동작 및 상태 변화 관찰"
  const defaultActual = "• 실시간 인터랙션 및 상태 동기화 완료\n• 4단 표준 레이아웃 정상 적용"

  const actualContent =
    propActual !== undefined
      ? propActual
      : isMatched === true
      ? defaultActual
      : isMatched === false
      ? '• 인터랙션 실패 또는 불일치 감지 (동작 재확인이 필요합니다)'
      : '• 인터랙션 대기 중 (상단 데모의 조작 요소를 실행하여 결과를 관찰하세요)'

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="basePath: '/shop' 설정에 따른 전체 서브패스 라우팅 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
            <DemoDeepDiveCard title="next.config.ts basePath 서브패스 라우팅 설정">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p><code>basePath: '/shop'</code> (<code>next.config.ts</code>) 설정은 애플리케이션의 모든 라우트, 정적 에셋, <code>{'<'}Link{'>'}</code> 컴포넌트, <code>useRouter()</code> 경로 앞에 지정된 도메인 서브패스를 자동으로 접두(Prefix)하여 단일 도메인 아래 여러 서비스를 호스팅할 수 있도록 지원하는 빌드 설정입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 <code>basePath: '/shop'</code>이 활성화되어, 코드상에서 <code>{'<'}Link href="/products"{'>'}</code>로 작성하더라도 실제 브라우저에서는 <code>/shop/products</code>로 렌더링되고 내비게이션되는 통합 라우팅을 검증합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>단일 도메인 통합 아키텍처</strong>: <code>acme.com/shop</code>, <code>acme.com/blog</code>와 같이 동일 도메인의 서브패스별로 독립적인 Next.js 애플리케이션을 유연하게 배포합니다.</li>
              <li><strong>코드 수정 없는 일괄 접두사 부여</strong>: 소스 코드 내 수백 개의 링크와 API 경로를 일일이 수정하지 않고 설정 한 줄로 경로 체계를 제어합니다.</li>
              <li><strong>SEO 도메인 점수 통합</strong>: 서브도메인 분리 대비 메인 도메인의 검색엔진 권위도(Domain Authority)를 단일 도메인으로 집중시킵니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>메인 웹사이트 하위에 쇼핑몰 서브서비스 (<code>/store</code> 또는 <code>/shop</code>) 분리 배포</li>
              <li>글로벌 기업의 서비스별 통합 엔드포인트 구축 (<code>/docs</code>, <code>/dashboard</code>)</li>
              <li>레거시 모놀리식 시스템과 Next.js 신규 시스템의 점진적 서브패스 마이그레이션</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>public 폴더 정적 파일 경로</strong>: <code>public</code> 폴더의 이미지를 <code>{'<'}img{'>'}</code> 태그로 직접 참조할 때는 basePath가 자동 추가되지 않으므로 <code>next/image</code>를 사용하거나 <code>process.env.__NEXT_ROUTER_BASEPATH</code>를 접두해야 합니다.</li>
              <li><strong>외부 링크 제외</strong>: 외부 절대 URL(<code>https://...</code>)에는 basePath가 적용되지 않습니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
