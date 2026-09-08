'use client'

import {
  DemoDeepDiveCard,
  DemoPlaygroundCard,
  DemoResetButton,
  ExpectedActualPanel,
} from '@study/demo-kit'
import { useEffect, useRef, useState } from 'react'
import { inspectCardFormat } from '../card-format'

const EMPTY_OBSERVATION = {
  invalid: null as string | null,
  describedBy: null as string | null,
  descriptionExists: false,
  descriptionText: '',
  labelConnected: false,
}

export function ArchA11yFormDemo() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [cardNumber, setCardNumber] = useState('')
  const [wasSubmitted, setWasSubmitted] = useState(false)
  const [observation, setObservation] = useState(EMPTY_OBSERVATION)

  const { digitCount, valid } = inspectCardFormat(cardNumber)
  const hasError = wasSubmitted && !valid
  const isValid = wasSubmitted && valid
  const errorText = `숫자 16자리를 입력하세요. 공백과 하이픈만 함께 쓸 수 있습니다. 현재 숫자는 ${digitCount}자리입니다.`
  const helpText = '공백과 하이픈은 숫자 길이 계산에서 제외됩니다.'

  useEffect(() => {
    if (!wasSubmitted || !inputRef.current) return

    const describedBy = inputRef.current.getAttribute('aria-describedby')
    setObservation({
      invalid: inputRef.current.getAttribute('aria-invalid'),
      describedBy,
      descriptionExists: Boolean(describedBy && document.getElementById(describedBy)),
      descriptionText: describedBy ? document.getElementById(describedBy)?.textContent ?? '' : '',
      labelConnected: Array.from(inputRef.current.labels ?? []).some(label => label.htmlFor === inputRef.current?.id && label.textContent?.includes('카드 번호')),
    })
  }, [cardNumber, hasError, wasSubmitted])

  function reset() {
    setCardNumber('')
    setWasSubmitted(false)
    setObservation(EMPTY_OBSERVATION)
    inputRef.current?.focus()
  }

  const actual = wasSubmitted
    ? `aria-invalid: ${observation.invalid ?? '(없음)'}\naria-describedby: ${observation.describedBy ?? '(없음)'}\n설명 요소 연결: ${observation.descriptionExists ? '성공' : '실패'}\n숫자 길이: ${digitCount}\n설명: ${observation.descriptionText}\nlabel 연결: ${observation.labelConnected ? '성공' : '실패'}`
    : '아직 제출하지 않았습니다.'

  return (
    <>
      <DemoPlaygroundCard title="카드 번호 입력과 오류 설명 연결">
        <p className="mb-3 text-xs">Next.js 앱에서 쓰는 HTML·React 접근성 예제입니다. 실제 카드 번호를 입력하지 마세요. 카드 진위나 결제 가능 여부는 검사하지 않습니다.</p>
        <div className="mb-3 flex flex-wrap gap-2">
          {[['빈 값', ''], ['짧은 값', '4242'], ['16자리', '4242424242424242'], ['17자리', '42424242424242424'], ['문자 포함', '4242424242424242a'], ['구분자 포함', '4242-4242 4242-4242']].map(([label, value]) =>
            <button key={label} type="button" className="rounded border px-2 py-1 text-xs" onClick={() => setCardNumber(value!)}>{label} 채우기</button>)}
        </div>
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
              autoComplete="off"
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
                {errorText}
              </p>
            ) : (
              <p id="card-number-help" className="text-xs text-zinc-500">
                {helpText}
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
        isMatched={wasSubmitted ? observation.descriptionExists && observation.labelConnected && observation.describedBy === (hasError ? 'card-number-error' : 'card-number-help') && observation.descriptionText === (hasError ? errorText : helpText) && observation.invalid === (hasError ? 'true' : null) : undefined}
        description="React 상태가 아니라 렌더링된 input의 DOM 속성을 다시 읽어 결과를 판정합니다."
      />

      <DemoDeepDiveCard title="입력과 설명을 연결하는 ARIA 속성">
        <p><code>aria-invalid</code>는 실제 오류일 때만 켜고, <code>aria-describedby</code>는 현재 사용자에게 필요한 도움말 또는 오류 요소의 id를 가리켜야 합니다.</p>
        <p>이 패턴은 HTML·React의 접근성 구현입니다. DOM 연결 검사가 스크린 리더의 음성 출력을 보장하지는 않습니다. 키보드 Tab으로 입력과 버튼에 이동하고 스크린 리더에서 오류 설명을 직접 확인하세요.</p>
        <p><code>role=&quot;alert&quot;</code>는 새 오류가 생긴 순간에만 렌더링합니다. 처음부터 고정 오류를 노출하면 입력 전부터 잘못된 상태를 전달합니다.</p>
      </DemoDeepDiveCard>
    </>
  )
}
