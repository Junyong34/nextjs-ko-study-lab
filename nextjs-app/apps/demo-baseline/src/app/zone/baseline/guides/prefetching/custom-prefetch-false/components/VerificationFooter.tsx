'use client'
import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'

export interface VerificationFooterProps {
  isMatched?: boolean
  expected?: React.ReactNode
  actual?: React.ReactNode
  status?: string | number | null
  description?: string
  isLoaded?: boolean
  logs?: string[]
  count?: number
  [key: string]: any
}

export function VerificationFooter(props: VerificationFooterProps = {}) {
  const {
    isMatched: propIsMatched,
    expected: propExpected,
    actual: propActual,
    status,
    description: propDescription,
    isLoaded,
    logs,
    count,
    ...rest
  } = props

  const isMatched =
    propIsMatched !== undefined
      ? propIsMatched
      : status !== undefined && status !== null
      ? typeof status === 'number'
        ? status >= 200 && status < 400
        : status === 'success' || status === 'valid' || status === 'completed' || status === 'ok'
      : isLoaded !== undefined
      ? Boolean(isLoaded)
      : logs && Array.isArray(logs) && logs.length > 0
      ? true
      : count !== undefined && count > 0
      ? true
      : undefined

  const defaultExpected = "• prefetch={false} 명시적 프리패치 차단 사양에 따른 정상 동작 및 상태 변화 관찰"
  const defaultActual = "• 실시간 인터랙션 및 상태 동기화 완료\n• 4단 표준 레이아웃 정상 적용"

  const actualContent =
    propActual !== undefined
      ? propActual
      : isMatched === true
      ? defaultActual
      : isMatched === false
      ? '• 인터랙션 실패 또는 불일치 감지 (동작 재확인이 필요합니다)'
      : '• 인터랙션 대기 중 (상단 데모의 조작 요소를 실행하여 결과를 관찰하세요)'

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="prefetch={false} 명시적 프리패치 차단 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
                        <DemoDeepDiveCard title="prefetch={false} 명시적 프리패치 차단 및 데이터 절약">
              <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
                  <p><code>{'<'}Link prefetch={'{'}false{'}'}{'>'}</code>는 뷰포트(Viewport)에 진입한 링크를 자동으로 사전 다운로드하는 Next.js의 기본 프리패치 동작을 명시적으로 차단하여, 사용자가 실제로 링크에 마우스를 올리거나(Hover) 터치할 때까지 네트워크 요청을 지연시키는 대역폭 최적화 스펙입니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
                  <p>본 데모에서는 페이지 하단에 배치된 수십 개의 푸터 링크 및 이용약관 링크에 <code>prefetch={'{'}false{'}'}</code>를 적용하여, 스크롤 다운 시 불필요한 수십 건의 RSC 청크 프리패치가 발송되지 않고 마우스 호버 시점에만 선별적으로 다운로드되는 네트워크 절감 효과를 검증합니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>모바일 사용자 데이터 대역폭 절감</strong>: 사용자가 클릭할 확률이 극히 낮은 보조 링크들의 자동 다운로드를 막아 네트워크 데이터 소모를 최소화합니다.</li>
                    <li><strong>서버 I/O 및 프리패치 트래픽 절약</strong>: 수많은 사용자가 메인 페이지를 스크롤할 때 발생하는 수백만 건의 백그라운드 프리패치 서버 부하를 방지합니다.</li>
                    <li><strong>초기 메인 스레드 CPU 점유율 완화</strong>: 불필요한 리소스 파싱 작업을 줄여 메인 페이지 인터랙션 반응성(INP)을 개선합니다.</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li>쇼핑몰 하단 푸터(Footer)의 이용약관, 개인정보처리방침, 회사소개 링크</li>
                    <li>수백 개의 페이지네이션 번호 링크 그리드</li>
                    <li>로그아웃, 회원탈퇴 등 즉각 프리패치할 필요가 없는 위험/보조 액션 링크</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>마우스 호버 시점의 다운로드 지연</strong>: <code>prefetch={'{'}false{'}'}</code>를 적용해도 마우스를 올리면(Hover) 프리패치가 시작되지만, 호버 없이 초고속으로 클릭할 경우 약간의 로딩 전환이 발생할 수 있습니다.</li>
                    <li><strong>핵심 전환 링크에는 적용 지양</strong>: [장바구니 담기], [결제하기], [다음 단계] 등 핵심 전환율에 직결되는 주요 CTA 링크에는 <code>prefetch={'{'}true{'}'}</code>를 유지해야 합니다.</li>
                  </ul>
                </div>
              </div>
            </DemoDeepDiveCard>
    </div>
  )
}
