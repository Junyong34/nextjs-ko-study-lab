import { RenderStamp } from '../../components/RenderStamp'
import { PRERENDERED_SLUGS } from '../../routes'

/** 빌드 때 만들 slug 목록. 목록 밖의 값(dynamicParams 기본값 true)은 요청 때 렌더링된다. */
export function generateStaticParams() {
  return PRERENDERED_SLUGS.map((slug) => ({ slug }))
}

export default async function WithGspPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <RenderStamp file="with-gsp/[slug]/page.tsx" params={slug} api="generateStaticParams 있음" />
}
