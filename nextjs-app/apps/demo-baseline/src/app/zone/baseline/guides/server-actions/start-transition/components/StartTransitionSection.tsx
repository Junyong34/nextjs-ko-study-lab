'use client'

import React, { useState, useTransition } from 'react'
import { DemoPlaygroundCard } from '@study/demo-kit'
import type { ServerFilterResult } from '../types'
import { filterCategoryProductsAction } from '../actions'
import { StartTransitionPlayground } from './StartTransitionPlayground'
import { StartTransitionVerification } from './StartTransitionVerification'

interface StartTransitionSectionProps {
  initialResult: ServerFilterResult
}

export function StartTransitionSection({ initialResult }: StartTransitionSectionProps) {
  const [isPending, startTransition] = useTransition()
  const [selected, setSelected] = useState(initialResult.category)
  const [result, setResult] = useState<ServerFilterResult>(initialResult)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [clickCount, setClickCount] = useState(0)
  const [hasInteracted, setHasInteracted] = useState(false)

  const handleCategoryChange = (category: string) => {
    setSelected(category)
    setHasInteracted(true)
    setClickCount((count) => count + 1)
    startTransition(async () => {
      const res = await filterCategoryProductsAction(category)
      setResult(res)
    })
  }

  const handleReset = () => {
    setSelected(initialResult.category)
    setResult(initialResult)
    setSearchKeyword('')
    setClickCount(0)
    setHasInteracted(false)
  }

  return (
    <>
      <DemoPlaygroundCard title="startTransition을 통한 프로그래밍 방식 Server Action 호출 실습">
        <StartTransitionPlayground
          isPending={isPending}
          selected={selected}
          result={result}
          searchKeyword={searchKeyword}
          onCategoryChange={handleCategoryChange}
          onSearchChange={setSearchKeyword}
          onReset={handleReset}
        />
      </DemoPlaygroundCard>
      <StartTransitionVerification
        hasInteracted={hasInteracted}
        isPending={isPending}
        selected={selected}
        result={result}
        clickCount={clickCount}
      />
    </>
  )
}
