import { DemoDeepDiveCard } from '@study/demo-kit'

export function RedirectDeepDive() {
  return (
    <DemoDeepDiveCard title="이번 상품 제출에서 redirect()가 한 일">
      <div className="space-y-3 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
        <section>
          <h4 className="font-semibold">입력 검증 다음에 이동합니다</h4>
          <p>폼은 실제 Server Action인 submitOrder에 상품과 수량을 보냅니다. 서버는 정수 수량 1~10개인지 확인하고, 유효할 때만 확인서 쿠키를 저장한 뒤 redirect()를 호출합니다. 예시 상품과 확인서를 사용하며 실제 주문·결제는 하지 않습니다.</p>
        </section>
        <pre className="overflow-x-auto rounded bg-zinc-100 p-3 dark:bg-zinc-900"><code>{'page.tsx → 상품 form\n  → actions.ts: 입력 검증 → cookies().set()\n  → redirect(완료 URL)\n  → complete/page.tsx: URL과 쿠키 대조'}</code></pre>
        <section>
          <h4 className="font-semibold">JavaScript 유무에 따라 이동 방식이 다릅니다</h4>
          <p>Next.js 16.3.2에서 JS가 켜진 폼은 fetch action 응답 200과 x-action-redirect를 통해 클라이언트 내비게이션을 합니다. JS가 꺼진 일반 폼은 POST 응답 303과 Location을 받고 완료 URL을 GET으로 요청합니다. 완료 화면에 도착했다는 사실만으로 303을 측정했다고 볼 수 없습니다.</p>
        </section>
        <section>
          <h4 className="font-semibold">확인서 재조회와 새 제출을 구분합니다</h4>
          <p>완료 URL을 새로고침하면 10분 동안 보관하는 기존 확인서를 다시 읽습니다. 새 주문이나 redirect가 발생했다는 뜻은 아닙니다. 이 JSON 쿠키는 서명되지 않은 학습용 데이터이므로 인증·결제·위변조 방지의 증거로 사용할 수 없습니다.</p>
        </section>
        <section>
          <h4 className="font-semibold">redirect는 흐름을 종료합니다</h4>
          <p>redirect()는 NEXT_REDIRECT 예외로 실행을 끝내므로 일반 try/catch 밖에서 호출합니다. 303 이후 GET 새로고침은 원래 POST의 재제출을 줄이지만, 중복 클릭이나 재시도까지 막지는 않습니다. 실제 결제의 중복 방지는 별도로 설계해야 합니다. Route Handler의 기본 307은 POST를 포함한 원래 메서드와 본문을 보존합니다.</p>
        </section>
      </div>
    </DemoDeepDiveCard>
  )
}
