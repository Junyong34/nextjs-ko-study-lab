import type { DeviceType } from './types'

export const MOBILE_UA_PATTERN = /Mobile|Android|iPhone|iPad/i

/**
 * headers()로 읽은 User-Agent 원문을 그대로 받아 기기 타입을 판별한다.
 * 이 함수 자체는 헤더를 읽지 않는다 — page.tsx가 읽은 값을 그대로 전달받는다.
 */
export function detectDeviceType(userAgent: string): DeviceType {
  return MOBILE_UA_PATTERN.test(userAgent) ? 'mobile' : 'desktop'
}
