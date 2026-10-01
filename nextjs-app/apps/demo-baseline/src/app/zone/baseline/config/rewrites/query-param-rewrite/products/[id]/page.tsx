import { flatten, ProbeView } from '../../lib/probe'

// rewrite 목적지이자 직접 접근도 가능한 평범한 동적 페이지다. rewrite 여부를 스스로 알 수 없고, 받은 값만 렌더한다.
export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const { id } = await params
  const sp = await searchParams
  return (
    <ProbeView
      probe={{ destination: 'products/[id]', params: { id }, searchParams: flatten(sp), renderedAt: new Date().toISOString() }}
    />
  )
}
