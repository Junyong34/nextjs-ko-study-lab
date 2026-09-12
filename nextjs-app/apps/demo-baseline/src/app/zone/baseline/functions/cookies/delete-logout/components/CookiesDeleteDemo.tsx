'use client'

import { DemoPlaygroundCard, DemoResetButton, MOCK_USER_SESSIONS } from '@study/demo-kit'
import { useCookieSession } from '../hooks/useCookieSession'
import { VerificationFooter } from './VerificationFooter'

const buttonClass = 'rounded bg-zinc-900 px-3.5 py-2 text-xs font-semibold text-white disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900'

export function CookiesDeleteDemo() {
  const session = useCookieSession()
  const { observation, ready, busy, history, result, error, notice, run } = session
  const member = MOCK_USER_SESSIONS.vip
  const profile = !observation ? '서버 확인 대기' : observation.isDemoMember
    ? `${member.name} · ${member.tier} 회원`
    : observation.present ? '알 수 없는 실습 쿠키' : '게스트'

  return (
    <>
      <DemoPlaygroundCard title="쇼핑몰 회원 로그아웃">
        <div className="space-y-4 text-sm text-zinc-700 dark:text-zinc-300" aria-busy={busy}>
          <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
            <p className="font-semibold text-zinc-900 dark:text-zinc-100">{profile}</p>
            <p className="mt-1 text-xs">회원 정보와 쿠키 값은 학습용입니다. 실제 인증이나 서버 세션 저장소를 구현하지 않습니다.</p>
            <dl className="mt-3 space-y-1 text-xs">
              <div><dt className="inline font-medium">최근 요청의 쿠키: </dt><dd className="inline">{observation ? observation.present ? '있음' : '없음' : '확인 전'}</dd></div>
              <div><dt className="inline font-medium">마지막 서버 확인: </dt><dd className="inline">{observation ? new Date(observation.checkedAt).toLocaleTimeString('ko-KR') : '아직 없음'}</dd></div>
              <div><dt className="inline font-medium">이번 실행의 이력: </dt><dd className="inline">생성 확인 {history.created ? '완료' : '미완료'} · 쿠키가 있을 때 삭제 {history.deleted ? '완료' : '미완료'}</dd></div>
            </dl>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" disabled={!ready || busy} onClick={() => void run('create')} className={buttonClass}>회원 쿠키 생성</button>
            <button type="button" disabled={!ready || busy} onClick={() => void run('delete')} className={buttonClass}>로그아웃 (cookies().delete)</button>
            <button type="button" disabled={!ready || busy} onClick={() => void run('verify')} className={buttonClass}>쿠키 삭제 검증</button>
            <DemoResetButton disabled={busy} onReset={() => run('reset')} label={ready ? '예제 초기화' : '준비 다시 시도'} />
          </div>
          <p role="status" aria-live="polite" className="text-xs">{notice}</p>
          {error && <p role="alert" className="text-xs text-rose-700 dark:text-rose-300">{error}</p>}
        </div>
      </DemoPlaygroundCard>
      <VerificationFooter observation={observation} history={history} result={result} error={error} />
    </>
  )
}
