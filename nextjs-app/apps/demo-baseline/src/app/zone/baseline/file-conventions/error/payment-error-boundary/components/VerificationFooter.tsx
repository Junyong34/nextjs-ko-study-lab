'use client'
import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'

interface VerificationFooterProps {
  isErrorCaught?: boolean
}

export function VerificationFooter({ isErrorCaught = false }: VerificationFooterProps) {
  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="결제 세그먼트 error.tsx 에러 바운더리 실증 검증"
        expected="• checkout/error.tsx 파일이 세그먼트 에러 바운더리로 등록\n• 런타임 오류 발생 시 상위 레이아웃을 파괴하지 않고 에러 카드 및 reset() 복구 기능 제공"
        actual={
          isErrorCaught
            ? '• [에러 포착] checkout/error.tsx 컴포넌트 활성화 및 에러 격리 성공'
            : '• 결제 세그먼트 정상 동작 대기 중 (/checkout 진입 후 에러를 발생시키세요)'
        }
        isMatched={isErrorCaught ? true : undefined}
        description="Next.js App Router의 error.tsx 컨벤션을 통해 세그먼트 단위 React Error Boundary를 구축하고 안전한 복구 수명 주기를 검증합니다."
      />
      <DemoDeepDiveCard title="결제 세그먼트 error.tsx 에러 바운더리 & reset() 복구">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              <code>error.tsx</code>는 반드시 클라이언트 컴포넌트(<code>'use client'</code>)로 선언되며, 해당 라우트 세그먼트의 <code>page.tsx</code>와 하위 컴포넌트 트리를 React Error Boundary로 감싸는 표준 파일 컨벤션입니다. <code>{'{'} error, reset {'}'}</code> Props를 전달받아 에러 메시지를 표시하고 복구(Retry)를 시도합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 결제 처리(<code>/checkout</code>) 중 PG사 통신 장애나 잔액 부족 예외가 발생했을 때, 상위 GNB 네비게이션과 주문 요약 레이아웃을 안전하게 유지한 채 결제 폼 영역만 <code>error.tsx</code> 폴백 UI로 격리 치환하고, [다시 시도] 버튼으로 결제 재인증을 수행하는 흐름을 검증합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>화면 전체 크래시(White-out) 원천 방지</strong>: 단일 결제 모듈이나 API 실패가 앱 전체 붕괴로 이어지지 않도록 세그먼트 단위로 결함을 격리합니다.</li>
              <li><strong>보안 다이제스트 제공</strong>: 프로덕션 환경에서 민감한 서버 스택 트레이스를 감추고 <code>error.digest</code> 해시 코드만 클라이언트에 전달하여 보안을 유지합니다.</li>
              <li><strong>사용자 이탈 없는 즉시 복구</strong>: 전체 페이지 새로고침 없이 <code>reset()</code>을 호출하여 일시적 네트워크 오류를 즉각 복구합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>외부 PG사/간편결제 연동 결제 처리 모듈 장애 대응</li>
              <li>장바구니 결제금액 쿠폰 할인 계산 서버 오류 복구</li>
              <li>배송지 주소 유효성 검증 API 실패 시 재입력 안내</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>동일 레벨 layout.tsx 에러 미포착</strong>: <code>error.tsx</code>는 계층상 <code>layout.tsx</code> 하위에 렌더링되므로, 동일 세그먼트 레이아웃의 에러는 포착하지 못하며 상위 세그먼트의 <code>error.tsx</code>가 처리해야 합니다.</li>
              <li><strong>reset()과 router.refresh() 연계</strong>: 서버 컴포넌트 렌더링 실패 후 <code>reset()</code>만 단독 호출하면 캐시된 에러가 재발생할 수 있으므로 <code>startTransition(() ={'>'} {'{'} router.refresh(); reset(); {'}'})</code> 패턴을 적용해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
