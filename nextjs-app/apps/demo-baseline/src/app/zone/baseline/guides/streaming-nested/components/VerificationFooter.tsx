'use client'

import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'

export interface VerificationFooterProps {
  recommendedLoaded?: boolean
  reviewsLoaded?: boolean
}

export function VerificationFooter({
  recommendedLoaded = false,
  reviewsLoaded = false,
}: VerificationFooterProps) {
  const isMatched =
    recommendedLoaded && reviewsLoaded
      ? true
      : undefined

  const expected =
    '• 1단계: 600ms 추천 상품 청크 수신 (3건)\n• 2단계: 1000ms 구매 후기 중첩 청크 수신 (2건, 별점 ★★★★★ 정상 렌더링)\n• 계층적 중첩 Suspense 점진적 청크 스트리밍 정상 완료'

  const actual =
    !recommendedLoaded && !reviewsLoaded
      ? '• 청크 스트리밍 대기 중 (초기 상품 셸 수신 중...)'
      : recommendedLoaded && !reviewsLoaded
      ? '• 1차 외측 청크 수신 완료: 추천 상품 3건 마운트 (600ms)\n• 2차 내측 청크 대기 중: 구매 후기 스트리밍 진행 중 (1000ms)...'
      : '• 1차 외측 청크 수신 완료: 추천 상품 3건 (알루미늄 팜레스트 외 2건)\n• 2차 내측 청크 수신 완료: 구매 후기 2건 (프로개발자, 디자이너K ★★★★★)\n• 계층적 중첩 Suspense 점진적 스트리밍 렌더링 완료'

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="중첩 Suspense 점진적 청크 스트리밍 검증 결과"
        expected={expected}
        actual={actual}
        isMatched={isMatched}
        description="다중 계층 Suspense 바운더리를 통한 점진적 HTML 청크 스트리밍 라이프사이클을 검증합니다."
      />
      <DemoDeepDiveCard title="중첩 Suspense 점진적 청크 스트리밍">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              중첩 Suspense 스트리밍은 하나의 페이지 내에서 서로 다른 비동기 지연 시간을 가진 컴포넌트들을 다중 계층 <code>&lt;Suspense&gt;</code> 바운더리로 배치하여, 빠른 영역(상품 기본 정보 및 추천)은 즉시 렌더링하고 느린 영역(실시간 후기 평점)은 준비되는 순서대로 점진적 HTML 청크로 스트리밍하는 표준 스펙입니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 즉시 표시되는 메인 상품 헤더 외에, 외측 Suspense(600ms 소요 추천 상품) 내부에 내측 Suspense(1000ms 소요 구매 후기)를 중첩 배치하여, 외측 청크 도착 시 추천 상품과 내측 스켈레톤이 먼저 렌더링되고 이후 후기 데이터가 순차 교체되는 계층적 멀티 청크 스트리밍을 시각화합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>가장 느린 데이터에 의한 블로킹 제거</strong>: 후기나 추천 조회가 지연되어도 사용자는 즉시 상품 기본 정보와 구매 버튼을 확인 가능합니다.</li>
              <li><strong>Time to First Byte(TTFB) 및 FCP 극대화</strong>: 초기 레이아웃 셸이 서버에서 브라우저로 즉시 플러시(Flush)되어 체감 로딩 속도를 대폭 개선합니다.</li>
              <li><strong>독립적인 로딩 및 에러 격리</strong>: 내측 후기 조회가 실패하거나 지연되어도 상위 추천 상품이나 본문 페이지는 정상 동작을 유지합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>이커머스 상품 상세 페이지(기본 정보 + 연관 상품 외측 바운더리 + 실시간 후기 내측 바운더리)</li>
              <li>대시보드 메인 화면(핵심 지표 요약 + 실시간 로그 스트림 + 대용량 집계 차트)</li>
              <li>동영상 포털(비디오 플레이어 + 댓글 목록 + 추천 재생목록)</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>Suspense 바운더리 계층 설계</strong>: 바운더리를 너무 잘게 쪼개면 화면 깜빡임(Layout Shift)이 발생할 수 있으므로 의미 있는 UI 블록 단위로 중첩 구조를 설계합니다.</li>
              <li><strong>SEO 크롤러 호환성</strong>: 검색엔진 크롤러는 스트리밍 응답이 완료될 때까지 대기하여 전체 HTML을 수집하므로 SEO 점수에 불이익이 없습니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
