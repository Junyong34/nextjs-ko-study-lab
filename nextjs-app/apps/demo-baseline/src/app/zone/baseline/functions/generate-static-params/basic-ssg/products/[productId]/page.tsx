import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getDemoMetadata } from '@study/demos'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { MOCK_PRODUCTS } from '@study/demo-kit'
import { VerificationFooter } from '../../components/VerificationFooter'
import { BASE_PATH, POPULAR_PRODUCT_IDS } from '../../constants'

interface ProductDetailPageProps {
  params: Promise<{ productId: string }>
}

// [productId] 세그먼트는 dynamicParams=true(기본값) 이므로 목록 밖 productId도
// 이 함수까지 실제로 도달한다 — generateMetadata에서 실제 조회 결과로 메타데이터를 만든다.
export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { productId } = await params
  return getDemoMetadata('baseline', `functions/generate-static-params/basic-ssg/products/${productId}`)
}

// 빌드 타임에 이 배열의 productId만큼만 정적 HTML이 생성된다 (SSG).
// 목록에 없는 productId는 dynamicParams 기본값(true)에 따라 요청 시점에 온디맨드로 렌더링된다.
export async function generateStaticParams() {
  return POPULAR_PRODUCT_IDS.map((productId) => ({ productId }))
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { productId } = await params
  const product = MOCK_PRODUCTS.find((item) => item.id === productId)

  // dynamicParams=true는 "요청을 이 함수까지 통과시킨다"는 뜻이지 "데이터가 존재한다"는
  // 뜻은 아니다 — 실제로 존재하지 않는 productId는 여전히 진짜 Next.js 404로 처리한다.
  if (!product) {
    notFound()
  }

  const isPrebuilt = POPULAR_PRODUCT_IDS.includes(productId)

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={`generateStaticParams 결과: /products/${productId}`}
        concept={
          isPrebuilt
            ? `"${product.name}"은 BEST 상품이라 generateStaticParams()가 반환한 목록에 포함되어 next build 시점에 이미 정적 HTML로 생성되어 있습니다.`
            : `"${product.name}"은 BEST 상품이 아니라 generateStaticParams() 목록에 없습니다. dynamicParams 기본값(true)에 따라 지금 이 요청에서 온디맨드로 렌더링됩니다.`
        }
        steps={[
          {
            step: 1,
            title: 'params.productId 확인',
            description: `URL 세그먼트 "${productId}"가 params Promise로 전달되어 상품 데이터베이스 조회에 쓰였습니다.`,
            actionBadge: `productId: ${productId}`,
          },
          {
            step: 2,
            title: '사전 SSG 여부 판정 결과 확인',
            description: 'generateStaticParams() 반환 배열에 이 productId가 포함되는지로 사전 SSG 여부가 결정됩니다.',
            actionBadge: isPrebuilt ? '사전 SSG 빌드됨' : '온디맨드 생성됨',
            observe: 'BEST 뱃지 상품(사전 SSG)과 일반 상품(온디맨드)의 판정 결과 차이',
            observeAt: 'verification',
          },
          {
            step: 3,
            title: '[← 상품 목록으로 복귀] 클릭 후 다른 분류의 상품 선택',
            description: 'BEST 상품과 일반 상품을 번갈아 방문하며 같은 [productId] 템플릿이 재사용되는지 확인합니다.',
            actionBadge: '목록 복귀',
          },
        ]}
      />

      <DemoPlaygroundCard title={`상품 상세 (URL: .../products/${productId})`}>
        <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 dark:border-zinc-800">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-zinc-900 dark:text-zinc-100">{product.name}</h4>
                <span
                  className={`rounded px-2 py-0.5 text-[11px] font-mono font-semibold ${
                    isPrebuilt
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}
                >
                  {isPrebuilt ? 'SSG 사전 빌드' : '온디맨드 생성'}
                </span>
              </div>
              <p className="text-xs text-zinc-500">
                {product.categoryName} • 파라미터: <code className="font-mono text-blue-600">{productId}</code>
              </p>
            </div>
            <Link
              href={BASE_PATH}
              className="rounded bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300"
            >
              ← 상품 목록으로 복귀
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50 space-y-3">
              <div className="text-xs font-bold text-zinc-700 dark:text-zinc-300">상품 기본 정보</div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">{product.description}</p>
              <div className="flex justify-between items-center border-t border-zinc-200 pt-2 dark:border-zinc-800">
                <span className="text-xs text-zinc-500">판매 가격 / 재고:</span>
                <div className="text-right">
                  <span className="text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                    {product.price.toLocaleString()}원
                  </span>
                  <span className="text-xs text-zinc-500 ml-1.5">({product.stock}개 남음)</span>
                </div>
              </div>
            </div>

            <div className="rounded border border-zinc-200 bg-zinc-950 p-4 font-mono text-xs text-zinc-300 dark:border-zinc-800 space-y-2">
              <div className="font-bold text-zinc-400 border-b border-zinc-800 pb-1">
                generateStaticParams() 반환 목록 (빌드 타임 계산됨):
              </div>
              <pre className="text-[11px] text-emerald-400 bg-zinc-900 p-2 rounded overflow-x-auto">
                {JSON.stringify(POPULAR_PRODUCT_IDS, null, 2)}
              </pre>
              <div className="pt-2 text-[11px] text-zinc-400 font-sans">다른 상품으로 이동:</div>
              <div className="flex flex-wrap gap-1.5 font-mono text-[10px]">
                {MOCK_PRODUCTS.map((item) => (
                  <Link
                    key={item.id}
                    href={`${BASE_PATH}/products/${item.id}`}
                    className={`rounded px-2 py-1 ${
                      item.id === productId
                        ? 'bg-blue-600 text-white font-bold'
                        : POPULAR_PRODUCT_IDS.includes(item.id)
                        ? 'bg-emerald-900 text-emerald-300 hover:bg-emerald-800'
                        : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                    }`}
                  >
                    {item.id}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DemoPlaygroundCard>

      <VerificationFooter productId={productId} isPrebuilt={isPrebuilt} productName={product.name} />
    </DemoContainer>
  )
}
