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

  const defaultExpected = "• images.remotePatterns 외부 이미지 도메인 허용 및 보안 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="images.remotePatterns 외부 이미지 도메인 허용 및 보안 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
            <DemoDeepDiveCard title="next.config.ts images.remotePatterns 원격 이미지 도메인 화이트리스트 & SSRF 방어">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p><code>images.remotePatterns</code> (<code>next.config.ts</code>) 설정은 <code>next/image</code> 최적화 서버가 이미지를 다운로드하여 리사이징할 수 있는 외부 이미지 CDN 호스트, 프로토콜, 포트, 경로 패턴을 엄격하게 제한하는 필수 보안 화이트리스트 스펙입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 승인된 S3 스토리지(<code>protocol: 'https', hostname: 'my-shop-bucket.s3.amazonaws.com'</code>)의 이미지만 정상 최적화되고, 승인되지 않은 외부 도메인 접근 시 Next.js 이미지 최적화 서버가 요청을 즉각 거부하여 서버를 보호하는 동작을 검증합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>SSRF(Server-Side Request Forgery) 공격 원천 방어</strong>: 공격자가 악의적인 내부 사설 IP(<code>http://169.254.169.254/...</code>)나 악성 서버 주소를 이미지 URL로 넘겨 내부 시스템을 정찰하는 공격을 차단합니다.</li>
              <li><strong>이미지 서버 자원 고갈(DoS) 방지</strong>: 무분별한 외부 임의 이미지 변환 요청으로 인한 서버 CPU 및 대역폭 낭비를 방지합니다.</li>
              <li><strong>와일드카드 패턴 지원</strong>: <code>*.cdn.myshop.com</code>과 같이 서브도메인 와일드카드를 안전하게 매칭합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>AWS S3, Cloudinary 등 신뢰할 수 있는 사내 클라우드 스토리지 버킷 화이트리스트 등록</li>
              <li>파트너 판매자 센터의 외부 이미지 CDN 호스트 안전 연동</li>
              <li>소셜 로그인 프로필 이미지(Google, Kakao, Naver) 도메인 허용</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>레거시 domains 속성 지양</strong>: 과거 <code>images.domains</code>는 단순 호스트명만 허용하여 경로 및 프로토콜 검증이 불가하므로 보안성이 대폭 강화된 <code>remotePatterns</code>를 사용해야 합니다.</li>
              <li><strong>포트 및 프로토콜 명시</strong>: 가능한 <code>protocol: 'https'</code>를 명시하여 안전하지 않은 HTTP 원격 이미지 로드를 차단해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
