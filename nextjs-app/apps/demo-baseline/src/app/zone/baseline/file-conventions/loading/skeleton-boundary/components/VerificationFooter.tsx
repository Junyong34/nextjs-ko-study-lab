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
      <DemoDeepDiveCard title="loading.tsx 스켈레톤 바운더리">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              <code>loading.tsx</code>는 동일 디렉토리의 <code>page.tsx</code> 및 그 하위 자식 컴포넌트를 <code>&lt;Suspense fallback={'{<Loading />}'}&gt;</code>로 감싸주는 특수 파일 컨벤션입니다.
              이를 통해 서버에서 데이터 페칭이 완료되기 전에도 즉시 의미 있는 로딩 스켈레톤 UI를 클라이언트에 전달할 수 있습니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 인스턴트 내비게이션(Instant Navigation)</h5>
            <p>
              Next.js는 사용자가 링크를 클릭하는 즉시 <code>loading.tsx</code>를 렌더링하므로, 느린 서버 쿼리나 외부 API 응답 대기 중에도 화면이 멈추지 않고 즉각적인 피드백을 제공합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>사용자 체감 속도 극대화: TTFB(Time to First Byte) 지연을 스켈레톤 렌더링으로 상쇄</li>
              <li>보일러플레이트 제로: 수동으로 <code>&lt;Suspense&gt;</code>를 작성하지 않아도 디렉토리 단위 자동 적용</li>
              <li>점진적 렌더링: 무거운 서버 컴포넌트가 준비되는 즉시 해당 청크만 선택적 스트리밍</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
