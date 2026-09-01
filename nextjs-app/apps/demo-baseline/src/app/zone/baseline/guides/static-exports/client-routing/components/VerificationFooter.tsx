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

  const defaultExpected = "• output: 'export' 빌드 산출물 및 클라이언트 라우팅의 동작과 기대 결과를 확인합니다."
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
        title="output: 'export' 빌드 산출물 및 클라이언트 라우팅 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
      <DemoDeepDiveCard title="output: 'export' 빌드 산출물 및 클라이언트 라우팅">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>Next.js의 정적 내보내기(<code>output: 'export'</code>)는 Node.js 서버 런타임 없이 전체 애플리케이션을 순수 정적 파일(HTML/CSS/JS)로 컴파일하여 Nginx, AWS S3, Cloudflare Pages에 배포하고, 브라우저에서 <code>next/navigation</code> 기반의 클라이언트 SPA 라우팅을 수행하는 빌드 스펙입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 정적으로 빌드된 카탈로그 페이지들 간을 이동할 때, 서버 재요청 없이 브라우저 메모리 내 클라이언트 라우터가 즉각 세그먼트를 교체하고 히스토리 상태를 동기화하는 과정을 검증합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>서버 유지비 0원 및 무한 확장성</strong>: Node.js 백엔드 서버 인스턴스가 필요 없어 서버 다운 위험이 없고 저비용 정적 스토리지/CDN만으로 글로벌 서빙이 가능합니다.</li>
              <li><strong>최고 수준의 보안 격리</strong>: 서버사이드 코드가 실행되지 않으므로 서버 침투나 RCE(원격 코드 실행) 공격 경로가 원천 차단됩니다.</li>
              <li><strong>앱 패키징 용이성</strong>: Capacitor나 Electron과 결합하여 단일 정적 산출물로 iOS/Android 네이티브 앱 및 데스크톱 앱을 손쉽게 빌드할 수 있습니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>AWS S3 + Cloudfront 기반의 저비용 대규모 상품 카탈로그 웹사이트</li>
              <li>Capacitor/Cordova를 활용한 하이브리드 모바일 쇼핑 앱</li>
              <li>사내 폐쇄망 오프라인 환경에 설치되는 정적 가이드 매뉴얼 웹</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>서버 전용 기능 사용 불가 제약</strong>: <code>output: 'export'</code> 모드에서는 Server Actions, Route Handler의 동적 POST 요청, <code>cookies()</code>/<code>headers()</code> API, 미들웨어(Middleware) 기능을 사용할 수 없습니다.</li>
              <li><strong>이미지 최적화 unoptimized 설정 필요</strong>: 빌드 타임 이미지 최적화 서버가 없으므로 <code>images: {'{'} unoptimized: true {'}'}</code> 설정이나 외부 이미지 CDN(Cloudinary/Imgix)을 연동해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
