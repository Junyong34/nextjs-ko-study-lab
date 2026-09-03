import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'file-conventions/dynamic-segments/catch-all-slug/shop/[...slug]')

import React from 'react'
import Link from 'next/link'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { VerificationFooter } from '../../components/VerificationFooter'

const CATEGORY_NAMES: Record<string, string> = {
  fashion: '패션/의류',
  shoes: '신발',
  running: '러닝화',
  sneakers: '스니커즈',
  electronics: '가전/디지털',
  audio: '음향기기',
  'wireless-headphones': '무선 헤드폰',
  outdoor: '아웃도어',
  camping: '캠핑용품',
}

export default async function CatchAllSlugPage({
  params,
}: {
  params: Promise<{ slug: string[] }>
}) {
  const { slug } = await params
  const BASE_PATH = '/zone/baseline/file-conventions/dynamic-segments/catch-all-slug'

  const breadcrumbs = slug.map((seg, idx) => {
    const subPath = slug.slice(0, idx + 1).join('/')
    const title = CATEGORY_NAMES[seg] || seg
    return {
      segment: seg,
      title,
      href: `${BASE_PATH}/shop/${subPath}`,
    }
  })

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={`[...slug] 포괄적 동적 세그먼트: /shop/${slug.join('/')}`}
        concept="Next.js App Router의 [...slug] 폴더 컨벤션을 통해 1단계 이상의 가변 깊이 URL 경로를 string[] 배열 형태의 params.slug로 수신하여 계층형 카테고리를 렌더링합니다."
        steps={[
          {
            step: 1,
            title: "[...slug] 배열 파라미터 파싱",
            description: `현재 경로 "${slug.join('/')}"가 ${slug.length}개의 배열 요소로 분할되어 params.slug에 주입되었습니다.`,
            actionBadge: `길이: ${slug.length}`,
          },
          {
            step: 2,
            title: "계층형 브레드크럼 조립",
            description: "slug 배열을 순회하여 상위 카테고리부터 하위 세그먼트까지의 탐색 링크를 동적 생성합니다.",
            actionBadge: "브레드크럼",
          },
          {
            step: 3,
            title: "가변 깊이 라우팅 전환",
            description: "1단계 대분류부터 3단계 세부 상품군까지 자유롭게 이동하며 배열 변화를 확인합니다.",
            actionBadge: "깊이 변경",
          },
        ]}
      />

      <DemoPlaygroundCard title={`카테고리 탐색기 (URL: .../shop/${slug.join('/')})`}>
        <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500 font-semibold">위치:</span>
              <nav className="flex items-center gap-1.5 text-xs font-medium">
                <Link href={BASE_PATH} className="text-blue-600 hover:underline">
                  홈
                </Link>
                {breadcrumbs.map((bc, i) => (
                  <React.Fragment key={bc.href}>
                    <span className="text-zinc-400">/</span>
                    <Link
                      href={bc.href}
                      className={
                        i === breadcrumbs.length - 1
                          ? 'font-bold text-zinc-900 dark:text-zinc-100'
                          : 'text-zinc-600 hover:text-blue-600 dark:text-zinc-400'
                      }
                    >
                      {bc.title}
                    </Link>
                  </React.Fragment>
                ))}
              </nav>
            </div>
            <Link
              href={BASE_PATH}
              className="rounded bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300"
            >
              ← 최상위 목록 복귀
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50 space-y-3">
              <div className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                카테고리 깊이 정보 (Depth: {slug.length}단계)
              </div>
              <div className="space-y-1.5 text-xs">
                {slug.map((seg, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-white p-2 rounded border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800">
                    <span className="font-mono text-zinc-500">slug[{idx}]</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">{seg}</span>
                    <span className="text-[11px] text-zinc-400">({CATEGORY_NAMES[seg] || '커스텀'})</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded border border-zinc-200 bg-zinc-950 p-4 font-mono text-xs text-zinc-300 dark:border-zinc-800 space-y-2">
              <div className="font-bold text-zinc-400 border-b border-zinc-800 pb-1">
                서버 수신 params.slug 배열:
              </div>
              <pre className="text-[11px] text-emerald-400 bg-zinc-900 p-2 rounded">
                {JSON.stringify({ slug }, null, 2)}
              </pre>
              <div className="pt-2 text-[11px] text-zinc-400 font-sans">
                다른 계층 경로로 즉시 이동:
              </div>
              <div className="flex flex-wrap gap-1.5 font-mono text-[10px]">
                <Link
                  href={`${BASE_PATH}/shop/fashion`}
                  className="rounded bg-zinc-800 px-2 py-1 text-zinc-300 hover:bg-zinc-700"
                >
                  /shop/fashion (1단계)
                </Link>
                <Link
                  href={`${BASE_PATH}/shop/fashion/shoes/running`}
                  className="rounded bg-zinc-800 px-2 py-1 text-zinc-300 hover:bg-zinc-700"
                >
                  /shop/fashion/shoes/running (3단계)
                </Link>
                <Link
                  href={`${BASE_PATH}/shop/electronics/audio/wireless-headphones`}
                  className="rounded bg-zinc-800 px-2 py-1 text-zinc-300 hover:bg-zinc-700"
                >
                  /shop/electronics/audio/wireless-headphones
                </Link>
              </div>
            </div>
          </div>
        </div>
      </DemoPlaygroundCard>

      <VerificationFooter currentSlug={slug} />
    </DemoContainer>
  )
}
