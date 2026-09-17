'use client'
import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'

export function VerificationFooter() {
  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="Server Action 내 redirect() 실행 전 상태"
        description="redirect()는 실제로 페이지를 이동시키므로 이 화면에 머문 채로는 결과를 재현할 수 없습니다. 대기 중 상태가 정상입니다."
        expected="[세션 만료 시뮬레이션] 클릭 시 expireSessionAction()의 redirect() 호출로 이 페이지를 벗어나 returnUrl=/checkout이 포함된 로그인 화면으로 이동해야 한다."
        actual={
          <>
            이 화면이 보인다는 것은 아직 버튼을 누르지 않았다는 뜻입니다. 버튼을 클릭하면 이 페이지 자체가
            사라지므로, 실제 검증 결과(returnUrl 일치 여부)는 이동한 로그인 화면 하단의 [검증] 패널에서 확인할 수
            있습니다.
          </>
        }
      />
      <DemoDeepDiveCard title="세션 만료 시 returnUrl과 함께 로그인 화면으로 이동">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 동작 원리</h5>
            <p>
              Server Action(<code>expireSessionAction</code>) 내부에서 호출하는 <code>redirect(url)</code>는{' '}
              <code>NEXT_REDIRECT</code> 예외를 던져 서버 실행을 즉시 중단합니다. 이 예외가 만드는 실제 응답은
              실행 환경에 따라 다릅니다 — 자바스크립트 없이 폼만 제출된 경우에는 303 See Other 응답을 반환하지만,
              이 데모처럼 클라이언트 컴포넌트가 <code>startTransition</code>으로 Server Action을 호출하는 자바스크립트
              활성 환경에서는 <strong>HTTP 307 리다이렉트 대신 클라이언트 사이드 전환</strong>이 일어납니다. 307은
              Server Component 렌더링 중이나 Route Handler처럼 다른 컨텍스트에서 <code>redirect()</code>를 호출할
              때만 사용됩니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 이 데모에서 실제로 관측되는 값</h5>
            <p>
              [세션 만료 시뮬레이션] 버튼을 누르면 <code>expireSessionAction()</code>이 실행되고{' '}
              <code>redirect(&apos;/login?returnUrl=%2Fcheckout&apos;)</code>가 호출됩니다. 이때 서버가 실제로
              반환하는 응답은 303이 아니라{' '}
              <strong>
                200 OK와 <code>x-action-redirect</code> 응답 헤더
              </strong>
              이며, Next.js 클라이언트 런타임이 이 헤더를 읽어 <code>router.push()</code>로 화면을 전환합니다.
              Network 탭에서 이 요청을 직접 열어보면 확인할 수 있습니다. 이동한 로그인 화면은 쿼리로 전달된{' '}
              <code>returnUrl</code> 값을 그대로 화면에 표시합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>
                <strong>자연스러운 복귀 UX 제공</strong>: <code>returnUrl</code> 쿼리를 보존하면 로그인을 완료한
                즉시 원래 보려던 화면으로 돌아갈 수 있는 정보를 전달할 수 있습니다.
              </li>
              <li>
                <strong>깔끔한 제어 흐름</strong>: 클라이언트가 응답을 받아 <code>router.push</code>를 수동 호출할
                필요 없이, 서버 로직이 끝나는 지점에서 곧바로 이동을 지시합니다.
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 이 데모에서 다루지 않음</h5>
            <p>
              실제 서비스라면 쿠키 기반 세션 검사, 미들웨어와의 역할 분담, <code>returnUrl</code>이 외부 도메인을
              가리키지 못하도록 막는 오픈 리다이렉트 방어가 함께 필요합니다. 이 데모는 버튼 클릭을 세션 만료
              트리거로 대신하고 <code>redirect()</code> 호출과 <code>returnUrl</code> 전달 자체만 보여주므로, 위
              항목들은 구현하지 않았습니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>
                <strong>try/catch 블록 바깥에서 호출</strong>: <code>redirect()</code>는 에러를 던지는 방식으로
                동작하므로, <code>try/catch</code> 내부에서 호출하면 catch 문에 걸려 리다이렉트가 취소될 수
                있습니다.
              </li>
              <li>
                <strong>이벤트 핸들러에서는 직접 호출 불가</strong>: 클라이언트 이벤트 핸들러에서 <code>redirect()</code>를
                직접 호출할 수 없으므로, 이 데모처럼 Server Action을 통해 호출하거나 <code>useRouter</code>의{' '}
                <code>push</code>를 사용해야 합니다.
              </li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
