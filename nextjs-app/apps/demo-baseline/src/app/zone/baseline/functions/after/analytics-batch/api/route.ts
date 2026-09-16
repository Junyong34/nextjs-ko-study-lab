import { NextRequest, NextResponse } from 'next/server'
import { getBatchStatus } from '../lib/batch-store'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const batchId = request.nextUrl.searchParams.get('batchId')
  if (!batchId) {
    return NextResponse.json({ error: 'batchId is required' }, { status: 400 })
  }

  const status = getBatchStatus(batchId)
  if (!status) {
    return NextResponse.json({ error: 'batch not found' }, { status: 404 })
  }

  return NextResponse.json(status)
}
