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
      <DemoDeepDiveCard title="결제 세그먼트 error.tsx 에러 바운더리">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 규칙</h5>
            <p>
              <code>error.tsx</code>는 반드시 클라이언트 컴포넌트(<code>'use client'</code>)여야 합니다.
              Next.js는 이 파일을 React의 Error Boundary로 변환하여 동일 세그먼트의 <code>page.tsx</code> 렌더링 에러를 포착합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. reset() 복구 수명 주기</h5>
            <p>
              <code>error.tsx</code>의 props로 제공되는 <code>reset()</code> 함수는 에러 바운더리의 내용을 지우고 원래의 컴포넌트 트리를 다시 렌더링(re-render)하도록 시도합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>폭포수 에러 방지: 단일 위젯이나 서브 세그먼트의 실패가 전체 웹 애플리케이션의 화이트아웃(White-out)을 유발하지 않음</li>
              <li>다이제스트 로깅: 프로덕션 환경에서 보안을 위해 민감한 스택 트레이스를 감추고 <code>error.digest</code>로 Sentry에 연동</li>
              <li>복구 UX 제공: 새로고침 없이 '다시 시도' 버튼으로 일시적인 네트워크 오류 즉시 복구</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
