'use client'
import React from 'react'

interface PropsSerializationDemoProps {
  data: {
    id: string
    name: string
    price: number
    tags: string[]
    createdAt: Date
  }
  onCheck: (isRealDate: boolean, year: number) => void
}

export function PropsSerializationDemo({ data, onCheck }: PropsSerializationDemoProps) {
  const isRealDate = data.createdAt instanceof Date
  const year = isRealDate ? data.createdAt.getFullYear() : NaN

  React.useEffect(() => {
    onCheck(isRealDate, year)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="rounded border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 font-mono text-xs space-y-2">
      <div className="font-bold text-zinc-900 dark:text-zinc-100">// 서버 컴포넌트에서 전달받은 props (클라이언트 컴포넌트에서 수신):</div>
      <pre className="text-emerald-600 dark:text-emerald-400">{JSON.stringify({ ...data, createdAt: data.createdAt.toISOString() }, null, 2)}</pre>
      <div className="border-t border-zinc-100 pt-2 dark:border-zinc-800">
        <div>data.createdAt instanceof Date: <span className={isRealDate ? 'text-emerald-500 font-bold' : 'text-red-500 font-bold'}>{String(isRealDate)}</span></div>
        <div>data.createdAt.getFullYear(): {isRealDate ? year : '(Date 인스턴스 아님)'}</div>
      </div>
    </div>
  )
}
