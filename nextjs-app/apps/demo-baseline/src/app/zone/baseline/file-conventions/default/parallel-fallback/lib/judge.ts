import type { Check, Probe, Snapshot } from '../types'

const fmt = (s: Record<string, string | undefined>) =>
  Object.entries(s).map(([k, v]) => `${k}=${v}`).join(', ') || '(없음)'

export function judge(load: Snapshot | null, soft: Snapshot | null, probes: Record<string, Probe>): Check[] {
  const softChecked = soft && (soft.path === '/shoes' || soft.path === '/settings') ? soft : null
  const previousPromo = softChecked?.previousScreens?.promo
  const hardShoes = probes['/shoes']
  const loadShoes = load && load.path === '/shoes' ? load : null
  const strict = probes['/strict/detail']

  const softCheck: Check = {
    id: 'soft',
    label: '소프트 내비게이션',
    expected: '<Link> 이동 뒤 @promo는 매칭 페이지가 없어도 이동 직전 화면을 유지',
    state: !softChecked || previousPromo === undefined ? 'wait' : softChecked.screens.promo === previousPromo ? 'pass' : 'fail',
    actual: !softChecked
      ? '대기 중: /shoes 또는 /settings로 <Link> 이동'
      : `${softChecked.path} 이동 전 @promo=${previousPromo ?? '(측정 없음)'}, 이동 후 DOM 측정: ${fmt(softChecked.screens)}`,
  }

  const hardFails =
    (hardShoes && !(hardShoes.status === 200 && hardShoes.screens.promo === 'default' && hardShoes.screens.cart === 'shoes')) ||
    (loadShoes && loadShoes.screens.promo !== 'default')
  const hardCheck: Check = {
    id: 'hard',
    label: '하드 로드',
    expected: '/shoes를 새로 로드하면 @promo 자리에 default.tsx가 렌더링(200)되고 @cart는 shoes 화면',
    state: !hardShoes && !loadShoes ? 'wait' : hardFails ? 'fail' : 'pass',
    actual: [
      hardShoes ? `문서 GET /shoes → ${hardShoes.status}, ${fmt(hardShoes.screens)}` : null,
      loadShoes ? `실제 새로고침 후 DOM 측정: ${fmt(loadShoes.screens)}` : null,
    ].filter(Boolean).join(' / ') || '대기 중: [하드 로드 프로브] 또는 /shoes에서 새로고침',
  }

  const strictCheck: Check = {
    id: 'strict',
    label: 'notFound() 폴백',
    expected: 'default.tsx가 notFound()를 호출하는 슬롯이 매칭되지 않으면 문서 응답이 404',
    state: !strict ? 'wait' : strict.status === 404 ? 'pass' : 'fail',
    actual: strict ? `문서 GET /strict/detail → ${strict.status}` : '대기 중: [하드 로드 프로브] 실행',
  }
  return [softCheck, hardCheck, strictCheck]
}
