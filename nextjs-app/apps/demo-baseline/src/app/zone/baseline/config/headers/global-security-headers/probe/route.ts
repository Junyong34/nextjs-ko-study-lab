import { NextResponse } from 'next/server'

// 헤더 측정 대상 Route Handler. 본문은 의미가 없고, 이 응답에 next.config의 headers()가 붙는지 본다.
export async function GET() {
  return NextResponse.json({ probe: 'global-security-headers', at: new Date().toISOString() })
}
