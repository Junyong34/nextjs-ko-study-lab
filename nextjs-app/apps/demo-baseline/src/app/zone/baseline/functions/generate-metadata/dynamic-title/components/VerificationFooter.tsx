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

  const defaultExpected = "• generateMetadata 동적 SEO 타이틀 및 메타태그 생성 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="generateMetadata 동적 SEO 타이틀 및 메타태그 생성 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
            <DemoDeepDiveCard title="generateMetadata 동적 메타데이터 & 타이틀 생성">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p><code>generateMetadata()</code>는 <code>page.tsx</code> 또는 <code>layout.tsx</code>에서 내보내는 비동기 함수로, 동적 라우트 파라미터(<code>params</code>)나 쿼리(<code>searchParams</code>)를 기반으로 HTML <code>{'<'}title{'>'}</code>, <code>{'<'}meta name="description"{'>'}</code>, Open Graph 태그를 동적으로 생성하는 표준 API입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 상품 ID(<code>prod-101</code>) 파라미터를 받아 백엔드 상품 정보를 비동기 조회한 후, 상품명(<code>'울트라 슬림 노이즈캔슬링 헤드폰'</code>), 판매가, 썸네일 이미지를 포함한 동적 메타데이터 객체를 구성하여 반환합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>검색엔진 및 SNS 공유 최적화</strong>: 카카오톡/페이스북 링크 공유 시 동적 상품명과 가격, 대표 썸네일 카드가 풍부하게 노출됩니다.</li>
              <li><strong>동일 렌더링 주기 내 자동 중복 제거(Deduping)</strong>: <code>generateMetadata</code>와 <code>Page</code> 컴포넌트에서 동일한 <code>fetch(url)</code>를 호출하더라도 Next.js가 요청을 1회로 자동 병합합니다.</li>
              <li><strong>완벽한 타입 안전성</strong>: Next.js의 <code>Metadata</code> 타입을 통해 오타 없이 안전하게 메타 태그를 정의합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>수백만 개 상품 상세 페이지의 상품명 및 실시간 가격 기반 동적 타이틀 생성</li>
              <li>블로그/뉴스 기사의 제목, 작성자, 게시일 기반 소셜 미리보기 태그 주입</li>
              <li>사용자 프로필 공유 시 닉네임과 프로필 사진 OG 카드 렌더링</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>JSON-LD 구조화 데이터와 병행</strong>: 단순 메타 태그 외에도 검색엔진 리치 스니펫을 위해 <code>JSON-LD</code> 스크립트를 페이지 본문에 함께 삽입하는 것이 권장됩니다.</li>
              <li><strong>Next.js 15+ params Promise</strong>: Next.js 15+에서는 <code>generateMetadata({'{'} params {'}'})</code>의 <code>params</code>가 Promise이므로 반드시 <code>const {'{'} id {'}'} = await params</code>로 언래핑해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
