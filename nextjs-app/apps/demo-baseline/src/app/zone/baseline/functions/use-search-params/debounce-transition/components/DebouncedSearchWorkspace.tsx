'use client'
import React from 'react'
import { DemoPlaygroundCard } from '@study/demo-kit'
import { useDebouncedSearchSync } from '../hooks/useDebouncedSearchSync'
import { SearchPlayground } from './SearchPlayground'
import { VerificationFooter } from './VerificationFooter'

/**
 * useDebouncedSearchSync를 한 번만 호출해 실습화면(2단)과 검증(3단)이
 * 동일한 실측 키 입력·전환 로그를 공유하도록 묶는 클라이언트 조립 컴포넌트.
 */
export function DebouncedSearchWorkspace() {
  const {
    inputValue,
    handleChange,
    isPending,
    keystrokes,
    transitionEdges,
    lastCommit,
    inputRenderLatencyMs,
    queryFromUrl,
    rawQueryString,
    reset,
  } = useDebouncedSearchSync()

  return (
    <>
      <DemoPlaygroundCard title="useTransition 연동 디바운스 검색 쿼리 동기화 실습">
        <SearchPlayground
          inputValue={inputValue}
          onChange={handleChange}
          isPending={isPending}
          keystrokes={keystrokes}
          transitionEdges={transitionEdges}
          inputRenderLatencyMs={inputRenderLatencyMs}
          queryFromUrl={queryFromUrl}
          rawQueryString={rawQueryString}
          onReset={reset}
        />
      </DemoPlaygroundCard>
      <VerificationFooter
        queryFromUrl={queryFromUrl}
        rawQueryString={rawQueryString}
        lastCommit={lastCommit}
        transitionEdges={transitionEdges}
        inputRenderLatencyMs={inputRenderLatencyMs}
      />
    </>
  )
}
