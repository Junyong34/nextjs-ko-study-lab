'use client'
import React, { useState, useTransition } from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ReactTaintDemo } from './components/ReactTaintDemo'
import { VerificationFooter } from './components/VerificationFooter'
import {
  returnMaskedAction,
  returnTaintedObjectAction,
  returnTaintedValueAction,
  returnDerivedValueAction,
} from './actions'
import { DEMO_SECRET_PREFIX, EMPTY_STATE, type TaintCaseId, type TaintDemoState } from './types'

const ACTIONS: Record<TaintCaseId, () => Promise<unknown>> = {
  safe: returnMaskedAction,
  object: returnTaintedObjectAction,
  value: returnTaintedValueAction,
  derived: returnDerivedValueAction,
}

export default function DemoPage() {
  const [state, setState] = useState<TaintDemoState>(EMPTY_STATE)
  const [isPending, startTransition] = useTransition()

  const run = (id: TaintCaseId) => {
    startTransition(async () => {
      let blocked = false
      let message: string
      let secretLeaked = false
      try {
        const res = await ACTIONS[id]()
        message = JSON.stringify(res)
        // 클라이언트가 받은 응답 안에 시크릿 원문이 있는지 직접 검사한다.
        secretLeaked = message.includes(DEMO_SECRET_PREFIX)
      } catch (error) {
        blocked = true
        message = error instanceof Error ? error.message : String(error)
      }
      setState((prev) => ({
        ...prev,
        [id]: { case: id, blocked, message, secretLeaked, timestamp: new Date().toLocaleTimeString('ko-KR') },
      }))
    })
  }

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="React Taint API로 서버 시크릿 유출 차단"
        concept="next.config의 experimental.taint를 켜면 experimental_taintObjectReference(객체 참조)와 experimental_taintUniqueValue(값)로 표시한 데이터가 Server Action 응답 등 클라이언트 직렬화 경계를 넘으려 할 때 React가 예외를 던집니다. 다만 값에서 파생된 새 문자열은 추적하지 못합니다."
        steps={[
          {
            step: 1,
            title: '[① 마스킹 값 반환] 클릭',
            description: '시크릿은 서버에 두고 앞 7자리만 마스킹해 돌려줍니다. 정상 통과해야 합니다.',
            actionBadge: '정상 경로',
          },
          {
            step: 2,
            title: '[② config 객체 반환]과 [③ secretKey 문자열 반환] 클릭',
            description: '오염된 객체 참조와 오염된 값을 각각 그대로 반환해 React 에러로 차단되는지 봅니다.',
            actionBadge: '차단 확인',
            observe: '두 카드 모두 "차단됨"이며 응답에 시크릿 원문이 없음',
            observeAt: 'playground',
          },
          {
            step: 3,
            title: '[④ 문자열로 가공해 반환] 클릭',
            description: 'secretKey를 템플릿 문자열에 섞어 반환합니다. 파생 값은 taint가 따라가지 않아 그대로 유출됩니다.',
            actionBadge: '한계 확인',
            observe: '차단되지 않고 시크릿 원문이 응답에 포함됨',
            observeAt: 'verification',
          },
        ]}
      />
      <DemoPlaygroundCard title="결제 시크릿 taint 실습 콘솔">
        <ReactTaintDemo state={state} isPending={isPending} onRun={run} onReset={() => setState(EMPTY_STATE)} />
      </DemoPlaygroundCard>
      <VerificationFooter state={state} />
    </DemoContainer>
  )
}
