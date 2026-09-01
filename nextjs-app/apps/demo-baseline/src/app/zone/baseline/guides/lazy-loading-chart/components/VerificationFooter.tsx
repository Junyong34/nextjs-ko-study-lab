'use client'

import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'

export interface VerificationFooterProps {
  showChart?: boolean
  hasInteracted?: boolean
}

export function VerificationFooter({
  showChart = false,
  hasInteracted = false,
}: VerificationFooterProps) {
  const isMatched = hasInteracted && showChart ? true : undefined

  const expected =
    '• next/dynamic({ ssr: false })을 통한 무거운 차트 컴포넌트(HeavyChartClient) 분리\n• 버튼 클릭 시 온디맨드 JS 청크 로드 및 6개월 매출 차트 마운트'

  const actual =
    !hasInteracted || !showChart
      ? '• 동적 청크 미로드 (초기 번들 분리 상태, 조작 대기 중)'
      : '• 동적 청크: HeavyChartClient 로드 완료 (ssr: false 클라이언트 렌더링)\n• 렌더링 상태: 2026 상반기 월별 매출 추이 바 차트 마운트 성공\n• 번들 최적화: 초기 번들에서 분리된 청크가 온디맨드로 로드됨'

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="next/dynamic 지연 로딩 & 클라이언트 번들 최적화 검증 결과"
        expected={expected}
        actual={actual}
        isMatched={isMatched}
        description="Next.js next/dynamic의 ssr: false 옵션 및 클라이언트 온디맨드 코드 스플리팅 라이프사이클을 검증합니다."
      />
      <DemoDeepDiveCard title="next/dynamic 지연 로딩 & 클라이언트 번들 최적화">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              <code>next/dynamic</code>은 React의 <code>React.lazy()</code>와 <code>Suspense</code>를 Next.js 환경에 최적화하여 래핑한 API로, 무거운 서드파티 라이브러리나 특정 컴포넌트를 초기 자바스크립트 번들에서 분리(Code Splitting)하고 <code>ssr: false</code> 옵션을 통해 클라이언트 브라우저에서만 지연 로드하도록 제어하는 표준 번들 최적화 스펙입니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 대용량 데이터 시각화 컴포넌트를 <code>dynamic(() =&gt; import('./HeavyChartClient'), {'{'} ssr: false, loading: () =&gt; &lt;Skeleton /&gt; {'}'})</code>로 선언하여, 초기 페이지 번들 크기를 경량화하고 [분석] 버튼 클릭 시점에 청크 파일을 지연 다운로드하여 렌더링합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>초기 번들 크기 대폭 감소</strong>: 초기 로드에 불필요한 무거운 라이브러리를 제외하여 메인 번들 크기를 줄이고 초기 로딩 속도(FCP)를 극대화합니다.</li>
              <li><strong>SSR 윈도우 객체 참조 에러 원천 방지</strong>: <code>ssr: false</code>를 설정하여 <code>window</code>, <code>document</code>, Canvas API 등 브라우저 전용 전역 객체를 참조하는 라이브러리의 서버 크래시를 방지합니다.</li>
              <li><strong>선언적 로딩 플레이스홀더 제공</strong>: 컴포넌트 청크가 다운로드되는 동안 <code>loading</code> 콜백으로 지정된 스켈레톤을 자연스럽게 노출합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>관리자 대시보드의 대용량 통계 차트, 복잡한 히트맵, 3D Canvas 뷰어</li>
              <li>주문서 작성 페이지의 카카오 우편번호 검색 / 전자 결제 PG사 SDK 모달</li>
              <li>리치 텍스트 에디터(WYSIWYG: Toast UI, Quill, Draft.js) 컴포넌트</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>Server Component 내부 ssr: false 제약</strong>: <code>ssr: false</code> 옵션은 <code>'use client'</code> 클라이언트 컴포넌트 내부에서만 사용할 수 있으며, 서버 컴포넌트 파일에서는 사용할 수 없습니다.</li>
              <li><strong>과도한 세분화 주의</strong>: 수십 바이트 수준의 작은 컴포넌트까지 무분별하게 <code>dynamic</code>으로 쪼개면 오히려 HTTP 네트워크 요청 오버헤드가 증가하므로 무거운 모듈 위주로 적용해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
