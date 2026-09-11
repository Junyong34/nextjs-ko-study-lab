import { notFound } from 'next/navigation'
import { MOCK_PRODUCTS } from '@study/demo-kit'
import { PREBUILT_CATEGORIES } from '../../constants'

interface CategoryLayoutProps {
  children: React.ReactNode
  params: Promise<{ category: string }>
}

// 부모([category]) 세그먼트의 generateStaticParams — 이 배열의 카테고리만 next build
// 시점에 [category] 라우트 트리를 미리 순회한다. 나머지 실제 카테고리(예: living)는
// dynamicParams 기본값(true)에 따라 첫 요청 시 온디맨드로 이 레이아웃까지 도달한다.
export async function generateStaticParams() {
  return PREBUILT_CATEGORIES.map((category) => ({ category }))
}

export default async function CategoryLayout({ children, params }: CategoryLayoutProps) {
  const { category } = await params
  const categoryExists = MOCK_PRODUCTS.some((product) => product.category === category)

  // dynamicParams=true는 "이 레이아웃까지 요청을 통과시킨다"는 뜻이지 "그 카테고리가
  // 실제로 존재한다"는 뜻은 아니다 — 실존하지 않는 카테고리는 여기서 진짜 404로 막는다.
  if (!categoryExists) {
    notFound()
  }

  return <>{children}</>
}
