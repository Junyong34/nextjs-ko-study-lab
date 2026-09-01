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

  const defaultExpected = "• 홈 화면 추가 PWA 프롬프트 및 manifest의 동작과 기대 결과를 확인합니다."
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
        title="홈 화면 추가 PWA 프롬프트 및 manifest 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
      <DemoDeepDiveCard title="홈 화면 추가 PWA 프롬프트 및 manifest">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>Next.js의 PWA 아키텍처는 표준 웹 앱 매니페스트(<code>app/manifest.json</code> / <code>manifest.ts</code>)와 브라우저의 <code>beforeinstallprompt</code> 이벤트를 결합하여, 모바일/데스크톱 사용자에게 앱스토어 다운로드 없이 홈 화면 설치를 유도하는 웹 표준 스펙입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 브라우저의 기본 설치 배너를 가로채고, 쇼핑몰 맞춤형 [앱 설치하고 10% 할인 쿠폰 받기] 커스텀 설치 프롬프트를 띄운 후 사용자의 설치 승인/거절 인터랙션을 처리하는 흐름을 검증합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>앱스토어 수수료 0% 및 심사 지연 제거</strong>: 앱스토어 등록 및 30% 결제 수수료 없이 웹사이트를 네이티브 앱과 동일한 풀스크린 독립 창(Standalone)으로 설치시킵니다.</li>
              <li><strong>고객 재방문율 및 리텐션 증대</strong>: 스마트폰 홈 화면에 브랜드 아이콘을 배치하고 오프라인 캐싱 및 푸시 알림 기반을 마련합니다.</li>
              <li><strong>타입 안전한 manifest.ts 생성</strong>: Next.js의 <code>MetadataRoute.Manifest</code> 인터페이스를 사용하여 아이콘, 테마 색상, 시작 URL의 유효성을 컴파일 타임에 보장합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>모바일 커머스 쇼핑몰 [홈 화면 바로가기 추가] 프로모션 배너</li>
              <li>배달/주문 플랫폼의 모바일 앱 대용 PWA 설치 유도</li>
              <li>B2B 사내 업무 포털 및 물류 창고 바코드 스캐너 웹앱 배포</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>HTTPS 환경 필수</strong>: PWA 설치 기능과 Service Worker는 보안 요구사항에 따라 로컬호스트(localhost)를 제외하고 반드시 유효한 HTTPS 환경에서만 동작합니다.</li>
              <li><strong>iOS Safari 설치 안내 분기</strong>: iOS Safari는 <code>beforeinstallprompt</code> 이벤트를 지원하지 않으므로 [공유 버튼 -{'>'} 홈 화면에 추가] 가이드 팝업을 별도로 분기 렌더링해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
