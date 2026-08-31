'use client'
import React, { useEffect, useRef, useState } from 'react'

interface StyleRegistryDemoProps {
  onCheck: (backgroundColor: string, color: string) => void
}

export function StyleRegistryDemo({ onCheck }: StyleRegistryDemoProps) {
  const btnRef = useRef<HTMLButtonElement>(null)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (btnRef.current) {
      // useServerInsertedHTML로 주입된 <style>이 실제 브라우저 계산 스타일에 반영됐는지 확인한다.
      const computed = getComputedStyle(btnRef.current)
      onCheck(computed.backgroundColor, computed.color)
      setChecked(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="rounded border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 space-y-3">
      <div className="text-xs text-zinc-500">이 버튼은 useServerInsertedHTML로 주입된 .demo-css-in-js-btn 클래스를 사용합니다:</div>
      <button ref={btnRef} className="demo-css-in-js-btn cursor-pointer">
        CSS-in-JS 버튼
      </button>
      <div className="font-mono text-[11px] text-zinc-500">{checked ? '계산된 스타일 확인 완료 (아래 검증 패널 참고)' : '확인 중...'}</div>
    </div>
  )
}
