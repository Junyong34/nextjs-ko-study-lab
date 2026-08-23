import React from 'react'
import Link from 'next/link'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { VerificationFooter } from '../../components/VerificationFooter'

const ITEMS_DB: Record<
  string,
  { name: string; category: string; price: number; stock: number; badge: string; desc: string }
> = {
  'PROD-101': {
    name: '에어 플라이트 러닝화',
    category: '러닝 / 신발',
    price: 139000,
    stock: 24,
    badge: '인기 상품',
    desc: '통기성 메쉬 소재와 충격 흡수 에어 쿠셔닝이 적용된 고기능성 러닝화입니다.',
  },
  'PROD-102': {
    name: '울트라 라이트 윈드쉘 자켓',
    category: '아우터 / 스포츠',
    price: 179000,
    stock: 8,
    badge: '품절 임박',
    desc: '방풍 및 생활 방수를 지원하는 98g 초경량 립스탑 패커블 자켓입니다.',
  },
  'PROD-103': {
    name: '테크 백팩 28L',
    category: '가방 / 액세서리',
    price: 115000,
    stock: 45,
    badge: '신상품',
    desc: '방수 지퍼와 16인치 노트북 전용 패딩 수납공간을 갖춘 도심형 테크 백팩입니다.',
  },
}

export default async function SingleParamItemPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const item = ITEMS_DB[id] || {
    name: `알 수 없는 상품 (${id})`,
    category: '기타 카테고리',
    price: 0,
    stock: 0,
    badge: '커스텀 ID',
    desc: '동적 세그먼트 [id]로 전달된 파라미터입니다.',
  }

  const BASE_PATH = '/zone/baseline/file-conventions/dynamic-segments/single-param'

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={`[id] 단일 동적 세그먼트: /items/${id}`}
        concept="Next.js App Router의 [id] 폴더 컨벤션에 의해 URL 파라미터가 Page 컴포넌트의 params Promise로 주입되어 렌더링된 실제 서브 라우트 화면입니다."
        steps={[
          {
            step: 1,
            title: "[id] 세그먼트 파라미터 해석",
            description: `URL 경로의 마지막 세그먼트인 "${id}" 값을 params Promise로부터 언래핑(await params)합니다.`,
            actionBadge: `id: ${id}`,
          },
          {
            step: 2,
            title: "파라미터 기반 데이터 바인딩",
            description: "전달받은 id를 키로 상품 데이터베이스를 조회하여 상세 정보를 렌더링합니다.",
            actionBadge: "DB 조회",
          },
          {
            step: 3,
            title: "클라이언트 라우팅 전환",
            description: "다른 상품 링크를 클릭하여 Next.js Soft Navigation 시의 파라미터 갱신을 확인합니다.",
            actionBadge: "라우팅 전환",
          },
        ]}
      />

      <DemoPlaygroundCard title={`상품 상세 페이지 (URL: .../items/${id})`}>
        <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 dark:border-zinc-800">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-zinc-900 dark:text-zinc-100">{item.name}</h4>
                <span className="rounded bg-blue-100 px-2 py-0.5 text-[11px] font-mono font-semibold text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                  {item.badge}
                </span>
              </div>
              <p className="text-xs text-zinc-500">{item.category} • 파라미터: <code className="font-mono text-blue-600">{id}</code></p>
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
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">{item.desc}</p>
              <div className="flex justify-between items-center border-t border-zinc-200 pt-2 dark:border-zinc-800">
                <span className="text-xs text-zinc-500">판매 가격 / 재고:</span>
                <div className="text-right">
                  <span className="text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                    {item.price.toLocaleString()}원
                  </span>
                  <span className="text-xs text-zinc-500 ml-1.5">({item.stock}개 남음)</span>
                </div>
              </div>
            </div>

            <div className="rounded border border-zinc-200 bg-zinc-950 p-4 font-mono text-xs text-zinc-300 dark:border-zinc-800 space-y-2">
              <div className="font-bold text-zinc-400 border-b border-zinc-800 pb-1">
                서버 수신 params 객체 (Promise unwrap):
              </div>
              <pre className="text-[11px] text-emerald-400 bg-zinc-900 p-2 rounded">
                {JSON.stringify({ params: { id } }, null, 2)}
              </pre>
              <div className="pt-2 text-[11px] text-zinc-400 font-sans">
                다른 동적 파라미터로 이동:
              </div>
              <div className="flex gap-2 font-mono text-[10px]">
                {['PROD-101', 'PROD-102', 'PROD-103'].map((targetId) => (
                  <Link
                    key={targetId}
                    href={`${BASE_PATH}/items/${targetId}`}
                    className={`rounded px-2 py-1 ${
                      targetId === id
                        ? 'bg-blue-600 text-white font-bold'
                        : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                    }`}
                  >
                    {targetId}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DemoPlaygroundCard>

      <VerificationFooter currentId={id} />
    </DemoContainer>
  )
}
