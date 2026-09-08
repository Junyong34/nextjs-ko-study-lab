'use client'

import {
  DemoDeepDiveCard,
  DemoPlaygroundCard,
  DemoResetButton,
  ExpectedActualPanel,
} from '@study/demo-kit'
import { useEffect, useRef, useState } from 'react'

const EMPTY_OBSERVATION = {
  invalid: null as string | null,
  describedBy: null as string | null,
  descriptionExists: false,
}

function normalizeCardNumber(value: string) {
  return value.replace(/\D/g, '').slice(0, 16)
}

export function ArchA11yFormDemo() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [cardNumber, setCardNumber] = useState('')
  const [wasSubmitted, setWasSubmitted] = useState(false)
  const [observation, setObservation] = useState(EMPTY_OBSERVATION)

  const digitCount = normalizeCardNumber(cardNumber).length
  const hasError = wasSubmitted && digitCount !== 16
  const isValid = wasSubmitted && digitCount === 16

  useEffect(() => {
    if (!wasSubmitted || !inputRef.current) return

    const describedBy = inputRef.current.getAttribute('aria-describedby')
    setObservation({
      invalid: inputRef.current.getAttribute('aria-invalid'),
      describedBy,
      descriptionExists: Boolean(describedBy && document.getElementById(describedBy)),
    })
  }, [cardNumber, hasError, wasSubmitted])

  function reset() {
    setCardNumber('')
    setWasSubmitted(false)
    setObservation(EMPTY_OBSERVATION)
    inputRef.current?.focus()
  }

  const actual = wasSubmitted
    ? `aria-invalid: ${observation.invalid ?? '(없음)'}\naria-describedby: ${observation.describedBy ?? '(없음)'}\n설명 요소 연결: ${observation.descriptionExists ? '성공' : '실패'}\n숫자 길이: ${digitCount}`
    : '아직 제출하지 않았습니다.'

  return (
    <>
      <DemoPlaygroundCard title="카드 번호 입력과 오류 설명 연결">
        <form
          className="space-y-4"
          noValidate
          onSubmit={(event) => {
            event.preventDefault()
            setWasSubmitted(true)
          }}
        >
          <div className="space-y-1.5">
            <label htmlFor="card-number" className="block text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              카드 번호
            </label>
            <input
              ref={inputRef}
              id="card-number"
              name="cardNumber"
              value={cardNumber}
              onChange={(event) => setCardNumber(event.target.value)}
              inputMode="numeric"
              autoComplete="cc-number"
              aria-invalid={hasError || undefined}
              aria-describedby={hasError ? 'card-number-error' : 'card-number-help'}
              className={`w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 ${
                hasError
                  ? 'border-rose-500 focus:ring-rose-200 dark:focus:ring-rose-900'
                  : 'border-zinc-300 focus:ring-blue-200 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:ring-blue-900'
              }`}
              placeholder="4242 4242 4242 4242"
            />
            {hasError ? (
              <p id="card-number-error" role="alert" className="text-xs font-medium text-rose-600 dark:text-rose-400">
                카드 번호 숫자 16자리를 입력해 주세요. 현재 {digitCount}자리입니다.
              </p>
            ) : (
              <p id="card-number-help" className="text-xs text-zinc-500">
                공백과 하이픈은 숫자 길이 계산에서 제외됩니다.
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <button type="submit" className="rounded-md bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700">
              카드 번호 확인
            </button>
            <DemoResetButton onReset={reset} />
          </div>
          {isValid ? <p role="status" className="text-xs font-medium text-emerald-700 dark:text-emerald-400">입력 형식이 유효합니다.</p> : null}
        </form>
      </DemoPlaygroundCard>

      <ExpectedActualPanel
        title="렌더링된 ARIA 연결"
        expected={<span>{hasError ? 'aria-invalid=true, aria-describedby=card-number-error, 오류 요소 존재' : '유효한 입력은 aria-invalid가 없고 도움말과 연결'}</span>}
        actual={actual}
        isMatched={wasSubmitted ? observation.descriptionExists && observation.invalid === (hasError ? 'true' : null) : undefined}
        description="React 상태가 아니라 렌더링된 input의 DOM 속성을 다시 읽어 결과를 판정합니다."
      />

      <DemoDeepDiveCard title="ARIA는 입력 상태를 설명하는 DOM 계약입니다">
        <p><code>aria-invalid</code>는 실제 오류일 때만 켜고, <code>aria-describedby</code>는 현재 사용자에게 필요한 도움말 또는 오류 요소의 id를 가리켜야 합니다.</p>
        <p>이 패턴은 브라우저·React의 접근성 구현입니다. Next.js는 별도로 route announcer와 JSX 접근성 lint를 제공하므로, 프레임워크 기능과 위젯 수준 접근성을 구분해서 적용해야 합니다.</p>
        <p><code>role=&quot;alert&quot;</code>는 새 오류가 생긴 순간에만 렌더링합니다. 처음부터 고정 오류를 노출하면 입력 전부터 잘못된 상태를 전달합니다.</p>
      </DemoDeepDiveCard>
    </>
  )
}
