/** 이 데모의 목록 경로. zone 안 절대 경로이며 학습자 URL이 아니다. */
export const BASE_PATH = '/zone/baseline/file-conventions/intercepting-routes/product-detail'

/** 상세 조회에 거는 학습용 지연(ms). 실제 서버·DB 응답이 느린 상황을 눈으로 보이게 만든다. */
export const DETAIL_DELAY_MS = 2000

/** 이 비율 이상이면 "지연이 실제로 관측됐다"고 판정한다(네트워크·타이머 오차 허용). */
export const DELAY_TOLERANCE = 0.8

/** 목록에 요약이 없는 상품 — 링크로만 열 수 있어 "요약 없음" 경로를 보여 준다. */
export const NO_SEED_ID = '204'
