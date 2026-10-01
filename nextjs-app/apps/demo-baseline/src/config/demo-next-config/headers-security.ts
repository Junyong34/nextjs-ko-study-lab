import type { DemoConfigPart } from './types'

// 이 모듈은 단일 데모가 소유한다. source/경로는 반드시 해당 데모 경로로 한정한다.
// config/headers/global-security-headers 데모의 실제 검증 대상 (headers() 보안 응답 헤더).
// 제목은 "전역"이지만 이 저장소의 CSP nonce 데모·셸 iframe 임베딩을 깨지 않도록 source를 데모 경로로 좁혔다.
// 실제 전역 적용은 source를 '/(.*)' 로 바꾸면 된다(데모 화면의 개념 정리 참고).
export const HEADERS_SCOPE_SOURCE = '/zone/baseline/config/headers/global-security-headers/:path*'

// X-Frame-Options와 CSP frame-ancestors는 일부러 넣지 않는다: 셸이 이 페이지를 iframe으로 임베딩한다.
// CSP는 script-src 없이 object-src·base-uri만 제한한다: dev 서버의 인라인 스크립트가 막히지 않는다.
// HSTS max-age는 데모용으로 짧게(300초) 둔다. 운영 값은 공식 문서의 63072000(2년)이다.
export const SECURITY_HEADERS = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=300' },
  { key: 'Content-Security-Policy', value: "object-src 'none'; base-uri 'self'" },
]

export const demoConfig: DemoConfigPart = {
  headers: [{ source: HEADERS_SCOPE_SOURCE, headers: SECURITY_HEADERS }],
}
