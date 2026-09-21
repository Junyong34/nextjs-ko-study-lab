'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useStatePreservation } from './StatePreservationContext'

/**
 * 각 실제 하위 page.tsx 안에서 렌더링되어, "화면에 실제로 그려진 상품 카테고리"를
 * layout 프레임에 보고한다. pathname 문자열 파싱이 아니라 실제 렌더된 콘텐츠가
 * 근거이므로, 검증 패널은 경로와 실제 화면 카테고리를 각각 독립적으로 관측한다.
 */
export function CategoryReporter({ category }: { category: string }) {
  const pathname = usePathname()
  const { reportCategory } = useStatePreservation()

  useEffect(() => {
    reportCategory(pathname, category)
  }, [pathname, category, reportCategory])

  return null
}
