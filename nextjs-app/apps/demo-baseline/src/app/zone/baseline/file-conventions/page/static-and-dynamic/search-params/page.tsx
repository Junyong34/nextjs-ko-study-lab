import { RenderStamp } from '../components/RenderStamp'

/** page 본문에서 searchParams Promise를 await한다 — 쿼리는 요청마다 달라질 수 있으므로 요청마다 렌더링(ƒ)된다. */
export default async function SearchParamsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const query = await searchParams
  return (
    <RenderStamp
      file="search-params/page.tsx"
      api="await searchParams"
      extra={
        <>
          이번 요청의 searchParams: <code>{JSON.stringify(query)}</code>
        </>
      }
    />
  )
}
