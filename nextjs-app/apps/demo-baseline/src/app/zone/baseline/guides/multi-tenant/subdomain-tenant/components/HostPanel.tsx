import { resolveTenant } from '../lib/tenants'

/** 이 페이지 자신이 받은 Host. 셸을 거치면 학습자가 보는 서브도메인이 아니라 셸/zone 의 호스트가 보인다. */
export function HostPanel({ host, forwardedHost }: { host: string | null; forwardedHost: string | null }) {
  const own = resolveTenant(forwardedHost ?? host)
  return (
    <div className="space-y-1 rounded border border-amber-300 bg-amber-50 p-3 font-mono text-[11px] leading-relaxed text-amber-950 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100">
      <div>이 페이지가 받은 Host: {host ?? '없음'} · x-forwarded-host: {forwardedHost ?? '없음'}</div>
      <div>첫 라벨 해석: {own.label ?? '없음'} → 테넌트 {own.tenant?.id ?? '없음'}</div>
      <p className="font-sans text-[11px] text-amber-900 dark:text-amber-200">
        브라우저는 Host 헤더를 마음대로 바꿀 수 없고, 셸을 거치면 호스트가 셸 호스트로 보입니다. 그래서 아래 실습은 서버(Server Action)가
        같은 앱의 Route Handler 를 원하는 Host 로 직접 호출해 판별 로직을 확인합니다.
      </p>
    </div>
  )
}
