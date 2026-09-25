// 브라우저와 Edge Runtime이 "글자 하나 다르지 않은" 같은 코드로 호출하는 헬퍼.
// Web 표준 전역(TextEncoder, crypto.subtle, btoa)만 쓴다. node:* / npm 패키지 import 금지 —
// edge 세그먼트의 번들에 Node 모듈 참조가 섞이면 Vercel Edge Function 배포가 거부된다.

export function utf8Bytes(input: string): Uint8Array<ArrayBuffer> {
  return new TextEncoder().encode(input)
}

export async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', utf8Bytes(input))
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('')
}

/** btoa는 Latin-1 문자열만 받으므로 UTF-8 바이트를 이진 문자열로 바꾼 뒤 인코딩한다. */
export function base64FromUtf8(input: string): string {
  let binary = ''
  for (const byte of utf8Bytes(input)) binary += String.fromCharCode(byte)
  return btoa(binary)
}

export function utf8FromBase64(encoded: string): string {
  const bytes = Uint8Array.from(atob(encoded), (c) => c.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

/** 입력을 코드 포인트 기준으로 n조각으로 나눈다(한글·이모지가 잘리지 않도록). */
export function splitCodePoints(input: string, n: number): string[] {
  const chars = Array.from(input)
  const size = Math.ceil(chars.length / n)
  return Array.from({ length: n }, (_, i) => chars.slice(i * size, (i + 1) * size).join(''))
}

export const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
