'use client'
import React, { useState, useTransition } from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { RuntimeEnvDemo, type RuntimeEnvCall } from './components/RuntimeEnvDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  const [calls, setCalls] = useState<RuntimeEnvCall[]>([])
  const [isPending, startTransition] = useTransition()

  const handleCall = () => {
    startTransition(async () => {
      const res = await fetch(`${window.location.pathname}/api/status`, { cache: 'no-store' })
      const data: RuntimeEnvCall = await res.json()
      setCalls((prev) => [data, ...prev].slice(0, 5))
    })
  }

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"동적 런타임 환경변수(process.env) 실시간 참조"}
        concept={"Route Handler는 빌드 시점이 아닌 실제 요청 시점에 process.env와 process.pid를 읽는다. [api/status 호출] 버튼을 여러 번 눌러 같은 서버 프로세스(pid 동일)에서 매번 새로 계산되는 evaluatedAt 값을 직접 확인한다."}
        steps={[
          {
            step: 1,
            title: "[api/status 호출] 버튼 클릭",
            description: "실제 Route Handler(app/.../api/status/route.ts)를 fetch로 호출합니다.",
            actionBadge: "요청 실행",
          },
          {
            step: 2,
            title: "pid, NODE_ENV, evaluatedAt 값 확인",
            description: "process.env/process.pid에서 실제로 읽은 값이 표시되는지 확인합니다.",
            actionBadge: "값 확인",
          },
          {
            step: 3,
            title: "버튼을 한 번 더 클릭해 두 번째 호출 결과와 비교",
            description: "pid는 그대로인데 evaluatedAt만 갱신되는지 관찰합니다 — 빌드 타임에 굳지 않고 매 요청마다 실행됨을 증명합니다.",
            actionBadge: "재호출 비교",
            observe: "pid 동일 여부와 evaluatedAt 갱신 여부를 검증 패널에서 관찰",
            observeAt: "verification",
          },
        ]}
      />
      <DemoPlaygroundCard title={"process.env 런타임 환경변수 동적 참조 실습"}>
        <RuntimeEnvDemo calls={calls} isPending={isPending} onCall={handleCall} />
      </DemoPlaygroundCard>
      <VerificationFooter
        isMatched={calls.length >= 2 ? calls[0].pid === calls[1].pid && calls[0].evaluatedAt !== calls[1].evaluatedAt : undefined}
        actual={calls[0] ? `- pid: ${calls[0].pid}\n- NODE_ENV: ${calls[0].nodeEnv}\n- evaluatedAt: ${calls[0].evaluatedAt}\n- 총 호출 횟수: ${calls.length}` : undefined}
        expected="Route Handler(api/status)를 여러 번 호출해도 같은 서버 프로세스(pid 동일)에서 매번 새로 계산된 evaluatedAt 값을 반환해야 한다 (빌드 타임 고정값이 아님)."
      />
    </DemoContainer>
  )
}
