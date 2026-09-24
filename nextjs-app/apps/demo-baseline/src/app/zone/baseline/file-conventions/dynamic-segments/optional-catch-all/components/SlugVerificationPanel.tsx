'use client'
import React from 'react'
import { usePathname } from 'next/navigation'
import { ExpectedActualPanel } from '@study/demo-kit'
import { SHOP_PATH, safeDecode, type ParamsObservation } from '../types'

interface SlugShape {
  typeofSlug: string
  isArray: boolean
  length: number | null
  items: string[]
}

/** 공식 문서 표 기준: 세그먼트 0개면 undefined, 1개 이상이면 디코딩된 string[] */
function expectFromPathname(pathname: string): { segments: string[]; shape: SlugShape } | null {
  if (pathname !== SHOP_PATH && !pathname.startsWith(`${SHOP_PATH}/`)) return null
  const segments = pathname.slice(SHOP_PATH.length).split('/').filter(Boolean).map(safeDecode)
  const shape: SlugShape =
    segments.length === 0
      ? { typeofSlug: 'undefined', isArray: false, length: null, items: [] }
      : { typeofSlug: 'object', isArray: true, length: segments.length, items: segments }
  return { segments, shape }
}

function describe(shape: SlugShape): string {
  return [
    `typeof slug = ${JSON.stringify(shape.typeofSlug)}`,
    `Array.isArray(slug) = ${shape.isArray}`,
    `slug?.length = ${shape.length ?? 'undefined'}`,
    `items = ${JSON.stringify(shape.items)}`,
  ].join('\n')
}

/**
 * 기대값: 브라우저 주소(usePathname)에서 /shop 뒤 세그먼트를 직접 잘라 계산.
 * 실제값: 서버 page가 await params로 받은 값(observation).
 * observation이 없으면(실습 첫 화면) 대기 상태를 표시한다.
 */
export function SlugVerificationPanel({ observation }: { observation?: ParamsObservation }) {
  const pathname = usePathname()
  const expected = expectFromPathname(pathname)

  if (!observation || !expected) {
    return (
      <ExpectedActualPanel
        title="[[...slug]] params 실측 대조"
        expected={<span>{'위 링크로 .../shop 이하 경로에 진입하면\n주소에서 계산한 기대값이 표시됩니다.'}</span>}
        actual={<span>{'아직 shop/[[...slug]]/page.tsx가 렌더링되지 않았습니다.'}</span>}
        isMatched={undefined}
        description="shop/[[...slug]]/page.tsx가 실제로 받은 params.slug를, 주소창 세그먼트로 계산한 기대값과 비교합니다."
      />
    )
  }

  const actualShape: SlugShape = {
    typeofSlug: observation.typeofSlug,
    isArray: observation.isArray,
    length: observation.length,
    items: observation.items,
  }
  // 요소 비교는 양쪽을 decodeURIComponent로 정규화한 뒤 한다. 받은 원문은 실측 표에 그대로 있다.
  const normalizedActual: SlugShape = { ...actualShape, items: actualShape.items.map(safeDecode) }
  const isMatched = describe(normalizedActual) === describe(expected.shape)

  return (
    <ExpectedActualPanel
      title="[[...slug]] params 실측 대조"
      expected={
        <span>
          {`주소 세그먼트 ${expected.segments.length}개 → ${
            expected.segments.length === 0 ? 'slug 없음' : 'string[]'
          }\n${describe(expected.shape)}`}
        </span>
      }
      actual={
        <span>
          {`서버 await params 결과 (요소는 decode 후)\n${describe(normalizedActual)}\n받은 원문 = ${JSON.stringify(actualShape.items)}`}
        </span>
      }
      isMatched={isMatched}
      description="기대값은 usePathname()으로 읽은 주소에서 /shop 뒤 세그먼트를 잘라 계산한 값(공식 문서 표: 0개면 undefined, 1개 이상이면 string[])입니다. 실제값은 서버 page가 await params로 받은 값이며, 요소 문자열은 양쪽 모두 decodeURIComponent로 맞춘 뒤 비교합니다."
    />
  )
}
