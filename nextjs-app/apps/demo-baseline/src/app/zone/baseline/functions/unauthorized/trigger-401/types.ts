export type SessionState = 'anonymous' | 'authenticated'

export const SESSION_COOKIE_NAME = 'unauthorized_demo_session'

export const TRIGGER_401_BASE_PATH = '/zone/baseline/functions/unauthorized/trigger-401'
export const MYPAGE_ORDERS_PATH = `${TRIGGER_401_BASE_PATH}/mypage/orders`
