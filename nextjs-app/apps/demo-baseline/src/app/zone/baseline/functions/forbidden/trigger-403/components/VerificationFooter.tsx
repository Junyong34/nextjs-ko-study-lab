import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'
import type { DemoRole } from '../types'

export function VerificationFooter({ currentRole }: { currentRole: DemoRole }) {
  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="forbidden() 403 인가 거부 트리거 검증 결과"
        expected="CUSTOMER 역할로 접근 시 forbidden()이 호출되어 HTTP 403 + forbidden.tsx가 렌더링되고, ADMIN 역할로 접근 시 실제 정산 데이터가 담긴 200 OK 화면이 렌더링된다."
        actual={`• 현재 세션 역할(쿠키): ${currentRole.toUpperCase()}\n• 위 [정산 관리자 페이지 접근 시도]를 눌러 실제 이동 결과를 관찰하세요. 이동한 페이지 하단에 실측 상태 코드 패널이 있습니다.`}
        isMatched={undefined}
        description="이 검증은 실제 라우트 이동 이후에 완성됩니다 — forbidden()은 별도 세그먼트의 렌더링 도중 발생하므로, 지금 이 페이지에서 결과를 미리 보여주지 않습니다."
      />
      <DemoDeepDiveCard title="forbidden() 403 권한 거부 트리거 및 forbidden.tsx 연동">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              <code>forbidden()</code> (<code>next/navigation</code>)은 인증은 되었으나 특정 리소스에 대한 접근 권한(Authorization)이
              부족할 때 호출되어 <code>NEXT_HTTP_ERROR_FALLBACK;403</code> 예외를 던지고, 가장 가까운 <code>forbidden.tsx</code>{' '}
              파일 컨벤션을 렌더링하며 HTTP 403 상태를 반환하는 함수다. Next.js 16.3.2 기준 여전히 experimental 상태다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 필수 설정: authInterrupts</h5>
            <p>
              <code>forbidden()</code>과 <code>forbidden.tsx</code>는 <code>next.config.ts</code>의{' '}
              <code>experimental.authInterrupts: true</code> 없이는 동작하지 않는다. 이 데모 zone(
              <code>apps/demo-baseline/next.config.ts</code>)도 이 플래그를 켜야만 아래 실습이 실제 403을 반환한다 — 꺼진
              상태에서 <code>forbidden()</code>을 호출하면 일반 서버 오류로 처리된다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 이 데모의 실제 동작 원리</h5>
            <p>
              이 예제는 하드코딩된 조건 분기가 아니라 실제 라우팅으로 동작한다. [정산 관리자 페이지 접근 시도]를 누르면{' '}
              <code>/admin/settlements</code> 서브 라우트로 실제 이동하고, 그 페이지의 서버 컴포넌트가{' '}
              <code>cookies()</code>로 세션 역할을 읽어 <code>admin</code>이 아니면 <code>forbidden()</code>을 호출한다.
              같은 세그먼트에 있는 <code>forbidden.tsx</code>가 그 순간 렌더링되며, 브라우저 Network 탭 또는 curl로 실제 403
              상태 코드를 확인할 수 있다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>
                <strong>401(미인증)과 403(인가 실패)의 명확한 분리</strong>: 로그인되지 않은 상태와 권한이 부족한 상태를 명확히
                구별하여 정확한 HTTP 상태를 제공한다.
              </li>
              <li>
                <strong>선언적 권한 제어</strong>: 복잡한 리다이렉트 분기 없이 권한 부족 시점에 한 줄로 접근을 차단한다.
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>
                <strong>try/catch 래핑 금지</strong>: <code>forbidden()</code>도 Next.js 내부 제어 예외를 던지므로{' '}
                <code>try/catch</code>로 가로채면 forbidden UI가 렌더링되지 않는다.
              </li>
              <li>
                <strong>루트 레이아웃 호출 불가</strong>: <code>app/layout.tsx</code>에서는 <code>forbidden()</code>을 호출할 수
                없다.
              </li>
              <li>
                <strong>forbidden.tsx 파일 구비</strong>: 해당 세그먼트 또는 상위에 <code>forbidden.tsx</code> 파일이 정의되어
                있어야 커스텀 권한 부족 UI가 렌더링된다.
              </li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
