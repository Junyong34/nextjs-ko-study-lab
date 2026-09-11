import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getDemoMetadata } from '@study/demos'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard, MOCK_PRODUCTS } from '@study/demo-kit'
import { VerificationFooter } from '../../../components/VerificationFooter'
import { BASE_PATH, PREBUILT_COMBINATIONS, PREBUILT_CATEGORIES, isPrebuiltCombination } from '../../../constants'

interface ProductPageProps {
  params: Promise<{ category: string; id: string }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { category, id } = await params
  return getDemoMetadata(
    'baseline',
    `functions/generate-static-params/multiple-segments/shop/${category}/${id}`,
  )
}

// 자식([id]) 세그먼트의 generateStaticParams — 부모 [category] layout이 반환한 카테고리
// 각각에 대해 한 번씩 호출된다(top-down 방식, 공식 문서 "Generate params from the top down").
// params.category로 부모가 이미 확정한 카테고리를 넘겨받아, 그 카테고리 안에서만 id를 채운다.
export async function generateStaticParams({ params }: { params: { category: string } }) {
  return PREBUILT_COMBINATIONS.filter((combo) => combo.category === params.category).map((combo) => ({
    id: combo.id,
  }))
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { category, id } = await params
  const product = MOCK_PRODUCTS.find((item) => item.id === id)

  // category/id 조합이 실제로 유효한지 여기서 검증한다 — id는 실존하지만 category가
  // 다르면(예: /shop/fashion/prod-001, prod-001은 electronics 상품) 잘못된 조합이므로
  // dynamicParams=true여도 진짜 404로 처리한다.
  if (!product || product.category !== category) {
    notFound()
  }

  const isPrebuilt = isPrebuiltCombination(category, id)
  const isCategoryPrebuilt = PREBUILT_CATEGORIES.includes(category)

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={`generateStaticParams 결과: /shop/${category}/${id}`}
        concept={
          isPrebuilt
            ? `"${product.name}"은 category(${category})와 id(${id})가 모두 generateStaticParams() 반환 목록에 포함되어 next build 시점에 이미 정적 HTML로 생성되어 있습니다.`
            : `"${product.name}"은 category(${category})는 실존하지만 이 id는 generateStaticParams() 목록에 없습니다. dynamicParams 기본값(true)에 따라 지금 이 요청에서 온디맨드로 렌더링됩니다.`
        }
        steps={[
          {
            step: 1,
            title: 'params.category / params.id 확인',
            description: `URL 세그먼트 "${category}/${id}"가 각각 부모 layout과 자식 page의 params Promise로 전달되어 상품 조회에 쓰였습니다.`,
            actionBadge: `${category}/${id}`,
          },
          {
            step: 2,
            title: '사전 SSG 여부 판정 결과 확인',
            description: 'generateStaticParams() 반환 배열에 이 category+id 조합이 포함되는지로 사전 SSG 여부가 결정됩니다.',
            actionBadge: isPrebuilt ? '사전 SSG 빌드됨' : '온디맨드 생성됨',
            observe: '카테고리 레이어와 id 레이어의 판정이 서로 다를 수 있다는 점',
            observeAt: 'verification',
          },
          {
            step: 3,
            title: '[← 카탈로그로 복귀] 클릭 후 다른 조합 선택',
            description: '사전 SSG 조합, 온디맨드 조합, 잘못된 조합을 번갈아 방문하며 판정 차이를 비교합니다.',
            actionBadge: '카탈로그 복귀',
          },
        ]}
      />

      <DemoPlaygroundCard title={`상품 상세 (URL: .../shop/${category}/${id})`}>
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
                {product.categoryName} • 파라미터:{' '}
                <code className="font-mono text-blue-600">
                  {category}/{id}
                </code>
              </p>
            </div>
            <Link
              href={BASE_PATH}
              className="rounded bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300"
            >
              ← 카탈로그로 복귀
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
                generateStaticParams() 반환 조합 (빌드 타임 계산됨):
              </div>
              <pre className="text-[11px] text-emerald-400 bg-zinc-900 p-2 rounded overflow-x-auto">
                {JSON.stringify(PREBUILT_COMBINATIONS, null, 2)}
              </pre>
              <div className="pt-2 text-[11px] text-zinc-400 font-sans">이 category({category})의 판정:</div>
              <div className="text-[11px]">
                <span className="text-zinc-500">카테고리 레이어:</span>{' '}
                <span className={isCategoryPrebuilt ? 'text-emerald-400' : 'text-amber-400'}>
                  {isCategoryPrebuilt ? '사전 SSG' : '온디맨드'}
                </span>
                {' · '}
                <span className="text-zinc-500">id 레이어:</span>{' '}
                <span className={isPrebuilt ? 'text-emerald-400' : 'text-amber-400'}>
                  {isPrebuilt ? '사전 SSG' : '온디맨드'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </DemoPlaygroundCard>

      <VerificationFooter
        category={category}
        id={id}
        productName={product.name}
        isPrebuilt={isPrebuilt}
        isCategoryPrebuilt={isCategoryPrebuilt}
      />
    </DemoContainer>
  )
}
