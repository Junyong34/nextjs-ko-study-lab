'use client'
import React from 'react'
import { ExpectedActualPanel } from '@study/demo-kit'
import type { ParseContrast, SsrProbe } from '../types'

interface Props {
  ssr: SsrProbe | null
  contrast: ParseContrast[] | null
}

const ESCAPED_LT = '\\' + 'u003c'

function ssrOk(ssr: SsrProbe): boolean {
  return (
    ssr.status === 200 &&
    ssr.found &&
    ssr.inBody &&
    ssr.parseError === null &&
    ssr.fields.length > 0 &&
    ssr.fields.every((f) => f.ok) &&
    ssr.rawLtCount === 0 &&
    ssr.escapedLtCount > 0 &&
    ssr.matchesSafeSerializer
  )
}

function contrastOk(items: ParseContrast[]): boolean {
  const [unsafe, safe] = items
  const unsafeBroken = !unsafe.jsonOk && unsafe.injectedCount > 0
  const safeIntact = safe.scriptCount === 1 && safe.jsonOk && safe.injectedCount === 0 && safe.descriptionRoundTrip
  return unsafeBroken && safeIntact
}

export function JsonLdVerification({ ssr, contrast }: Props) {
  const isMatched = ssr && contrast ? ssrOk(ssr) && contrastOk(contrast) : ssr && !ssrOk(ssr) ? false : undefined

  const expected = (
    <span>
      {`• HTML 원문(JS 실행 전)의 <body> 안에 #product-jsonld script가 존재
• JSON.parse 결과의 @type·sku·name·brand.name·description·offers.price·priceCurrency·availability = 서버 ProductRecord
• script 본문에 날것 '<' 0개, '${ESCAPED_LT}' 1개 이상, serializeJsonLdSafe(원본)과 바이트 단위로 동일
• 치환 전 직렬화: </script>에서 경계가 끊겨 JSON.parse 실패 + [data-injected] 요소 생성
• 치환 후 직렬화: script 1개, JSON.parse 성공, description 왕복 일치, 주입 요소 0개`}
    </span>
  )

  const lines: string[] = []
  if (!ssr) lines.push('• HTML 원문 검사 대기 중')
  else {
    const failed = ssr.fields.filter((f) => !f.ok).map((f) => f.path)
    lines.push(
      `• GET ${ssr.status}, #product-jsonld 발견=${ssr.found}, <${ssr.parentTag}> 안, body 안=${ssr.inBody}`,
      `• 필드 대조 ${ssr.fields.length - failed.length}/${ssr.fields.length} 일치${failed.length ? ` (불일치: ${failed.join(', ')})` : ''}${ssr.parseError ? ` / ${ssr.parseError}` : ''}`,
      `• 날것 '<' ${ssr.rawLtCount}개, '${ESCAPED_LT}' ${ssr.escapedLtCount}개, safe 직렬화와 동일=${ssr.matchesSafeSerializer}`,
    )
  }
  if (!contrast) lines.push('• 치환 전/후 파싱 대조 대기 중')
  else {
    const [unsafe, safe] = contrast
    lines.push(
      `• 치환 전: JSON.parse ${unsafe.jsonOk ? '성공' : '실패'}, 주입 요소 ${unsafe.injectedCount}개`,
      `• 치환 후: script ${safe.scriptCount}개, JSON.parse ${safe.jsonOk ? '성공' : '실패'}, 왕복 일치=${safe.descriptionRoundTrip}, 주입 요소 ${safe.injectedCount}개`,
    )
  }

  return (
    <ExpectedActualPanel
      title="SSR HTML의 JSON-LD 포함 여부와 < 이스케이프"
      expected={expected}
      actual={<span>{lines.join('\n')}</span>}
      isMatched={isMatched ?? undefined}
      description="두 버튼을 모두 실행하면 실측값으로 판정합니다. HTML 원문은 매 클릭마다 cache: 'no-store'로 새로 받습니다."
    />
  )
}
