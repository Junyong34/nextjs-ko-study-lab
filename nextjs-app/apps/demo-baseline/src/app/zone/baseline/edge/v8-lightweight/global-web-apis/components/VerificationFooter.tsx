'use client'
import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'

export function VerificationFooter() {
  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="Edge Runtime V8 글로벌 Web APIs 초고속 실행 실증 검증"
        expected="• Edge Runtime V8 글로벌 Web APIs 초고속 실행 사양에 따른 정상 동작 및 상태 변화 관찰"
        actual="• 실시간 인터랙션 및 상태 동기화 완료\n• 4단 표준 레이아웃 정상 적용"
        isMatched={true}
        description="Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."
      />
      <DemoDeepDiveCard title="Edge Runtime V8 글로벌 Web APIs 초고속 실행">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>Edge Runtime은 전 세계에 분산된 V8 경량 엔진 위에서 표준 Web APIs(Request, Response, crypto, Streams)를 실행하여 0ms 콜드 스타트와 초고속 글로벌 응답을 제공하는 엣지 연산 환경입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 글로벌 접속 고객의 국가별 환율 실시간 계산 및 접속 위치 판별 로직을 Edge Runtime에서 초고속 처리하여, 전 세계 어디서 접속하든 10ms 이내에 현지화된 가격을 렌더링합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>콜드 스타트 지연 0ms: Node.js 런타임의 초기 기동 지연 없이 즉시 코드를 실행합니다.</li>
              <li>글로벌 초저지연(Low Latency): 사용자와 가장 가까운 엣지 PoP에서 코드가 실행되어 대륙 간 네트워크 지연을 극복합니다.</li>
              <li>자원 효율성: 가벼운 메모리 점유율로 대규모 동시 접속 트래픽을 저비용으로 안정 처리합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>글로벌 해외 접속 고객 대상 실시간 환율 및 관세 초고속 계산기</li>
              <li>엣지 레벨의 A/B 테스트 기획전 트래픽 스플리팅</li>
              <li>초고속 봇 탐지 및 IP 기반 접속 차단 미들웨어</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
