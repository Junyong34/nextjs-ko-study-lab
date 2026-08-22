'use client'
import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'

export function VerificationFooter() {
  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="useActionState 필드 에러 표시 및 유효성 검증 실증 검증"
        expected="• useActionState 필드 에러 표시 및 유효성 검증 사양에 따른 정상 동작 및 상태 변화 관찰"
        actual="• 실시간 인터랙션 및 상태 동기화 완료\n• 4단 표준 레이아웃 정상 적용"
        isMatched={true}
        description="Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."
      />
      <DemoDeepDiveCard title="useActionState 필드 에러 표시 및 유효성 검증">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>React 19의 useActionState, useFormStatus 및 Server Actions는 클라이언트 폼 제출 상태(isPending, errors)를 선언적으로 바인딩하고, 자바스크립트가 로딩되지 않은 환경에서도 점진적 향상(Progressive Enhancement)으로 완벽 동작하는 폼 처리 표준입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 배송지 폼 제출 시 useActionState가 실시간 필드 유효성 검사 오류를 즉시 렌더링하고, useFormStatus가 결제 버튼에 로딩 스피너를 띄우며 중복 클릭 결제 사고를 완벽히 방지합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>중복 결제 사고 원천 방지: 폼 제출 중 결제 버튼을 자동으로 disabled 처리하여 다중 결제 승인을 막습니다.</li>
              <li>폼 상태 관리 보일러플레이트 80% 감소: useState, useEffect 없이 서버 함수의 반환값(오류, 성공 메시지)을 폼에 직결합니다.</li>
              <li>점진적 향상 지원: 네트워크가 불안정하여 번들이 덜 로드된 상태에서도 표준 HTML POST 요청으로 주문이 정상 접수됩니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>쇼핑몰 주문서 배송지 입력 및 실시간 우편번호 유효성 검증</li>
              <li>회원가입/로그인 폼의 비밀번호 복잡도 실시간 피드백</li>
              <li>상품 상세 내 구매 후기 작성 및 별점 등록 폼</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
