import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const strategy = request.nextUrl.searchParams.get('s') || 'unknown'
  const js = `
window.__scriptLoads = window.__scriptLoads || [];
window.__scriptLoads.push({ strategy: ${JSON.stringify(strategy)}, at: Date.now() });
`
  return new NextResponse(js, {
    headers: { 'Content-Type': 'application/javascript' },
  })
}
