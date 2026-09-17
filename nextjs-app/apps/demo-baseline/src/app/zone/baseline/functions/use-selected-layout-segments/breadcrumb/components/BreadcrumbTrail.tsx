'use client'

import React from 'react'
import Link from 'next/link'
import { BASE_PATH, getCategoryName, getProductById } from '../types'

/**
 * useSelectedLayoutSegments()가 실제로 반환한 배열(segments)만을 입력으로 받아 그대로 렌더링한다.
 * 배열을 별도 state로 복제하거나 하드코딩하지 않는다 — 배열 길이·내용이 바뀌면 이 컴포넌트의
 * 출력도 즉시 함께 바뀐다.
 *
 * segments[0]은 실제 파일 세그먼트 이름 "category" 자신이라 대응하는 page.tsx가 없다(폴더만 존재).
 * 그래서 이 항목은 링크 없는 라벨로만 표시해, 배열에 "탐색 가능한 URL이 아닌 순수 폴더 세그먼트"도
 * 섞여 들어온다는 점을 그대로 드러낸다.
 */
export function BreadcrumbTrail({ segments }: { segments: string[] }) {
  const crumbs = segments.map((segment, index) => {
    const isCategorySlug = index > 0 && segments[index - 1] === 'category'
    if (segment === 'category') {
      return { label: '카테고리', href: null }
    }
    if (isCategorySlug) {
      return { label: getCategoryName(segment), href: `${BASE_PATH}/category/${segment}` }
    }
    const product = getProductById(segment)
    return { label: product ? product.name : segment, href: null }
  })

  return (
    <nav aria-label="브레드크럼" className="flex flex-wrap items-center gap-1.5 text-xs">
      <Link href={BASE_PATH} className="font-medium text-zinc-600 hover:underline dark:text-zinc-400">
        전체 상품
      </Link>
      {crumbs.map((crumb, index) => {
        const isLast = index === crumbs.length - 1
        return (
          <React.Fragment key={`${crumb.label}-${index}`}>
            <span aria-hidden className="text-zinc-400 dark:text-zinc-600">
              /
            </span>
            {crumb.href && !isLast ? (
              <Link href={crumb.href} className="font-medium text-zinc-600 hover:underline dark:text-zinc-400">
                {crumb.label}
              </Link>
            ) : (
              <span
                className={
                  isLast
                    ? 'font-bold text-blue-600 dark:text-blue-400'
                    : 'text-zinc-500 dark:text-zinc-500'
                }
              >
                {crumb.label}
              </span>
            )}
          </React.Fragment>
        )
      })}
    </nav>
  )
}
