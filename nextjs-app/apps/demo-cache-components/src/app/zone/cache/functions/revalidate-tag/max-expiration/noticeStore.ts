import type { NoticeEntry } from './types'

export let promoNotice: NoticeEntry = {
  id: 'PROMO-BANNER',
  headline: '시즌 프로모션: 전 상품 10% 할인',
  revision: 1,
  updatedAt: '초기 로드',
}

export let recallNotice: NoticeEntry = {
  id: 'RECALL-NOTICE',
  headline: '안전 공지: 이상 없음 (정상 운영 중)',
  revision: 1,
  updatedAt: '초기 로드',
}

export function revisePromoNotice(time: string): NoticeEntry {
  const nextRevision = promoNotice.revision + 1
  promoNotice = {
    ...promoNotice,
    headline: `시즌 프로모션: 전 상품 ${10 + nextRevision * 5}% 할인`,
    revision: nextRevision,
    updatedAt: time,
  }
  return promoNotice
}

export function reviseRecallNotice(time: string): NoticeEntry {
  const nextRevision = recallNotice.revision + 1
  recallNotice = {
    ...recallNotice,
    headline: `긴급 리콜 공지 v${nextRevision}: 배터리 이상 모델 즉시 사용 중단 요청`,
    revision: nextRevision,
    updatedAt: time,
  }
  return recallNotice
}
