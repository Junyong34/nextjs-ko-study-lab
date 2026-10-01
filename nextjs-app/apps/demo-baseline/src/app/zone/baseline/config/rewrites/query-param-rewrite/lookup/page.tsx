import { flatten, ProbeView } from '../lib/probe'

// 경로 세그먼트 대신 쿼리로 값을 받는 목적지. legacy/:category/:sku rewrite가 이 페이지로 보낸다.
export default async function LookupPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const sp = await searchParams
  return <ProbeView probe={{ destination: 'lookup', params: {}, searchParams: flatten(sp), renderedAt: new Date().toISOString() }} />
}
