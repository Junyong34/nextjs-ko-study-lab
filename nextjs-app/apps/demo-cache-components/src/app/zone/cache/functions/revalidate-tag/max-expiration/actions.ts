'use server'

import { revalidateTag } from 'next/cache'
import type { NoticeReviseResult } from './types'
import { TAGS } from './tags'
import { revisePromoNotice, reviseRecallNotice } from './noticeStore'

let promoVersion = 1
let recallVersion = 1

export async function revisePromoBannerAction(): Promise<NoticeReviseResult> {
  promoVersion += 1
  const time = new Date().toLocaleTimeString()
  const entry = revisePromoNotice(time)

  // profile='max' (권장값): 태그를 stale로만 표시한다. 다음 방문은 여전히 이전 값을 서빙하며
  // 백그라운드에서 새 값을 준비하고, 그 다음 방문에서야 새 값이 보인다(stale-while-revalidate).
  revalidateTag(TAGS.promo, 'max')

  return {
    tag: TAGS.promo,
    profile: 'max',
    versionId: `v${promoVersion}`,
    entry,
    timestamp: time,
  }
}

export async function reviseRecallNoticeAction(): Promise<NoticeReviseResult> {
  recallVersion += 1
  const time = new Date().toLocaleTimeString()
  const entry = reviseRecallNotice(time)

  // profile={ expire: 0 }: 태그를 즉시 만료시킨다. 다음 요청은 블로킹 재검증(cache miss)이 되어
  // stale 값을 거치지 않고 바로 새 값을 반환한다 — 웹훅/외부 시스템이 즉시 반영을 요구할 때 쓰는 패턴이다.
  revalidateTag(TAGS.recall, { expire: 0 })

  return {
    tag: TAGS.recall,
    profile: '{ expire: 0 }',
    versionId: `v${recallVersion}`,
    entry,
    timestamp: time,
  }
}
