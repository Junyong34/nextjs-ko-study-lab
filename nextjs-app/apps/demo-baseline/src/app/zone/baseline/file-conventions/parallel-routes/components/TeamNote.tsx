'use client'
import { useState } from 'react'
export function TeamNote() {
  const [note, setNote] = useState('')
  return <label className="mt-3 block text-sm">운영 메모<input value={note} onChange={e => setNote(e.target.value)} className="mt-1 block w-full rounded border bg-transparent p-2" placeholder="예: 오후 주문 확인" /></label>
}
