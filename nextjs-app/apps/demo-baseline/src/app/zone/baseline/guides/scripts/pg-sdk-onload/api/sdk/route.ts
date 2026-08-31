import { NextResponse } from 'next/server'

export async function GET() {
  const js = `
window.__pgSdk = {
  ready: true,
  loadedAt: Date.now(),
  open: function() {
    window.__pgSdkLastOpenedAt = Date.now();
    return { orderId: 'PG-' + Math.random().toString(36).slice(2, 8).toUpperCase() };
  }
};
`
  return new NextResponse(js, { headers: { 'Content-Type': 'application/javascript' } })
}
