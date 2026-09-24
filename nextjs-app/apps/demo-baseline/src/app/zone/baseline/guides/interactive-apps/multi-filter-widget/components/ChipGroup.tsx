'use client'

import { startTransition, useOptimistic } from 'react'

interface ChipGroupProps {
  label: string
  items: { value: string; label: string }[]
  /** 현재 URL 기준 선택값 (서버가 확정한 값) */
  value: string[]
  /** true면 다중 선택, false면 단일 선택(같은 칩을 다시 누르면 해제) */
  multiple?: boolean
  /** 이 콜백은 ChipGroup의 transition 안에서 실행된다 (Action 접미사 관례) */
  changeAction: (next: string[]) => void | Promise<void>
}

/**
 * 공식 가이드 Interactive apps Step 3의 ChipGroup 패턴.
 * - 선택 칩: useOptimistic으로 클릭한 프레임에 바로 반영
 * - 대기 상태: useOptimistic(false)를 data-pending 속성으로 노출 → 조상은 CSS(group-has-data-pending:)로 반응
 * transition이 끝나면(= 새 URL의 서버 렌더가 커밋되면) 두 값 모두 서버가 준 prop으로 돌아간다.
 */
export function ChipGroup({ label, items, value, multiple = false, changeAction }: ChipGroupProps) {
  const [optimisticValue, setOptimisticValue] = useOptimistic(value)
  const [isPending, setIsPending] = useOptimistic(false)

  function handleClick(itemValue: string) {
    const selected = optimisticValue.includes(itemValue)
    const next = multiple
      ? selected
        ? optimisticValue.filter((v) => v !== itemValue)
        : [...optimisticValue, itemValue]
      : selected
        ? []
        : [itemValue]

    startTransition(async () => {
      setOptimisticValue(next)
      setIsPending(true)
      await changeAction(next)
    })
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label={label} data-pending={isPending ? '' : undefined}>
      <span className="w-14 shrink-0 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">{label}</span>
      {items.map((item) => {
        const active = optimisticValue.includes(item.value)
        return (
          <button
            key={item.value}
            type="button"
            aria-pressed={active}
            onClick={() => handleClick(item.value)}
            className={`cursor-pointer rounded-md border px-2.5 py-1 text-xs font-medium transition ${
              active
                ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900'
                : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300'
            }`}
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
}
