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

  const defaultExpected = "• trailingSlash: true URL 끝 슬래시 정규화의 동작과 기대 결과를 확인합니다."
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
        title="trailingSlash: true URL 끝 슬래시 정규화 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
            <DemoDeepDiveCard title="next.config.ts trailingSlash URL 끝 슬래시 정규화 및 308 리다이렉트">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p><code>trailingSlash: true | false</code> (<code>next.config.ts</code>) 설정은 URL 끝에 슬래시(<code>/</code>)를 강제 추가할지, 제거할지를 전역 결정하는 옵션입니다. 불일치하는 URL 요청 수신 시 Next.js가 자동으로 HTTP 308 영구 리다이렉트를 수행하여 URL을 정규화합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 <code>trailingSlash: true</code> 설정 시 사용자가 <code>/products/101</code>로 접근하면 서버가 즉시 <code>/products/101/</code>로 308 리다이렉트를 발행하여 모든 내부 링크와 검색엔진 인덱싱을 끝 슬래시 규격으로 통일합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>중복 콘텐츠(Duplicate Content) 페널티 방지</strong>: <code>/about</code>과 <code>/about/</code>이 검색엔진에 별개 페이지로 인식되어 SEO 점수가 분산되는 문제를 해결합니다.</li>
              <li><strong>정적 웹 호스팅(S3/Nginx) 호환성</strong>: <code>trailingSlash: true</code> 설정 시 정적 내보내기(<code>output: 'export'</code>) 빌드 결과물이 <code>about/index.html</code> 디렉토리 구조로 생성되어 정적 호스팅 서버와의 호환성이 향상됩니다.</li>
              <li><strong>일관된 URL 정책</strong>: 팀 전체 및 전사 시스템의 URL 표준 규격을 강제합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>대규모 쇼핑몰 및 미디어 사이트의 SEO 캐노니컬 URL 표준화</li>
              <li>AWS S3 + CloudFront 정적 사이트 배포 시 디렉토리 인덱스 매핑</li>
              <li>레거시 웹서버(Apache/Nginx)에서 Next.js로 마이그레이션 시 기존 슬래시 정책 유지</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>기존 SEO 색인 정책 준수</strong>: 이미 수만 개의 URL이 슬래시 없이(또는 슬래시 포함) 구글에 색인되어 있다면 기존 설정을 그대로 유지해야 불필요한 대량 308 리다이렉트 및 크롤링 예산 낭비를 방지할 수 있습니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
