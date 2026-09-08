export function LocalCsrfGuide() {
  return <details className="rounded border p-3 text-sm">
    <summary className="cursor-pointer font-semibold">로컬에서 다른 출처 요청의 차단 확인</summary>
    <ol className="mt-3 list-decimal space-y-2 pl-5">
      <li>저장소 루트에서 <code>pnpm install</code>, <code>pnpm dev</code>를 실행하고 로컬 셸의 이 실습을 엽니다.</li>
      <li>개발자 도구 Network를 열고 정상 요청을 실행합니다. POST 요청을 선택해 Copy as cURL로 복사하세요. 브라우저가 보낸 최신 요청을 사용해야 합니다.</li>
      <li>복사한 명령의 대상이 자신의 localhost인지 확인하고 터미널에서 그대로 실행합니다. 서버 로그의 <code>[csrf-demo] action reached</code>와 정상 응답을 확인하세요.</li>
      <li>같은 명령에서 Origin 헤더의 값만 <code>https://csrf-demo.invalid</code>로 바꿔 다시 실행합니다. 요청 대상 URL과 나머지 헤더·본문은 그대로 둡니다. 해당 도메인으로 접속하는 실습이 아닙니다.</li>
      <li>Next.js의 Origin 불일치·Aborting the action 로그와 실패 응답을 함께 확인합니다. 이 요청에는 새 action reached 로그가 없어야 합니다. 500 응답만으로 차단 성공이라고 판단하지 마세요.</li>
      <li>Origin을 원래 값으로 복원해 다시 성공하는지 확인합니다. 오래된 액션 요청이라 실패하면 Network에서 최신 요청을 다시 복사하세요.</li>
    </ol>
    <p className="mt-3">아래 패널은 정상 요청만 관측합니다. 이 로컬 차단 절차는 웹 화면에서 자동 판정하지 않습니다. 브라우저 JavaScript로 Origin을 바꾸는 방법은 사용하지 않습니다.</p>
  </details>
}
