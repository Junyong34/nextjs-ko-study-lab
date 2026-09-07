'use client'

import {
  DemoDeepDiveCard,
  DemoPlaygroundCard,
  DemoResetButton,
  ExpectedActualPanel,
} from '@study/demo-kit'
import { useRef, useState } from 'react'

type CloseReason = '대기 중' | '버튼으로 닫음' | 'Escape로 닫음'

export function ArchA11yFocusTrapDemo() {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const firstFieldRef = useRef<HTMLInputElement>(null)
  const closeReasonRef = useRef<CloseReason>('대기 중')
  const [isOpen, setIsOpen] = useState(false)
  const [activeElement, setActiveElement] = useState('없음')
  const [closeReason, setCloseReason] = useState<CloseReason>('대기 중')
  const [focusRestored, setFocusRestored] = useState(false)

  function observeFocus() {
    setActiveElement(document.activeElement?.id || document.activeElement?.tagName.toLowerCase() || '없음')
  }

  function openDialog() {
    closeReasonRef.current = '대기 중'
    setCloseReason('대기 중')
    setFocusRestored(false)
    dialogRef.current?.showModal()
    setIsOpen(true)
    requestAnimationFrame(() => {
      firstFieldRef.current?.focus()
      observeFocus()
    })
  }

  function closeDialog(reason: CloseReason) {
    closeReasonRef.current = reason
    dialogRef.current?.close()
  }

  function handleClosed() {
    setIsOpen(false)
    setCloseReason(closeReasonRef.current)
    requestAnimationFrame(() => {
      triggerRef.current?.focus()
      setFocusRestored(document.activeElement === triggerRef.current)
      observeFocus()
    })
  }

  function reset() {
    if (dialogRef.current?.open) closeDialog('버튼으로 닫음')
    setIsOpen(false)
    setActiveElement('없음')
    setCloseReason('대기 중')
    setFocusRestored(false)
    closeReasonRef.current = '대기 중'
  }

  const actual = `dialog.open: ${isOpen}\n활성 요소: ${activeElement}\n닫기 이유: ${closeReason}\n트리거 포커스 복원: ${focusRestored}`

  return (
    <>
      <DemoPlaygroundCard title="배송지 변경 modal dialog">
        <div className="flex flex-wrap items-center gap-3">
          <button ref={triggerRef} id="open-address-dialog" type="button" onClick={openDialog} className="rounded-md bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700">
            배송지 변경
          </button>
          <DemoResetButton onReset={reset} />
          <span className="text-xs text-zinc-500">현재 포커스: {activeElement}</span>
        </div>

        <dialog
          ref={dialogRef}
          aria-labelledby="address-dialog-title"
          aria-describedby="address-dialog-description"
          onFocusCapture={observeFocus}
          onCancel={() => {
            closeReasonRef.current = 'Escape로 닫음'
          }}
          onClose={handleClosed}
          className="m-auto w-[min(28rem,calc(100%-2rem))] rounded-lg border border-zinc-300 bg-white p-0 text-zinc-900 shadow-xl backdrop:bg-zinc-950/50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
        >
          <form method="dialog" className="space-y-4 p-5" onSubmit={() => { closeReasonRef.current = '버튼으로 닫음' }}>
            <div>
              <h2 id="address-dialog-title" className="text-base font-bold">배송지 변경</h2>
              <p id="address-dialog-description" className="mt-1 text-xs text-zinc-500">주소를 확인한 뒤 적용하세요. Escape로도 닫을 수 있습니다.</p>
            </div>
            <label className="block space-y-1 text-xs font-semibold" htmlFor="address-input">
              새 배송지
              <input ref={firstFieldRef} id="address-input" defaultValue="서울시 중구 세종대로 110" className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 font-normal dark:border-zinc-700 dark:bg-zinc-900" />
            </label>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => closeDialog('버튼으로 닫음')} className="rounded-md border border-zinc-300 px-3 py-2 text-xs font-semibold dark:border-zinc-700">취소</button>
              <button value="apply" className="rounded-md bg-blue-600 px-3 py-2 text-xs font-semibold text-white">적용하고 닫기</button>
            </div>
          </form>
        </dialog>
      </DemoPlaygroundCard>

      <ExpectedActualPanel
        title="modal 포커스 수명주기"
        expected={<span>열림: 포커스가 dialog 내부에 있음<br />닫힘: 호출 버튼으로 포커스 복원</span>}
        actual={actual}
        isMatched={closeReason === '대기 중' ? undefined : !isOpen && focusRestored && activeElement === 'open-address-dialog'}
        description="브라우저의 실제 document.activeElement와 dialog.open 값을 관찰합니다."
      />

      <DemoDeepDiveCard title="showModal()이 만드는 실제 모달 경계">
        <p><code>dialog.showModal()</code>은 단순히 <code>role=&quot;dialog&quot;</code>를 그리는 것과 다릅니다. 브라우저 top layer에 다이얼로그를 올리고 나머지 문서를 inert 상태로 만들어 포커스 이동을 제한합니다.</p>
        <p>Escape는 <code>cancel</code> 이벤트를 거쳐 다이얼로그를 닫습니다. 이 데모는 <code>close</code> 이후 트리거에 명시적으로 포커스를 복원합니다.</p>
        <p>브라우저 기본 동작을 사용해도 제목·설명 연결, 의미 있는 초기 포커스, 닫힌 뒤 복원은 애플리케이션이 책임져야 합니다.</p>
      </DemoDeepDiveCard>
    </>
  )
}
