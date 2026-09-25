import { CAMPAIGN_PATH, CORE_DELAY_MS } from '../types'
import type { ProbeStore } from '../types'
import { requestCount, runsOf } from './useProbeStore'

export interface CheckResult {
  label: string
  /** undefined = 아직 측정 중 */
  ok: boolean | undefined
  detail: string
}

const ms = (n: number) => `${n.toFixed(1)}ms`

/** 스토어의 실측값만으로 4가지 가이드 주장을 판정한다. 기대 순서를 하드코딩해 결과를 만들지 않는다. */
export function evaluateChecks(store: ProbeStore | null): CheckResult[] {
  const core = runsOf(store, 'core-sdk')[0]
  const plugin = runsOf(store, 'core-plugin')[0]
  const chained = runsOf(store, 'core-plugin-chained')[0]
  const chat = runsOf(store, 'chat-widget')[0]
  const layout = runsOf(store, 'layout-analytics')
  const hydratedAt = store?.hydratedAt ?? null
  const loadAt = store?.loadAt ?? null

  const order: CheckResult =
    core && plugin && chained
      ? {
          label: '선언 순서 ≠ 실행 순서, onReady 체인으로 의존 순서 보장',
          ok: plugin.at < core.at && !plugin.coreReady && chained.at > core.at && chained.coreReady,
          detail: `core-plugin ${ms(plugin.at)}(코어 ${plugin.coreReady ? '있음' : '없음'}) · core-sdk ${ms(core.at)} · chained ${ms(chained.at)}(코어 ${chained.coreReady ? '있음' : '없음'})`,
        }
      : { label: '선언 순서 ≠ 실행 순서', ok: undefined, detail: 'core-sdk / core-plugin / chained 실행 대기' }

  const afterRuns = [core, plugin, layout[0]]
  const timing: CheckResult =
    hydratedAt !== null && loadAt !== null && chat && afterRuns.every(Boolean)
      ? {
          label: 'afterInteractive는 하이드레이션 이후, lazyOnload는 load 이벤트 이후',
          ok: afterRuns.every((r) => r!.at > hydratedAt) && chat.at > loadAt,
          detail: `hydration ${ms(hydratedAt)} · 가장 이른 afterInteractive ${ms(Math.min(...afterRuns.map((r) => r!.at)))} · load ${ms(loadAt)} · chat-widget ${ms(chat.at)}`,
        }
      : { label: 'afterInteractive / lazyOnload 시점', ok: undefined, detail: '하이드레이션·load·스크립트 실행 대기' }

  const visits = store?.visits ?? []
  const visitedCampaign = visits.some((v) => v.path.startsWith(CAMPAIGN_PATH))
  const campaign = runsOf(store, 'campaign-pixel')
  const campaignRequests = store ? requestCount('campaign-pixel') : 0
  const scope: CheckResult =
    store && layout.length > 0 && core
      ? {
          label: '레이아웃 스크립트는 하위 라우트 전체에 1회, 세그먼트 전용 스크립트는 그 라우트에서만',
          ok:
            layout.length === 1 &&
            runsOf(store, 'core-sdk').length === 1 &&
            (visitedCampaign ? campaign.length === 1 && campaign[0].path.startsWith(CAMPAIGN_PATH) : campaign.length === 0 && campaignRequests === 0),
          detail: `라우트 이동 ${Math.max(visits.length - 1, 0)}회 · layout-analytics ${layout.length}회 · core-sdk(page) ${runsOf(store, 'core-sdk').length}회 · campaign-pixel ${campaign.length}회/요청 ${campaignRequests}건${visitedCampaign ? '' : ' (campaign 미방문)'} · core-sdk 요청 ${requestCount('core-sdk', CORE_DELAY_MS)}건`,
        }
      : { label: '라우트 단위 로드 범위', ok: undefined, detail: '레이아웃·페이지 스크립트 실행 대기' }

  const mounts = store?.slotMounts ?? 0
  const shared = runsOf(store, 'shared-widget').length
  const withId = runsOf(store, 'inline-with-id').length
  const noId = runsOf(store, 'inline-no-id').length
  const dedupe: CheckResult =
    mounts > 0 && shared > 0 && withId > 0
      ? {
          label: 'id가 있으면 여러 번 선언·마운트해도 1회 실행, 인라인에 id가 없으면 마운트마다 재실행',
          ok: shared === 1 && withId === 1 && noId === mounts && requestCount('shared-widget') === 1,
          detail: `슬롯 마운트 ${mounts}회 → shared-widget ${shared}회(요청 ${requestCount('shared-widget')}건) · inline-with-id ${withId}회 · inline-no-id ${noId}회`,
        }
      : { label: 'id 기반 중복 로드 방지', ok: undefined, detail: '위젯 슬롯 마운트 대기' }

  return [order, timing, scope, dedupe]
}
