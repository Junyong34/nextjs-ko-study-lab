/** 학습자 URL이 아니라 이 zone 내부 경로다. 측정 fetch와 쿠키 path가 같은 접두사를 쓴다. */
export const DEMO_PATH = '/zone/cache/functions/cookies/suspense-boundary'

/** 모든 zone이 같은 오리진이므로 데모 접두사를 붙인다 (docs/05) */
export const COOKIE_NAME = 'demo_cache_suspense_boundary_user'
export const COOKIE_VALUE = 'kim-shopping'

/** 쿠키를 읽은 뒤 일부러 기다리는 시간 — 셸과 쿠키 영역의 도착 시각 차이를 구분하기 위한 값 */
export const READ_DELAY_MS = 1200
