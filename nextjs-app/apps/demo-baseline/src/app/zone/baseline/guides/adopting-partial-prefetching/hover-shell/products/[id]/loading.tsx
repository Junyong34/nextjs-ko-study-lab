import { ProductSkeleton } from '../../components/ProductSkeleton'

// 레거시 prefetch(`auto`)는 동적 라우트에서 가장 가까운 loading 경계까지만 미리 가져온다.
export default function Loading() {
  return <ProductSkeleton label="loading.tsx 경계" />
}
