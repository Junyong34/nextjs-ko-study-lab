import { MOCK_COUPONS } from '@study/demo-kit'

export type BranchMode = 'static' | 'no-store'

/**
 * 타임세일 배너가 근거로 삼는 쿠폰 mock — "왜 실시간 참여 인원이 필요한가"라는
 * 서사(마감 임박 타임세일)와 맞물린다.
 */
export const FLASH_SALE_COUPON = MOCK_COUPONS.find((coupon) => coupon.id === 'cp-flash')!

/**
 * 렌더링마다 다시 계산되는 "실시간 참여 인원". 이 무작위성 자체가 공식 문서의
 * Math.random() 예제와 같은 "요청마다 달라져야 하는 값"이다.
 */
export function rollLiveParticipantCount(): number {
  return 120 + Math.floor(Math.random() * 380)
}
