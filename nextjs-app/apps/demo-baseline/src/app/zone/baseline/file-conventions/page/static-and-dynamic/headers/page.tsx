import { headers } from 'next/headers'
import { RenderStamp } from '../components/RenderStamp'

/** page 본문에서 headers()를 호출한다 — 요청 헤더는 빌드 시점에 알 수 없으므로 요청마다 렌더링(ƒ)된다. */
export default async function HeadersPage() {
  const userAgent = (await headers()).get('user-agent') ?? '(없음)'
  return (
    <RenderStamp
      file="headers/page.tsx"
      api="await headers()"
      extra={
        <>
          이번 요청의 user-agent: <code className="break-all">{userAgent.slice(0, 80)}</code>
        </>
      }
    />
  )
}
