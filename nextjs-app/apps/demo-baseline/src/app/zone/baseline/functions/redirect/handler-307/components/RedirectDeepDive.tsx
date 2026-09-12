import { DemoDeepDiveCard } from '@study/demo-kit'

export function RedirectDeepDive() {
  return (
    <DemoDeepDiveCard title="주소가 바뀌어도 접수 내용이 유지되는 이유">
      <div className="space-y-4 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
        <section className="space-y-1">
          <h4 className="font-semibold">1. 서버가 주소를 알려주고 브라우저가 다시 보냅니다</h4>
          <p>
            이 예제의 submit/route.ts는 상품을 읽거나 대신 전송하지 않고 redirect()만 호출합니다.
            Route Handler가 돌려준 307과 Location을 보고 브라우저의 fetch가 receipt/route.ts로
            같은 POST와 JSON 본문을 다시 보냅니다. 접수 주소를 임시로 옮기면서 본문이 필요한 경우의 흐름입니다.
          </p>
          <pre className="overflow-x-auto rounded bg-zinc-100 p-3 dark:bg-zinc-900">{`브라우저 POST + 상품·수량
  → submit/route.ts: redirect(receipt 주소)
  ← 307 + Location
  → receipt/route.ts: POST + 같은 본문
  ← 200 + 실제 수신 결과`}</pre>
        </section>
        <section className="space-y-1">
          <h4 className="font-semibold">2. GET 비교의 불일치는 무엇을 뜻할까요?</h4>
          <p>
            GET으로 보냈다면 receipt도 GET을 받습니다. 307은 메서드를 보존하므로 GET을 POST로
            바꾸지 않습니다. 비교 실습의 불일치는 네트워크 장애가 아니라 이번 검증 목표가
            POST·본문 보존이라는 뜻입니다. GET의 상품·수량은 본문 대신 query에서 읽습니다.
          </p>
        </section>
        <section className="space-y-1">
          <h4 className="font-semibold">3. 화면의 200과 Network의 307을 구분하세요</h4>
          <p>
            fetch는 기본적으로 리다이렉트를 따라갑니다. 화면의 status와 URL은 마지막 receipt 응답의
            값이며, redirected는 리다이렉트 경유 여부입니다. 이것만으로 중간 상태 코드가 307이었다고
            측정할 수는 없습니다. Network에서 submit의 Status와 Location, receipt의 Method와 Payload를 확인하세요.
          </p>
          <p>
            fetch 요청만 이동하므로 현재 페이지 주소는 바뀌지 않습니다. redirect()의 push/replace를
            HTTP 메서드 보존 옵션으로 해석하지 마세요.
          </p>
        </section>
        <section className="space-y-1">
          <h4 className="font-semibold">4. 실제 접수 기능으로 확장할 때</h4>
          <p>
            receipt는 허용 상품과 수량을 서버에서 검사하고 잘못된 입력에 400을 반환합니다.
            예제는 주문을 저장하지 않습니다. 실제 주문을 저장한다면 재시도·중복 제출 처리도 필요합니다.
            redirect()는 예외로 흐름을 종료하므로 이를 일반 오류처럼 삼키는 try/catch 안에 넣지 않습니다.
            Server Action의 JavaScript 비활성 폼 제출에서 사용하는 303 → GET과 이 307 → POST 흐름도 구분하세요.
          </p>
        </section>
      </div>
    </DemoDeepDiveCard>
  )
}
