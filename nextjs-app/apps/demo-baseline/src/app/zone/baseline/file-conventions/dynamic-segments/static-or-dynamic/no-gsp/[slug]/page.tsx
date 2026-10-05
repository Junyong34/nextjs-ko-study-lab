import { RenderStamp } from '../../components/RenderStamp'

/** [slug]만 있고 generateStaticParams도 런타임 API도 없다. 이 조건만으로 동적이 되는지가 실측 대상이다. */
export default async function NoGspPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <RenderStamp file="no-gsp/[slug]/page.tsx" params={slug} api="generateStaticParams 없음" />
}
