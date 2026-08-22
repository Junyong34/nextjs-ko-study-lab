'use client'
import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'

interface VerificationFooterProps {
  isRewritten?: boolean
  targetRoute?: string
  httpStatus?: number | null
}

export function VerificationFooter({
  isRewritten = false,
  targetRoute,
  httpStatus,
}: VerificationFooterProps) {
  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="NextResponse.rewrite() 가상 경로 라우팅 실증 검증"
        expected="• /api 요청 시 URL 변경 없이 내부 /target 엔드포인트로 포워딩되어 응답 생성\n• NextResponse.rewrite(destination) 라우팅 완료"
        actual={
          isRewritten
            ? `• [HTTP ${httpStatus}] 가상 엔드포인트 -> ${targetRoute} 내부 리라이트 확인\n• 브라우저 URL 유지 및 타겟 데이터 성공적 반환`
            : '• 리라이트 엔드포인트 호출 대기 중...'
        }
        isMatched={isRewritten && Boolean(httpStatus === 200)}
        description="Next.js App Router의 NextResponse.rewrite() 메서드를 통해 브라우저 URL을 유지한 채 내부 서버 경로로 프록시 리라이트되는 동작을 검증합니다."
      />
      <DemoDeepDiveCard title="NextResponse.rewrite() 가상 경로 라우팅">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              <code>NextResponse.rewrite(destination, init?)</code>은 브라우저의 주소창 URL을 변경하지 않고 서버 내부에서 다른 URL이나 라우트 핸들러로 요청을 투명하게 전달합니다.
              이는 HTTP 301/302/307 리다이렉트(Redirect)와 달리 클라이언트와의 추가적인 왕복(Round-trip)이 발생하지 않습니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. Redirect vs Rewrite 비교</h5>
            <p>
              <b>Redirect</b>는 브라우저에게 새 URL로 다시 요청하라고 지시하므로 주소창이 바뀌고 클라이언트 히스토리에 기록됩니다.
              반면 <b>Rewrite</b>는 서버 내부에서 조용히 대상을 변경하여 콘텐츠를 반환하므로 주소창이 변경되지 않고 가상 경로 마스킹이 가능합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>URL 마스킹 및 레거시 호환: 사용자에게는 깔끔한 짧은 URL을 보여주고 내부는 버전화된 API로 매핑</li>
              <li>A/B 테스팅 및 점진적 롤아웃: 주소 변경 없이 트래픽의 일부를 신규 기능 엔드포인트로 라우팅</li>
              <li>멀티 테넌시(Multi-tenancy): 서브도메인이나 가상 경로를 특정 상점(Store) 핸들러로 내부 전달</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>글로벌/국가별 가상 쇼핑몰 경로(e.g., <code>/kr/sale</code> &rarr; <code>/catalog?region=kr</code>)</li>
              <li>마이크로서비스 BFF 프록시 게이트웨이 연동</li>
              <li>레거시 URL 체계 유지 및 신규 아키텍처 점진적 마이그레이션</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
