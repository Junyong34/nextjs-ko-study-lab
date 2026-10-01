import { connection } from 'next/server'

// 리다이렉트 목적지. destination에 적힌 쿼리(via, campaign)가 실제로 도착했는지 서버에서 그대로 보여준다.
export default async function ArrivedPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await connection()
  const params = await searchParams
  return (
    <main className="space-y-2 p-6 text-sm text-zinc-800 dark:text-zinc-200">
      <h1 className="text-base font-bold">리다이렉트 도착 페이지</h1>
      <p className="text-xs text-zinc-500">redirects()가 이 주소로 보냈다는 뜻입니다. 서버가 받은 쿼리를 그대로 표시합니다.</p>
      <pre className="rounded border border-zinc-200 bg-zinc-50 p-3 font-mono text-xs dark:border-zinc-800 dark:bg-zinc-900">
        {JSON.stringify(params, null, 2)}
      </pre>
    </main>
  )
}
