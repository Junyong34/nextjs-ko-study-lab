'use client'

import React, { useState, useTransition } from 'react'
import {
  DemoContainer,
  DemoGuideCard,
  DemoPlaygroundCard,
  ExpectedActualPanel,
  DemoResetButton,
  DemoDeepDiveCard,
} from '@study/demo-kit'
import { addItem, resetItems, type DemoItem } from './actions'

export default function ServerActionsBasicDemoPage() {
  const [items, setItems] = useState<DemoItem[]>([])
  const [inputText, setInputText] = useState('')
  const [statusMessage, setStatusMessage] = useState<string>(
    '대기 중 (폼에 텍스트를 입력하고 [항목 추가] 버튼을 누르세요)',
  )
  const [isPending, startTransition] = useTransition()

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!inputText.trim() || isPending) return

    const formData = new FormData()
    formData.append('itemText', inputText.trim())

    startTransition(async () => {
      try {
        const result = await addItem(formData)
        if (result.success) {
          setItems(result.items)
          setInputText('')
          setStatusMessage(
            `Server Action 호출 성공! 서버 상태가 갱신되었습니다. (총 ${result.items.length}개)`,
          )
        } else if (result.error) {
          setStatusMessage(`오류: ${result.error}`)
        }
      } catch (error) {
        setStatusMessage(
          `Server Action 오류: ${error instanceof Error ? error.message : String(error)}`,
        )
      }
    })
  }

  const handleReset = async () => {
    startTransition(async () => {
      const result = await resetItems()
      setItems(result.items)
      setInputText('')
      setStatusMessage('상태가 초기화되었습니다.')
    })
  }

  const expectedText =
    '클라이언트 폼에서 Server Action(addItem)을 호출하면 별도 API 라우트 없이 서버 함수가 실행되고, 서버 데이터가 갱신되어 클라이언트에 즉시 반영됨'
  const actualText =
    items.length > 0
      ? `- 등록된 항목 수: ${items.length}개\n- 최신 항목: "${items[0]?.text}" (${items[0]?.createdAt})\n- 전송 상태: Server Action POST 성공`
      : '등록된 항목 없음 (초기 상태)'

  return (
    <DemoContainer className="space-y-6">
      {/* 1단. 상단 가이드 필드셋 */}
      <DemoGuideCard
        title="Server Actions 기본 배관 & 서버-클라이언트 통신"
        concept="별도의 API 엔드포인트(/api/*)를 만들지 않고도, 클라이언트 폼에서 'use server' 함수를 비동기 호출하여 서버 상태를 안전하게 변이(Mutation)합니다."
        steps={[
          {
            step: 1,
            title: '텍스트 입력',
            description: '추가할 항목 텍스트(예: 상품 후기 등록)를 입력합니다.',
            actionBadge: '데이터 작성',
          },
          {
            step: 2,
            title: '항목 추가 클릭',
            description: '[항목 추가]를 눌러 Server Action을 비동기 호출합니다.',
            actionBadge: 'Server Action 호출',
          },
          {
            step: 3,
            title: '서버 데이터 반영 확인',
            description: '서버에서 갱신된 최신 목록이 화면에 즉시 렌더링됩니다.',
            actionBadge: '변이 완료',
          },
        ]}
      />

      {/* 2단. 실습 조작 영역 (DemoPlaygroundCard) */}
      <DemoPlaygroundCard title="Server Action 호출 폼 및 실시간 등록 목록" className="space-y-4">
        {/* 입력 폼 */}
        <form onSubmit={handleFormSubmit} className="flex gap-2">
          <input
            type="text"
            name="itemText"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="추가할 텍스트 입력 (예: Next.js Server Action 테스트)"
            disabled={isPending}
            className="flex-1 rounded-md border border-zinc-300 bg-white px-3.5 py-2 text-xs text-zinc-900 shadow-2xs placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          />
          <button
            type="submit"
            disabled={isPending || !inputText.trim()}
            className="inline-flex items-center justify-center rounded-md bg-zinc-900 px-4 py-2 text-xs font-medium text-white shadow-2xs transition hover:bg-zinc-800 disabled:pointer-events-none disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 cursor-pointer"
          >
            {isPending ? '서버 처리 중...' : '항목 추가'}
          </button>
        </form>

        {/* 등록된 항목 목록 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            <span>서버 등록 항목 리스트 ({items.length}개)</span>
            <span className="font-mono text-[11px] text-zinc-400">
              {isPending ? '통신 중...' : '준비 완료'}
            </span>
          </div>

          {items.length === 0 ? (
            <div className="rounded-md border border-dashed border-zinc-300 p-6 text-center text-xs text-zinc-400 dark:border-zinc-700">
              아직 추가된 항목이 없습니다. 상단 폼에 텍스트를 입력하고 [항목 추가]를 눌러보세요.
            </div>
          ) : (
            <ul className="divide-y divide-zinc-200 rounded-md border border-zinc-200 bg-white shadow-2xs dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-950">
              {items.map((item, index) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between px-3.5 py-2.5 text-xs text-zinc-800 dark:text-zinc-200"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] text-zinc-400">
                      #{items.length - index}
                    </span>
                    <span className="font-medium text-zinc-900 dark:text-zinc-100">
                      {item.text}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                    <span>생성: {item.createdAt}</span>
                    <span className="rounded bg-emerald-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      Server Action
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 초기화 버튼 */}
        <div className="flex justify-end pt-1">
          <DemoResetButton onReset={handleReset} label="목록 초기화" />
        </div>
      </DemoPlaygroundCard>

      {/* 3단. 기대값 vs 실제값 검증 패널 */}
      <ExpectedActualPanel
        title="Server Actions 배관 검증"
        description={statusMessage}
        expected={expectedText}
        actual={actualText}
        isMatched={items.length > 0}
      />

      {/* 4단. 최하단 개념 정리 카드 */}
                        <DemoDeepDiveCard title="Server Actions 기본 배관 & 폼 데이터 변이 메커니즘">
              <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
                  <p>Server Actions는 <code>'use server'</code> 지시어로 선언된 서버 비동기 함수로, 클라이언트에서 별도의 API 엔드포인트(<code>/api/*</code>)를 생성하지 않고도 일반 함수처럼 직접 호출하여 서버 데이터 변이(Mutation)와 상태 갱신을 안전하게 수행하는 Next.js 표준 스펙입니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
                  <p>본 예제에서는 배송지 폼 또는 상품 후기 텍스트를 입력하고 [항목 추가]를 누르면, 클라이언트가 Server Action(<code>addItem</code>)을 POST 요청으로 호출합니다. 서버 함수가 실행되어 서버 메모리 목록이 갱신되고, 갱신된 최신 목록이 클라이언트에 0ms 체감 속도로 즉시 반영됩니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>API 보일러플레이트 제거</strong>: 별도 Route Handler와 DTO 작성 없이 매개변수와 반환값의 완벽한 TypeScript 타입 추론을 제공합니다.</li>
                    <li><strong>보안 자동화</strong>: Next.js가 암호화된 Action ID 검증 및 Origin 헤더 기반 CSRF 방어를 자동으로 수행합니다.</li>
                    <li><strong>점진적 향상(Progressive Enhancement)</strong>: 자바스크립트가 비활성화되거나 로딩 중인 환경에서도 표준 HTML form action으로 기본 동작합니다.</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li>쇼핑몰 주문서 배송지 입력 폼 검증 및 결제 요청</li>
                    <li>상품 상세 페이지의 구매 후기 작성, Q&A 문의 등록</li>
                    <li>장바구니 옵션 변경 및 할인 쿠폰 적용 유효성 검사</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>클라이언트 인자 신뢰 금지</strong>: 클라이언트가 전달한 숨은 input이나 인자값은 변조될 수 있으므로, Server Action 내부에서 반드시 사용자 인증 세션과 데이터 유효성을 재검증해야 합니다.</li>
                    <li><strong>반환 객체 직렬화</strong>: Server Action이 반환하는 모든 데이터는 클라이언트로 직렬화되어 전송되므로, 함수나 민감한 서버 전용 모델 객체가 누출되지 않도록 가공된 DTO만 반환해야 합니다.</li>
                  </ul>
                </div>
              </div>
            </DemoDeepDiveCard>
    </DemoContainer>
  )
}
