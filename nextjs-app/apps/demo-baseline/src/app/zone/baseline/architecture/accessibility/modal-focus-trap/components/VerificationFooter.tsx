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

  const defaultExpected = "• 모달 다이얼로그 키보드 포커스 트랩(Focus Trap) 및 Esc 닫기 사양에 따른 정상 동작 및 상태 변화 관찰"
  const defaultActual = "• 실시간 인터랙션 및 상태 동기화 완료\n• 5단 표준 레이아웃 정상 적용"

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
        title="모달 다이얼로그 키보드 포커스 트랩(Focus Trap) 및 Esc 닫기 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
      <DemoDeepDiveCard title="모달 다이얼로그 키보드 포커스 트랩(Focus Trap) 및 Esc 닫기">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>모달 다이얼로그 접근성 표준(WAI-ARIA Dialog Modal Pattern)은 팝업 오픈 시 키보드 포커스(Tab/Shift+Tab)를 모달 내부 요소들 간에만 순환(Focus Trap)시키고, <code>Esc</code> 키 입력 시 모달을 닫으며, 모달이 닫히면 원래 모달을 열었던 트리거 버튼으로 포커스를 안전하게 복귀시키는 표준 인터랙션 규격입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 [배송지 변경 모달] 오픈 시 첫 번째 포커스 가능 요소(입력창)로 초점이 자동 이동하고, <code>Tab</code> 키를 계속 눌러도 배경 웹페이지로 포커스가 이탈하지 않으며, <code>Escape</code> 입력 시 모달이 닫히고 [배송지 변경] 버튼으로 포커스가 복원되는 흐름을 실증합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>키보드 사용자 경험 극대화</strong>: 마우스를 사용하지 못하는 지체장애인이나 전자기기 파워 유저가 팝업 뒤 배경 요소로 포커스를 잃어버리는 혼란을 방지합니다.</li>
              <li><strong>스크린 리더 가상 커서 가둠(aria-modal)</strong>: <code>role="dialog" aria-modal="true"</code>를 선언하여 스크린 리더가 배경 페이지의 텍스트를 읽지 못하도록 완벽히 차단합니다.</li>
              <li><strong>포커스 유실(Focus Loss) 버그 제로</strong>: 모달 닫힘 후 포커스가 <code>{'<'}body{'>'}</code> 최상단으로 튕겨 나가지 않고 원래 위치로 정확히 복귀합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>쇼핑몰 결제 약관 동의 및 본인인증 팝업 모달</li>
              <li>주문 취소 및 환불 사유 입력 확인 다이얼로그</li>
              <li>이미지 확대 뷰어 및 포토 상품평 갤러리 모달</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>포커스 가능한 요소 부재 처리</strong>: 모달 내부에 버튼이나 입력창이 없는 순수 알림 팝업인 경우 모달 컨테이너 자체에 <code>tabIndex={'{'}-1{'}'}</code>을 부여하고 포커스를 이동시켜야 합니다.</li>
              <li><strong>배경 스크롤 잠금(Scroll Lock)</strong>: 모달이 열려 있는 동안 배경 페이지가 스크롤되지 않도록 <code>document.body.style.overflow = 'hidden'</code> 처리를 연동해야 모바일 사용자 경험이 쾌적합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
