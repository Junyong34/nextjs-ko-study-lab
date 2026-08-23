'use client'
import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'

interface VerificationFooterProps {
  elapsedMs?: number
  isLoaded?: boolean
}

export function VerificationFooter({
  elapsedMs,
  isLoaded = false,
}: VerificationFooterProps) {
  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="loading.tsx 스켈레톤 바운더리 실증 검증"
        expected="• slow-catalog/loading.tsx가 React Suspense 폴백으로 자동 등록\n• 서버 비동기 지연 시간 동안 스켈레톤 노출 후 본문 데이터 점진적 스트리밍 완료"
        actual={
          isLoaded && elapsedMs
            ? `• [스트리밍 완료] 서버 지연 ${elapsedMs}ms 감지 -> loading.tsx 스켈레톤 교체 마운트 완료\n• React Suspense 기반 점진적 RSC 스트리밍 성공`
            : '• 스켈레톤 스트리밍 대기 중 (slow-catalog 링크를 클릭하여 로딩 바운더리를 관찰하세요)'
        }
        isMatched={isLoaded ? Boolean(elapsedMs && elapsedMs > 0) : undefined}
        description="Next.js App Router의 loading.tsx 컨벤션을 통해 페이지 단위 Suspense 스켈레톤을 구성하고 비동기 데이터 스트리밍을 처리하는 구조를 검증합니다."
      />
      <DemoDeepDiveCard title="loading.tsx 스켈레톤 바운더리 & React Suspense 점진적 스트리밍">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              <code>loading.tsx</code>는 동일 디렉토리의 <code>page.tsx</code> 및 그 하위 자식 컴포넌트를 <code>{'<'}Suspense fallback={'{'}{'<'}Loading /{'>'}{'}'}{'>'}</code>로 자동 래핑하는 Next.js 표준 파일 컨벤션입니다. 서버 비동기 데이터 페칭 중에도 사용자에게 즉시 의미 있는 스켈레톤 UI를 제공합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 서버 비동기 지연이 존재하는 카탈로그 화면 진입 시, 상위 레이아웃과 함께 <code>loading.tsx</code>의 스켈레톤 카드가 즉각 렌더링되고 서버 데이터 준비 완료 시점에 실제 상품 리스트 청크로 매끄럽게 교체되는 스트리밍 파이프라인을 검증합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>체감 응답 속도 극대화</strong>: 서버 데이터 준비를 기다리지 않고 스켈레톤 UI를 브라우저에 즉시 표시하여 TTFB 체감 지연을 상쇄합니다.</li>
              <li><strong>보일러플레이트 제로</strong>: 수동으로 <code>{'<'}Suspense{'>'}</code>를 중첩하지 않아도 디렉토리 구조만으로 자동 바운더리가 형성됩니다.</li>
              <li><strong>인스턴트 내비게이션 지원</strong>: 클라이언트 라우터가 링크 클릭 즉시 로딩 셸로 전환하여 UI 반응성(INP)을 대폭 개선합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>상품 목록 및 카테고리 기획전의 스켈레톤 카드 로딩</li>
              <li>대규모 주문 내역 및 배송 추적 페이지 진입 시 로딩 상태</li>
              <li>통계/정산 대시보드의 복잡한 집계 쿼리 비동기 로딩</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>레이아웃 레벨 스켈레톤 미포함</strong>: <code>loading.tsx</code>는 동일 레벨 <code>layout.tsx</code>의 내부에 렌더링되므로, 레이아웃 자체의 로딩 스켈레톤을 구성하려면 상위 세그먼트에 <code>loading.tsx</code>를 배치해야 합니다.</li>
              <li><strong>미세 컴포넌트 단위 스트리밍과의 분리</strong>: 페이지 전체가 아닌 특정 위젯(예: 추천 상품 띠배너)만 개별 로딩하려면 페이지 전체 <code>loading.tsx</code> 대신 내부의 명시적 <code>{'<'}Suspense{'>'}</code> 바운더리를 사용하는 것이 유리합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
