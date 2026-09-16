'use client'

import React, { useState, useTransition } from 'react'
import { DemoPlaygroundCard } from '@study/demo-kit'
import { compareRegistryInjectionAction } from '../actions'
import { RawHtmlComparePanel } from './RawHtmlComparePanel'
import { VerificationFooter } from './VerificationFooter'
import type { RegistryComparisonResult } from '../types'

export function UseServerInsertedHtmlDemo() {
  const [result, setResult] = useState<RegistryComparisonResult | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleCompare = () => {
    startTransition(async () => {
      const next = await compareRegistryInjectionAction()
      setResult(next)
    })
  }

  const handleReset = () => setResult(null)

  const isMatched = result
    ? result.withHook.headInjectionFound && !result.withoutHook.headInjectionFound && !result.withoutHook.bodyInjectionFound
    : undefined

  const actual = result
    ? `• with-hook 라우트 (${result.fetchedAt} 요청, HTTP ${result.withHook.status}): head 삽입 ${
        result.withHook.headInjectionFound ? 'O' : 'X'
      }, body 인라인 삽입 ${result.withHook.bodyInjectionFound ? 'O' : 'X'}, 태그 ${result.withHook.styleTagCount}개\n` +
      `• without-hook 라우트 (HTTP ${result.withoutHook.status}): head 삽입 ${
        result.withoutHook.headInjectionFound ? 'O' : 'X'
      }, body 인라인 삽입 ${result.withoutHook.bodyInjectionFound ? 'O' : 'X'}, 태그 ${result.withoutHook.styleTagCount}개`
    : undefined

  return (
    <>
      <DemoPlaygroundCard title="useServerInsertedHTML SSR 인라인 스타일 주입 실습">
        <RawHtmlComparePanel
          result={result}
          isPending={isPending}
          onCompare={handleCompare}
          onReset={handleReset}
        />
      </DemoPlaygroundCard>
      <VerificationFooter isMatched={isMatched} actual={actual} />
    </>
  )
}
