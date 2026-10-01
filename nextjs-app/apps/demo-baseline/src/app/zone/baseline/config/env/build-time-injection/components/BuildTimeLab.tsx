'use client'
import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { useInjectionProbe } from '../hooks/useInjectionProbe'
import { InjectionConsole } from './InjectionConsole'
import { VerificationFooter } from './VerificationFooter'

interface Props {
  /** 서버(page.tsx)가 next.config 조각에서 읽어 넘긴 선언값. 이 클라이언트 코드에는 리터럴로 들어 있지 않다. */
  expectedValue: string
  rawIdentifier: string
}

export function BuildTimeLab({ expectedValue, rawIdentifier }: Props) {
  const s = useInjectionProbe(expectedValue, rawIdentifier)
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="env 필드를 통한 빌드 타임 환경변수 주입"
        concept="next.config의 env에 선언한 값은 NEXT_PUBLIC_ 접두사가 없어도 코드의 process.env.KEY 참조 자리에 문자열로 인라인되어 클라이언트 번들에 들어간다. 서버와 브라우저에서 점 접근·동적 접근을 읽고, 내려받은 JS 청크 파일을 직접 검색해 확인한다."
        steps={[
          { step: 1, title: '[서버·브라우저 값 읽기 + 청크 검색] 실행', description: '같은 키를 서버(Route Handler)와 브라우저에서 점 접근과 동적 접근으로 읽고, 브라우저가 받은 JS 파일을 다시 fetch해 값을 검색합니다.', actionBadge: '측정', observe: '선언 키는 점 접근만 값이 보임', observeAt: 'playground' },
          { step: 2, title: '선언하지 않은 키와 비교', description: '접두사는 같지만 env에 선언하지 않은 키는 점 접근도 undefined입니다. 노출 여부는 접두사가 아니라 선언 여부가 정합니다.', actionBadge: '대조' },
          { step: 3, title: '검증 패널 확인', description: '항목별 일치/불일치와 청크 검색 결과를 확인합니다. 초기화하면 대기 상태로 돌아갑니다.', actionBadge: '결과 확인', observe: '6개 항목 판정', observeAt: 'verification' },
        ]}
      />
      <DemoPlaygroundCard title="env 필드 인라인 측정 실습">
        <InjectionConsole snapshot={s.snapshot} runs={s.runs} error={s.error} isPending={s.isPending} onProbe={s.probe} onReset={s.reset} />
      </DemoPlaygroundCard>
      <VerificationFooter snapshot={s.snapshot} expected={expectedValue} />
    </DemoContainer>
  )
}
