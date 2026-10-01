import type { HopKind, HopRecord, ProbeRun } from '../types'
import { ARRIVAL_PATH, CACHE_PAGE_PATH, HOP_PATH } from './zone'

/** ok: true=일치, false=불일치, null=이 접근 방식에서는 판정 불가, undefined=아직 측정 전 */
export interface Check {
  id: string
  label: string
  ok: boolean | null | undefined
  detail: string
}

/** 학습자 경로(/demo/...)를 셸이 직접 응답했다면 지금 문서는 셸 origin에서 열린 것이다. */
export function isViaShell(run: ProbeRun | null): boolean | null {
  if (!run) return null
  return run.pages.learner.status === 200 && run.pages.learner.zone === 'shell'
}

const NOT_SHELL = '판정 불가: baseline zone에 직접 접속했습니다. 셸 origin에서 열어야 성립하는 항목입니다.'

export function judgeProbes(run: ProbeRun): Check[] {
  const shell = isViaShell(run)
  const { learner, internal, cache } = run.pages
  const asset = run.asset
  return [
    {
      id: 'learner',
      label: '학습자 URL /demo/...는 셸이 직접 응답',
      ok: shell ? true : null,
      detail: shell ? `${learner.status} · 스크립트 ${learner.firstScript}` : `${NOT_SHELL} (응답 ${learner.status}, zone ${learner.zone})`,
    },
    {
      id: 'internal',
      label: '내부 URL /zone/baseline/...은 baseline zone이 응답',
      ok: internal.status === 200 && internal.zone === 'baseline',
      detail: `${internal.status} · zone ${internal.zone} · x-powered-by ${internal.poweredBy ?? '없음'}`,
    },
    {
      id: 'cache',
      label: '같은 origin의 /zone/cache/...는 cache zone이 응답',
      ok: shell ? cache.status === 200 && cache.zone === 'cache' : null,
      detail: shell
        ? `${cache.status} · zone ${cache.zone} · x-powered-by ${cache.poweredBy ?? '없음'}`
        : `${NOT_SHELL} (응답 ${cache.status}, zone ${cache.zone})`,
    },
    {
      id: 'asset',
      label: 'cache zone 자산 /demo-static/cache/_next/...도 같은 origin에서 200',
      ok: shell ? asset !== null && asset.status === 200 && (asset.contentType ?? '').includes('javascript') : null,
      detail: shell ? (asset ? `${asset.status} · ${asset.contentType}` : 'cache 응답에서 자산 경로를 찾지 못함') : NOT_SHELL,
    },
    {
      id: 'own-assets',
      label: '이 페이지의 스크립트는 /demo-static/baseline/에서 로드',
      ok: run.ownAssets.baseline > 0,
      detail: `baseline 접두사 ${run.ownAssets.baseline}개 · 그 밖 ${run.ownAssets.other}개 (performance resource)`,
    },
  ]
}

const HOP_LABEL: Record<HopKind, string> = {
  'link-same': '<Link> 같은 zone → soft navigation (문서 유지)',
  'a-same': '<a> 같은 zone → 전체 문서 로드',
  'link-cross': '<Link> cache zone → soft navigation으로 경계를 넘지 못함',
  'a-cross': '<a> cache zone → 전체 문서 로드로 cache zone 도착',
}

export const HOP_ORDER: HopKind[] = ['link-same', 'a-same', 'link-cross', 'a-cross']

function describe(h: HopRecord) {
  const how = h.newDocument ? `새 문서(${h.navType ?? '?'})` : h.path === HOP_PATH ? '이동 안 됨(문서·주소 그대로)' : 'soft navigation(문서 유지)'
  return `${how} · ${h.path} · zone ${h.zone}`
}

export function judgeHop(kind: HopKind, h: HopRecord | undefined, shell: boolean | null): Check {
  const base = { id: kind, label: HOP_LABEL[kind] }
  if (!h) return { ...base, ok: undefined, detail: '아직 누르지 않았습니다.' }
  const cross = kind === 'link-cross' || kind === 'a-cross'
  if (cross && shell !== true) return { ...base, ok: null, detail: `${shell === null ? '먼저 [같은 origin 응답 측정]을 실행하세요. ' : ''}${NOT_SHELL} · ${describe(h)}` }
  let ok: boolean
  if (kind === 'link-same') ok = !h.newDocument && h.path === ARRIVAL_PATH && h.screen === 'arrival'
  else if (kind === 'a-same') ok = h.newDocument && h.path === ARRIVAL_PATH
  else if (kind === 'a-cross') ok = h.newDocument && h.path === CACHE_PAGE_PATH && h.zone === 'cache'
  // 같은 문서를 유지한 채 주소가 cache zone 경로로 바뀌면 soft navigation이 경계를 넘은 것이다(그러면 불일치).
  // 멈추거나 전체 로드로 대체되면 soft navigation으로는 넘지 못한 것이다.
  else ok = h.newDocument || h.path !== CACHE_PAGE_PATH
  return { ...base, ok, detail: describe(h) }
}
