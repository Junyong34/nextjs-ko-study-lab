'use client'
import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'

export function VerificationFooter() {
  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="Server Action 내 redirect() 실행 전 상태"
        description="redirect()는 실제로 페이지를 이동시키므로 이 화면에 머문 채로는 결과를 재현할 수 없습니다. 대기 중 상태가 정상입니다."
        expected="[219,000원 결제하기] 클릭 시 completeOrderAction()의 redirect() 호출로 이 페이지를 벗어나 주문 완료 화면으로 이동해야 한다."
        actual={
          <>
            이 화면이 보인다는 것은 아직 결제 버튼을 누르지 않았다는 뜻입니다. 버튼을 클릭하면 이 페이지 자체가
            사라지므로, 실제 검증 결과는 이동한 주문 완료 화면 하단의 [검증] 패널에서 확인할 수 있습니다.
          </>
        }
      />
      <DemoDeepDiveCard title="Server Action 내 redirect()를 통한 주문 완료 화면 이동">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 동작 원리</h5>
            <p>
              Server Action 내부에서 호출하는 <code>redirect(url)</code>는 <code>NEXT_REDIRECT</code> 예외를
              던져 서버 실행을 즉시 중단합니다. 이 예외가 만드는 실제 응답은 실행 환경에 따라 다릅니다 —
              자바스크립트 없이 폼만 제출된 경우에는 303 See Other 응답을 반환하지만, 자바스크립트가 켜진 일반적인
              브라우저에서는 <strong>HTTP 리다이렉트 대신 클라이언트 사이드 전환</strong>이 일어납니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 이 데모에서 실제로 관측되는 값</h5>
            <p>
              [219,000원 결제하기] 버튼을 누르면 <code>completeOrderAction()</code>이 실행되고{' '}
              <code>redirect(&apos;/zone/baseline/guides/redirecting/order-complete/complete?amount=219000&apos;)</code>
              가 호출됩니다. 이때 서버가 실제로 반환하는 응답은 303이 아니라{' '}
              <strong>
                200 OK와 <code>x-action-redirect</code> 응답 헤더
              </strong>
              이며, Next.js 클라이언트 런타임이 이 헤더를 읽어 <code>router.push()</code>로 화면을 전환합니다.
              Network 탭에서 이 요청을 직접 열어보면 확인할 수 있습니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>
                <strong>중복 결제(Double Submit) 방지</strong>: Post-Redirect-Get(PRG) 패턴을 따르므로 완료
                화면에서 새로고침해도 결제 Server Action이 다시 호출되지 않습니다.
              </li>
              <li>
                <strong>깔끔한 제어 흐름</strong>: 클라이언트가 응답을 받아 <code>router.push</code>를 수동
                호출할 필요 없이, 서버 로직이 끝나는 지점에서 곧바로 이동을 지시합니다.
              </li>
              <li>
                <strong>조건부 분기 라우팅</strong>: 결제 실패 시 에러 화면으로, 성공 시 완료 화면으로 서버에서
                직접 분기할 수 있습니다.
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>쇼핑몰 결제 완료 후 주문 영수증 화면으로 이동</li>
              <li>1:1 고객 문의 등록 완료 후 접수 확인 화면 이동</li>
              <li>설문조사 제출 후 참여 완료 안내 화면 이동</li>
            </ul>
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
                <strong>영구 이동은 permanentRedirect() 사용</strong>: <code>redirect()</code>는 임시 이동(Server
                Component·Route Handler 기준 307)을 위한 함수이며, 영구 이동이 필요하면 308 응답을 반환하는{' '}
                <code>permanentRedirect()</code>를 사용해야 합니다.
              </li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
