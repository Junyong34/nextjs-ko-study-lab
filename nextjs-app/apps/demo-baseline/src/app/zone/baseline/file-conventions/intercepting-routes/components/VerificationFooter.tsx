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
        title="Intercepting Routes ((..), (.)) 모달 인터셉트 실증 검증"
        expected="• 클라이언트 내비게이션(Link) 시 @modal/(.)photos/[id]가 현재 컨텍스트를 가로채 모달 표시\n• URL 새로고침 또는 직접 주소 입력 시 독립 photos/[id]/page.tsx 전체 화면 마운트"
        actual={
          isDirectPage
            ? `• [직접 접속 모드 감지] photos/${currentPhotoId} 풀 페이지 렌더링 확인\n• 독립 레이아웃 및 딥 링크 주소 직접 파싱 완료`
            : '• 갤러리 피드 대기 상태 (상품 카드의 [모달 열기]를 클릭하여 (.)photos/[id] 인터셉트를 확인하세요)'
        }
        isMatched={isDirectPage || Boolean(currentPhotoId) ? true : undefined}
        description="Next.js App Router의 Intercepting Routes((.), (..), (..)(..), (...))와 Parallel Slots(@modal)를 조합한 컨텍스트 보존 모달 패턴을 검증합니다."
      />
      <DemoDeepDiveCard title="Intercepting Routes ((..), (.))">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 매칭 규칙</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><code>(.)</code>: 동일한 세그먼트 레벨의 경로 가로채기</li>
              <li><code>(..)</code>: 한 단계 상위 세그먼트 레벨의 경로 가로채기</li>
              <li><code>(..)(..)</code>: 두 단계 상위 세그먼트 레벨의 경로 가로채기</li>
              <li><code>(...)</code>: 루트 <code>app</code> 디렉토리 레벨의 경로 가로채기</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 모달 컨텍스트 유지 원리</h5>
            <p>
              <code>layout.tsx</code>에서 <code>{`{ children, modal }`}</code>을 동시에 렌더링하도록 구성하면,
              사용자가 <code>&lt;Link href="/photos/1"&gt;</code>를 클릭했을 때 <code>children</code>(배경 목록)은 그대로 유지되면서 <code>modal</code> 슬롯에 <code>(.)photos/1/page.tsx</code>가 오버레이됩니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>공유 가능한 URL: 모달이 떠 있는 상태에서도 URL이 <code>/photos/101</code>로 변경되어 링크 공유 가능</li>
              <li>뒤로 가기(Back Button) 지원: 브라우저 뒤로 가기를 누르면 모달만 닫히고 배경 스크롤 위치 보존</li>
              <li>하드 리로드 복원력: 새로고침 시 404가 아닌 온전한 상세 페이지로 안전하게 폴백</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>쇼핑몰 상품 퀵뷰(Quick View) 모달</li>
              <li>인스타그램/핀터레스트 스타일 사진 피드 오버레이</li>
              <li>로그인/회원가입 인터셉트 모달 팝업</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
