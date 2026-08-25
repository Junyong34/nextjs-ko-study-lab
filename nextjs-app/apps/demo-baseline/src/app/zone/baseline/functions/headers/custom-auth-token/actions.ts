'use server'

import { headers } from 'next/headers'
import type { AuthHeaderCheckResult } from './types'

export async function validateAuthTokenAction(customToken?: string): Promise<AuthHeaderCheckResult> {
  const reqHeaders = await headers()
  
  // 클라이언트가 전달한 토큰이 있으면 우선 파싱, 없으면 실제 HTTP headers()의 authorization 검사
  const authHeader = customToken !== undefined 
    ? (customToken ? `Bearer ${customToken}` : '') 
    : reqHeaders.get('authorization') || ''

  const extractedList: Array<{ key: string; value: string }> = []
  
  // 일부 공통 서버 헤더 샘플 추출
  for (const key of ['host', 'user-agent', 'accept-language', 'x-forwarded-for']) {
    const val = reqHeaders.get(key)
    if (val) {
      extractedList.push({ key, value: val })
    }
  }

  if (authHeader) {
    extractedList.unshift({ key: 'authorization', value: authHeader })
  }

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      status: 401,
      tokenReceived: authHeader || null,
      error: 'HTTP 401 Unauthorized: Authorization Bearer 헤더가 누락되었거나 형식이 올바르지 않습니다.',
      headersList: extractedList,
      timestamp: new Date().toLocaleTimeString(),
    }
  }

  const token = authHeader.replace('Bearer ', '').trim()

  if (token === 'expired_token') {
    return {
      status: 401,
      tokenReceived: token,
      error: 'HTTP 401 Unauthorized: Bearer 토큰의 유효기간(exp)이 만료되었습니다.',
      headersList: extractedList,
      timestamp: new Date().toLocaleTimeString(),
    }
  }

  if (token === 'forged_token') {
    return {
      status: 401,
      tokenReceived: token,
      error: 'HTTP 401 Unauthorized: HMAC-SHA256 디지털 서명 검증에 실패했습니다.',
      headersList: extractedList,
      timestamp: new Date().toLocaleTimeString(),
    }
  }

  // Valid token
  return {
    status: 200,
    tokenReceived: token.length > 24 ? `${token.slice(0, 20)}...` : token,
    userId: 'user_8921',
    role: 'VIP Member / 결제 승인권자',
    scope: ['read:profile', 'write:orders', 'payment:execute'],
    headersList: extractedList,
    timestamp: new Date().toLocaleTimeString(),
  }
}
