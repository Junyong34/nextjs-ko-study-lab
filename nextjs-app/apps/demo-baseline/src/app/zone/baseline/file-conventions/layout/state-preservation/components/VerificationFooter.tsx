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

  const defaultExpected = "• 클라이언트 상태 보존 중첩 레이아웃의 동작과 기대 결과를 확인합니다."
  const defaultActual = "• 사용자 조작 후 실제 결과를 표시합니다."

  const actualContent =
    propActual !== undefined
      ? propActual
      : isMatched === true
      ? defaultActual
      : isMatched === false
      ? '• 상호작용 실패 또는 불일치가 확인되었습니다. 동작을 다시 확인해 주세요.'
      : '• 상호작용 대기 중 (상단 예제의 조작 요소를 실행해 결과를 확인해 주세요.)'

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="클라이언트 상태 보존 중첩 레이아웃 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
      <DemoDeepDiveCard title="중첩 레이아웃(layout.tsx)의 클라이언트 상태 보존 및 DOM 유지">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              Next.js App Router의 <code>layout.tsx</code>는 하위 라우트 세그먼트가 전환되더라도 언마운트되지 않고 컴포넌트 인스턴스와 클라이언트 상태(<code>useState</code>, 스크롤 위치, 입력 폼 값)를 지속 보존(Preserve)하는 코어 수명 주기를 갖습니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 레이아웃 영역에 위치한 [실시간 장바구니 Drawer 열림 상태]나 [검색 필터 입력값]이 하위 탭(예: 상품 목록 {'<'}-{'>'} 상세 정보) 간 이동 시에도 언마운트되지 않고 그대로 유지되는 동작을 검증합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>SPA 수준의 매끄러운 UX</strong>: 페이지 이동 시 사이드바/GNB/검색창 상태가 초기화되지 않아 사용자 인터랙션 흐름이 끊기지 않습니다.</li>
              <li><strong>불필요한 네트워크/DOM 비용 제거</strong>: 고정 레이아웃 영역의 리렌더링 및 리플로우(Reflow)를 원천 차단하여 렌더링 성능을 극대화합니다.</li>
              <li><strong>미디어 재생 및 폼 입력 연속성</strong>: 오디오/비디오 플레이어나 다단계 주문서 작성 중 하위 단계 전환 시에도 상태가 유실되지 않습니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>음악/팟캐스트 스트리밍 서비스의 하단 고정 미디어 플레이어</li>
              <li>복잡한 상품 검색 필터 사이드바(체크박스 선택 상태 유지)</li>
              <li>챗봇 플로팅 위젯의 대화 내역 및 최소화/최대화 상태 유지</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>화면 진입 시 상태 리셋 필요 시 template.tsx 채택</strong>: 페이지 전환마다 상태를 초기화해야 하거나 진입 애니메이션을 다시 실행해야 하는 영역에는 <code>layout.tsx</code> 대신 <code>template.tsx</code>를 사용해야 합니다.</li>
              <li><strong>전역 상태 라이브러리 남용 방지</strong>: 레이아웃 레벨의 로컬 <code>useState</code>만으로도 탭 이동 간 상태 유지가 가능하므로, 불필요한 Redux/Zustand 전역 상태 오버헤드를 줄일 수 있습니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
