'use client'
import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'

interface VerificationFooterProps {
  currentPhotoId?: string
  isDirectPage?: boolean
}

export function VerificationFooter({
  currentPhotoId,
  isDirectPage = false,
}: VerificationFooterProps) {
  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="Intercepting Routes ((..), (.)) 모달 인터셉트 검증 결과"
        expected="• 클라이언트 내비게이션(Link) 시 @modal/(.)photos/[id]가 현재 컨텍스트를 가로채 모달 표시\n• URL 새로고침 또는 직접 주소 입력 시 독립 photos/[id]/page.tsx 전체 화면 마운트"
        actual={
          isDirectPage
            ? `• [직접 접속 모드 감지] photos/${currentPhotoId} 풀 페이지 렌더링 확인\n• 독립 레이아웃 및 딥 링크 주소 직접 파싱 완료`
            : '• 갤러리 피드 대기 상태 (상품 카드의 [모달 열기]를 클릭하여 (.)photos/[id] 인터셉트를 확인하세요)'
        }
        isMatched={isDirectPage || Boolean(currentPhotoId) ? true : undefined}
        description="Next.js App Router의 Intercepting Routes((.), (..), (..)(..), (...))와 Parallel Slots(@modal)를 조합한 컨텍스트 보존 모달 패턴을 검증합니다."
      />
      <DemoDeepDiveCard title="Intercepting Routes ((..), (.)) 라우트 인터셉트 & 컨텍스트 보존 모달">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              Intercepting Routes는 현재 페이지의 컨텍스트(배경 화면)를 그대로 유지한 채 다른 라우트 세그먼트를 가로채어 오버레이 모달로 표시하는 Next.js 고급 라우팅 컨벤션입니다. 매칭 규칙은 <code>(.)</code>(동일 레벨), <code>(..)</code>(상위 1단계), <code>(..)(..)</code>(상위 2단계), <code>(...)</code>(루트 app)으로 정의됩니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 갤러리 피드에서 상품 카드를 클릭했을 때 <code>@modal/(.)photos/[id]</code>가 활성화되어 배경 상품 목록은 그대로 유지된 채 사진 상세 모달이 오버레이되고, 브라우저 주소창은 <code>/photos/[id]</code>로 즉시 변경되는 인터셉트 메커니즘을 검증합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>공유 가능한 모달 URL</strong>: 모달이 열린 상태에서도 URL이 <code>/photos/101</code>로 변경되어 복사 및 소셜 공유가 가능합니다.</li>
              <li><strong>브라우저 뒤로 가기(Back) 완벽 지원</strong>: 뒤로 가기 클릭 시 모달만 부드럽게 닫히며 배경 목록의 스크롤 위치와 탐색 상태가 100% 보존됩니다.</li>
              <li><strong>하드 리로드(새로고침) 복원력</strong>: 새로고침이나 직접 URL 입력 시에는 독립된 <code>photos/[id]/page.tsx</code> 전체 화면으로 안전하게 렌더링됩니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>쇼핑몰 상품 목록에서의 빠른 장바구니/옵션 선택 퀵뷰(Quick View) 모달</li>
              <li>인스타그램/핀터레스트 스타일 사진 피드 오버레이</li>
              <li>결제 화면 이동 중 로그인/회원가입 인터셉트 모달 팝업</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>@modal/default.tsx null 반환 필수</strong>: 모달이 닫혀 있을 때 화면에 아무것도 렌더링되지 않도록 <code>@modal/default.tsx</code>에서 <code>return null</code>을 반드시 선언해야 합니다.</li>
              <li><strong>모달 닫기 구현</strong>: 모달을 닫을 때는 <code>router.back()</code>을 호출하여 URL 히스토리를 이전 상태로 되돌리는 것이 표준 구현 패턴입니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
