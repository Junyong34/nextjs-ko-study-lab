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
            <DemoDeepDiveCard title="NextResponse.rewrite() 내부 URL 리라이트 가상 라우팅">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p><code>NextResponse.rewrite()</code> (<code>next/server</code>)는 브라우저의 URL 주소창은 그대로 유지하면서 서버 내부적으로 다른 엔드포인트나 외부 프록시 경로의 렌더링 결과를 매핑하여 반환하는 가상 라우팅 API입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 사용자가 <code>shop.com/sale</code>로 접근했을 때 브라우저 주소는 유지한 채 내부적으로 <code>NextResponse.rewrite(new URL('/events/2026-summer-sale', request.url))</code>를 실행하여 타겟 페이지 콘텐츠를 투명하게 서빙합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>사용자 친화적 단축 URL 제공</strong>: 복잡한 내부 구조를 숨기고 깔끔하고 짧은 가상 URL을 브라우저에 표시합니다.</li>
              <li><strong>A/B 테스트 및 카나리 배포</strong>: 동일한 URL에서 사용자 그룹에 따라 버전 A 또는 버전 B의 내부 경로로 무중단 분기합니다.</li>
              <li><strong>멀티 테넌트 서브도메인 매핑</strong>: <code>tenant1.app.com</code> 요청을 내부 <code>/_tenants/tenant1</code> 경로로 URL 변경 없이 렌더링합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>서브도메인 기반 테넌트 분기 (<code>tenant.shop.com</code> -{'>'} <code>/tenants/tenant</code>)</li>
              <li>A/B 테스트 트래픽 분기 (동일 URL에서 50% 확률로 <code>/variant-b</code> 리라이트)</li>
              <li>마이크로 프론트엔드 레거시 시스템으로의 투명한 리버스 프록시</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>redirect()와의 차이</strong>: <code>redirect()</code>는 브라우저 URL 주소가 바뀌며 3xx 응답을 반환하지만, <code>rewrite()</code>는 주소창 변화 없이 200 상태로 내부 콘텐츠만 바꿉니다.</li>
              <li><strong>상대 경로 에셋 참조</strong>: 리라이트 시 CSS/이미지 등 정적 에셋의 상대 경로가 어긋날 수 있으므로 절대 경로(<code>/images/...</code>)를 사용해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
