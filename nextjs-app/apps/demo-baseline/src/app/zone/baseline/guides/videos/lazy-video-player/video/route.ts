import { NextRequest, NextResponse } from 'next/server'
import { recordRequest } from '../lib/requestLog'
import { SAMPLE_MP4_BASE64 } from '../lib/sampleVideo'

export const dynamic = 'force-dynamic'

const VIDEO = Buffer.from(SAMPLE_MP4_BASE64, 'base64')

/**
 * 실제 H.264 mp4 바이너리 응답. <video>는 재생 전에 Range 요청(`bytes=0-` 등)을 보내므로
 * 206 Partial Content / Content-Range / Accept-Ranges를 직접 처리한다.
 * ?run= 값으로 요청을 구분해 서버 메모리에 기록하고, log Route Handler가 이를 되돌려 준다.
 */
export async function GET(request: NextRequest) {
  const run = request.nextUrl.searchParams.get('run') ?? 'none'
  const size = VIDEO.length
  const rangeHeader = request.headers.get('range')
  const baseHeaders = { 'Content-Type': 'video/mp4', 'Accept-Ranges': 'bytes', 'Cache-Control': 'no-store' }

  let start = 0
  let end = size - 1
  let status = 200

  if (rangeHeader) {
    const match = /^bytes=(\d*)-(\d*)$/.exec(rangeHeader.trim())
    const suffix = match && match[1] === '' && match[2] !== ''
    if (match) {
      start = suffix ? Math.max(size - Number(match[2]), 0) : Number(match[1])
      end = suffix || match[2] === '' ? size - 1 : Math.min(Number(match[2]), size - 1)
    }
    if (!match || start > end || start >= size) {
      recordRequest(run, { at: Date.now(), range: rangeHeader, status: 416, bytes: 0 })
      return new NextResponse(null, { status: 416, headers: { ...baseHeaders, 'Content-Range': `bytes */${size}` } })
    }
    status = 206
  }

  const body = VIDEO.subarray(start, end + 1)
  recordRequest(run, { at: Date.now(), range: rangeHeader, status, bytes: body.length })
  return new NextResponse(new Uint8Array(body), {
    status,
    headers: {
      ...baseHeaders,
      'Content-Length': String(body.length),
      ...(status === 206 ? { 'Content-Range': `bytes ${start}-${end}/${size}` } : {}),
    },
  })
}
