'use client'
import React, { useState, useTransition } from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { RevalidatePathSyncDemo } from './components/RevalidatePathSyncDemo'
import { VerificationFooter } from './components/VerificationFooter'
import { executeRevalidatePathAction } from './actions'
import type { RevalidatePathResult } from './types'

export default function DemoPage() {
  const [result, setResult] = useState<RevalidatePathResult | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleRevalidate = () => {
    startTransition(async () => {
      const res = await executeRevalidatePathAction('/shop')
      setResult(res)
    })
  }

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"revalidatePath('/shop')를 통한 전체 라우트 캐시 일괄 퍼지"}
        concept={"관리자 상품 수정 후 revalidatePath('/shop')를 호출하면 상단 배너, 사이드바, 상품 그리드 등 해당 라우트 트리에 속한 모든 정적 캐시를 원자적으로 일괄 무효화합니다."}
        steps={[
          {
            step: 1,
            title: "현재 상태(대기 중) 및 라우트 캐시 현황 점검",
            description: "초기 /shop 경로에 보관된 정적 캐시 상태와 버튼 라벨을 확인합니다.",
            actionBadge: "초기 상태 점검",
          },
          {
            step: 2,
            title: "[revalidatePath('/shop') 실행] 버튼 클릭",
            description: "Server Action을 실행하여 /shop 경로의 전체 세그먼트 캐시를 일괄 퍼지합니다.",
            actionBadge: "경로 퍼지 실행",
          },
          {
            step: 3,
            title: "상태 텍스트 갱신 및 전체 캐시 일괄 무효화 관찰",
            description: "상태 메시지가 [확인] 호출 완료로 변경되며 라우트 내 모든 컴포넌트 캐시가 갱신되는지 확인합니다.",
            actionBadge: "동기화 검증",
            observe: "revalidatePath('/shop') 호출 후 상태 텍스트 변경 및 전체 라우트 캐시 일괄 퍼지 결과 관찰",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"revalidatePath에 따른 라우트 범위별 무효화 실습"}>
        <RevalidatePathSyncDemo result={result} isPending={isPending} onRevalidate={handleRevalidate} />
      </DemoPlaygroundCard>
      <VerificationFooter
        result={result}
        isMatched={result ? result.status === 'PURGED' : undefined}
        status={result?.status}
        logs={result ? result.segments.map((s) => `${s.name} v${s.version} (${s.cachedTime})`) : undefined}
        actual={
          result
            ? `- 상태: ${result.status}\n- 메시지: ${result.message}\n- 갱신 시각: ${result.timestamp}\n- 세그먼트 ${result.segments.length}개 갱신`
            : undefined
        }
      />
    </DemoContainer>
  )
}
