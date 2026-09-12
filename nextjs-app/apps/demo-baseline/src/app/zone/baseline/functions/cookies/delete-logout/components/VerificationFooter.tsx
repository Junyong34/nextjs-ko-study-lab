import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'
import type { CookieHistory, CookieObservation } from '../types'

interface VerificationFooterProps {
  observation: CookieObservation | null
  history: CookieHistory
  result: boolean | undefined
  error: string | null
}

export function VerificationFooter({ observation, history, result, error }: VerificationFooterProps) {
  return (
    <>
      <ExpectedActualPanel
        title="생성·삭제 이력과 새 요청의 쿠키 대조"
        expected={<span>회원 쿠키 생성 확인 → 쿠키가 있을 때 삭제 → 검증 요청에서 쿠키 없음</span>}
        actual={
          <span>
            {error ? '요청 실패로 현재 쿠키 상태를 확인하지 못했습니다.' : result === undefined
              ? '대기 중입니다. 쿠키 삭제 검증 버튼으로 새 서버 요청을 보내세요.'
              : `생성 확인: ${history.created ? '완료' : '미완료'} / 삭제 이력: ${history.deleted ? '완료' : '미완료'} / 검증 요청의 쿠키: ${observation?.present ? '있음' : '없음'}`}
          </span>
        }
        isMatched={result}
        description="처음부터 쿠키가 없거나 개발자 도구에서 수동으로 지운 것만으로는 이 실습의 삭제 검증을 통과하지 않습니다."
      />
      <DemoDeepDiveCard title="쿠키 삭제는 다음 요청에서 확인한다">
        <div className="space-y-4 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <section>
            <h4 className="mb-1 font-semibold text-zinc-900 dark:text-zinc-100">로그아웃 버튼에서 실제로 일어난 일</h4>
            <p>버튼은 Server Action의 <code>deleteSessionCookie()</code>를 호출합니다. 서버는 <code>await cookies()</code>로 받은 저장소에서 실습 쿠키를 삭제하고 응답의 <code>Set-Cookie</code>로 만료를 지시합니다. 브라우저가 응답을 적용한 뒤 <code>readSessionCookie()</code>를 별도로 호출해 쿠키가 다음 요청에서 빠졌는지 확인합니다.</p>
            <pre className="mt-2 overflow-x-auto rounded bg-zinc-100 p-3 dark:bg-zinc-900">{`로그아웃 버튼 → 삭제 Server Action
  → Set-Cookie 만료 지시 → 브라우저 적용
  → 별도 읽기 Server Action → 쿠키 없음`}</pre>
          </section>
          <section>
            <h4 className="mb-1 font-semibold text-zinc-900 dark:text-zinc-100">삭제와 화면 전환은 서로 다른 동작</h4>
            <p>React 상태만 게스트로 바꿔도 브라우저 쿠키는 남을 수 있습니다. 이 페이지의 회원 표시는 서버가 실제 요청에서 읽은 결과입니다. 삭제 직후 같은 액션 안에서 읽은 값만으로는 브라우저 적용 여부를 증명할 수 없어 새 요청을 보냅니다.</p>
          </section>
          <section>
            <h4 className="mb-1 font-semibold text-zinc-900 dark:text-zinc-100">Network에서 확인할 것</h4>
            <p>회원 쿠키 생성과 로그아웃은 각각 응답에 <code>Set-Cookie</code>를 보냅니다. 삭제 응답의 과거 만료 시각 등 만료 지시를 확인하고, 뒤따르는 읽기 요청의 <code>Cookie</code>에서 실습 이름이 빠졌는지 비교하세요. 만료 헤더가 반드시 <code>Max-Age=0</code> 형태인 것은 아닙니다.</p>
          </section>
          <section>
            <h4 className="mb-1 font-semibold text-zinc-900 dark:text-zinc-100">사용 조건과 흔한 오용</h4>
            <p>쿠키 변경은 Server Action이나 Route Handler에서 수행합니다. 이 예제는 생성과 삭제에 같은 이름·path를 사용하며, 동일한 도메인과 프로토콜에서 실행합니다. <code>HttpOnly</code> 쿠키는 <code>document.cookie</code>로 확인할 수 없습니다. 전용 경로를 가진 실습 쿠키만 지우므로 다른 데모의 쿠키에는 영향을 주지 않습니다.</p>
            <p className="mt-2">이것은 브라우저 쿠키 삭제 실습입니다. 실제 서비스가 서버 세션 저장소를 쓴다면 그 세션을 무효화하는 작업도 별도로 설계해야 합니다.</p>
          </section>
        </div>
      </DemoDeepDiveCard>
    </>
  )
}
