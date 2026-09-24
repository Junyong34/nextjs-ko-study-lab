import { NextResponse } from 'next/server'
import { readProbe, resetProbe } from '../../lib/probe-store'

/** 서버 카운터 조회. 실습 화면과 curl 모두 이 값을 읽어 notFound() 이후 코드 실행 여부를 확인한다. */
export async function GET() {
  return NextResponse.json(readProbe(), { headers: { 'cache-control': 'no-store' } })
}

/** 카운터 초기화 */
export async function DELETE() {
  resetProbe()
  return NextResponse.json(readProbe(), { headers: { 'cache-control': 'no-store' } })
}
