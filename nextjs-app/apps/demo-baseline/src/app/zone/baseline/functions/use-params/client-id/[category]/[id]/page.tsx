import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'
import { ProductParamsPanel } from '../../components/ProductParamsPanel'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; id: string }>
}): Promise<Metadata> {
  const { category, id } = await params
  return getDemoMetadata('baseline', `functions/use-params/client-id/${category}/${id}`)
}

/**
 * 이 Server Component는 category/id를 props로 받아 아래로 내려주지 않는다.
 * ProductParamsPanel이 스스로 useParams()를 호출해 현재 URL의 다이나믹 세그먼트 값을 읽는다 —
 * Props Drilling 없이 라우트 파라미터에 접근하는 실제 사례를 보여주기 위함이다.
 */
export default function ProductDetailPage() {
  return <ProductParamsPanel />
}
