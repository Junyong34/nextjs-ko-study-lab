import { headers } from 'next/headers'
import { RenderStamp } from '../../components/RenderStamp'
import { PRERENDERED_SLUGS } from '../../routes'

/** with-gsp와 같은 목록을 반환한다. 목록이 있어도 본문의 headers()가 동적 렌더링으로 바꾸는지 대조한다. */
export function generateStaticParams() {
  return PRERENDERED_SLUGS.map((slug) => ({ slug }))
}

export default async function WithHeadersPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const userAgent = (await headers()).get('user-agent') ?? '(없음)'
  return (
    <RenderStamp
      file="with-headers/[slug]/page.tsx"
      params={slug}
      api="gsp 있음 + await headers()"
      extra={<>이번 요청의 user-agent: <code className="break-all">{userAgent.slice(0, 80)}</code></>}
    />
  )
}
