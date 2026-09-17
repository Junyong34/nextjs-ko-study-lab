'use client'
import Form from 'next/form'
import { useFormStatus } from 'react-dom'
import { DemoResetButton } from '@study/demo-kit'
import { useSearchLayoutState } from './SearchLayoutState'
function Submit() {
  const { pending } = useFormStatus()
  return <button disabled={pending} className="rounded bg-blue-600 px-4 py-2 text-white">{pending ? '검색 중…' : '검색'}</button>
}
export function FormSearchClient({ query }: { query: string }) {
  const { note, setNote } = useSearchLayoutState()
  return <div className="space-y-3 text-sm">
    <label className="block">검색해도 유지할 메모
      <input value={note} onChange={e => setNote(e.target.value)} placeholder="예: 무선 제품 비교 중" className="mt-1 block w-full rounded border bg-transparent p-2" />
    </label>
    <Form action="/zone/baseline/components/form-component" className="flex flex-wrap items-end gap-2">
      <label className="min-w-0 flex-1">상품명 또는 태그
        <input key={query} name="q" defaultValue={query} placeholder="키보드, 무선, 없는상품" className="mt-1 block w-full rounded border bg-transparent p-2" />
      </label>
      <Submit />
    </Form>
    <div className="flex flex-wrap gap-2">
      <DemoResetButton label="실습 화면 새로고침" />
      <DemoResetButton onReset={() => window.location.assign('/zone/baseline/components/form-component')} />
    </div>
  </div>
}
