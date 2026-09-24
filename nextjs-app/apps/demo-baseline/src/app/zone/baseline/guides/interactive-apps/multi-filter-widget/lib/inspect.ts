import type { CheckResult, NavEntry, ReloadObservation } from '../types'
import { showSearch } from './filters'

/** 관측 기록(NavEntry[])과 새로고침 전후 기록만으로 판정한다. 기대값을 하드코딩한 비교는 없다. */
export function evaluate(entries: NavEntry[], reload: ReloadObservation | null): CheckResult[] {
  const first = entries[0]

  // 1. URL → 서버: 도착한 모든 렌더에서 서버가 받은 searchParams가 그 시점 브라우저 URL과 같다
  const mismatch = entries.find((e) => e.urlSearch !== e.serverSearch)
  const urlToServer: CheckResult = {
    label: 'URL = 서버가 받은 searchParams',
    observed: entries.length > 0,
    ok: entries.length > 0 && !mismatch,
    detail: mismatch
      ? `#${mismatch.seq}: URL ${showSearch(mismatch.urlSearch)} ≠ 서버 ${showSearch(mismatch.serverSearch)}`
      : `기록 ${entries.length}건 모두 일치`,
  }

  // 2. 필터 이동 → 서버 재렌더: push 이후 처음 보는 renderId가 도착
  const pushes = entries.filter((e) => e.kind === 'push')
  const stalePush = pushes.find((e) => e.reusedRender)
  const pushRerender: CheckResult = {
    label: '필터 클릭 → 서버가 새로 렌더링',
    observed: pushes.length > 0,
    ok: pushes.length > 0 && !stalePush,
    detail: pushes.length
      ? `push ${pushes.length}건, 새 renderId ${pushes.filter((e) => !e.reusedRender).length}건, 평균 ${Math.round(
          pushes.reduce((s, e) => s + (e.ms ?? 0), 0) / pushes.length,
        )}ms`
      : '필터 칩을 클릭하세요',
  }

  // 3. 뒤로가기 → 이전 필터 복원: popstate 후 URL이 직전과 다르고, 더 이전에 본 쿼리와 같으며, 서버 결과도 그 쿼리 기준
  const restored = entries.find(
    (e, i) =>
      e.kind === 'popstate' &&
      i > 0 &&
      e.urlSearch !== entries[i - 1].urlSearch &&
      entries.slice(0, i - 1).some((p) => p.urlSearch === e.urlSearch) &&
      e.urlSearch === e.serverSearch,
  )
  const pops = entries.filter((e) => e.kind === 'popstate')
  const backRestore: CheckResult = {
    label: '뒤로가기 → 이전 필터·목록 복원',
    observed: Boolean(restored),
    ok: Boolean(restored),
    detail: restored
      ? `#${restored.seq}: ${showSearch(restored.urlSearch)} 복원, 결과 ${restored.count}개, renderId ${restored.renderId} ${
          restored.reusedRender ? '(이전 렌더 재사용 — 서버 재요청 없음)' : '(서버에서 새로 렌더링)'
        }, ${restored.ms}ms`
      : pops.length
        ? `popstate ${pops.length}건 기록 — 필터를 두 번 이상 바꾼 뒤 뒤로가기를 눌러야 판정됩니다`
        : '필터를 바꾼 뒤 [뒤로가기]를 클릭하세요',
  }

  // 4. 이동 중 장바구니 유지: 장바구니가 있을 때 이동해도 수량·인스턴스 ID가 그대로
  const cartNavs = entries.filter((e) => e.cartBefore !== null && e.cartBefore > 0)
  const cartLost = cartNavs.find((e) => e.cartAfter !== e.cartBefore || (first && e.mountId !== first.mountId))
  const cartKept: CheckResult = {
    label: '필터 이동·뒤로가기 중 장바구니 유지',
    observed: cartNavs.length > 0,
    ok: cartNavs.length > 0 && !cartLost,
    detail: cartLost
      ? `#${cartLost.seq}: ${cartLost.cartBefore}개 → ${cartLost.cartAfter}개 (인스턴스 ${cartLost.mountId})`
      : cartNavs.length
        ? `장바구니가 있는 이동 ${cartNavs.length}건 모두 수량 유지, 인스턴스 ${first?.mountId} 그대로`
        : '장바구니에 담은 뒤 필터를 바꾸세요',
  }

  // 5. 새로고침: URL 필터는 유지, 장바구니는 초기화
  const reloadReady = Boolean(reload && reload.before.search && reload.before.cartCount > 0)
  const reloadOk =
    reloadReady &&
    reload!.after.search === reload!.before.search &&
    (!first || first.serverSearch === reload!.after.search) &&
    reload!.after.cartCount === 0 &&
    reload!.after.mountId !== reload!.before.mountId
  const reloadCheck: CheckResult = {
    label: '새로고침 → 필터 유지 / 장바구니 초기화',
    observed: reloadReady,
    ok: reloadOk,
    detail: reload
      ? `전 ${showSearch(reload.before.search)} · 장바구니 ${reload.before.cartCount}개 · 인스턴스 ${reload.before.mountId}  →  후 ${showSearch(
          reload.after.search,
        )} · 장바구니 ${reload.after.cartCount}개 · 인스턴스 ${reload.after.mountId}${
          reloadReady ? '' : ' (필터와 장바구니가 모두 있는 상태에서 새로고침해야 판정됩니다)'
        }`
      : '필터를 건 상태로 장바구니를 채우고 [새로고침]을 클릭하세요',
  }

  return [
    ...mergeChecks([urlToServer, pushRerender, backRestore, cartKept], reload?.before.priorChecks),
    reloadCheck,
  ]
}

/** 현재 문서의 판정과 새로고침 전 문서의 판정을 합친다. 한쪽이라도 실패가 관측되면 실패. */
export function mergeChecks(current: CheckResult[], prior: CheckResult[] | undefined): CheckResult[] {
  if (!prior) return current
  return current.map((c, i) => {
    const p = prior[i]
    if (!p?.observed) return c
    if (!c.observed) return { ...p, detail: `(새로고침 전 문서) ${p.detail}` }
    return { ...c, ok: c.ok && p.ok, detail: `${c.detail} / 새로고침 전: ${p.detail}` }
  })
}
