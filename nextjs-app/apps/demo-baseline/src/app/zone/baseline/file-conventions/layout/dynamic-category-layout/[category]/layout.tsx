import React from 'react'
import { notFound } from 'next/navigation'
import { connection } from 'next/server'
import { isCategorySlug } from '../catalog'
import { CategoryLayoutProbe } from '../components/CategoryLayoutProbe'

interface CategoryLayoutProps {
  children: React.ReactNode
  params: Promise<{ category: string }>
}

/**
 * 관측 대상인 동적 세그먼트 layout.
 * props 객체의 실제 키와 await params 결과를 그대로 내려보내고,
 * connection()으로 요청 시점 렌더를 보장한 뒤 렌더마다 새 render ID를 만든다.
 */
export default async function CategoryLayout(props: CategoryLayoutProps) {
  await connection()
  const propKeys = Object.keys(props)
  const params = await props.params
  if (!isCategorySlug(params.category)) notFound()

  const renderId = crypto.randomUUID()
  const renderedAt = new Date().toISOString()

  return (
    <section
      aria-label="[category] 레이아웃"
      className="min-w-0 space-y-4 rounded border border-blue-200 p-3 dark:border-blue-900"
    >
      <CategoryLayoutProbe
        category={params.category}
        renderId={renderId}
        renderedAt={renderedAt}
        paramsJson={JSON.stringify(params)}
        propKeys={propKeys}
      />
      <div className="min-w-0">{props.children}</div>
    </section>
  )
}
