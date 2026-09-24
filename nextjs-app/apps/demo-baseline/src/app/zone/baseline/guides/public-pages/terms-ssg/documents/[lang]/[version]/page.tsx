import { notFound } from 'next/navigation'
import { AgreementBadge } from '../../../components/AgreementBadge'
import { RenderStamp } from '../../../components/RenderStamp'
import { TermsArticle } from '../../../components/TermsArticle'
import { TERMS_DOCS, findTerms } from '../../../terms'

/**
 * 저장소에 있는 (lang, version) 조합을 전부 반환한다.
 * next build가 이 목록만큼 page를 실행해 HTML을 만들고, 라우트 표에 ●(SSG)로 표시한다.
 */
export function generateStaticParams() {
  return TERMS_DOCS.map(({ lang, version }) => ({ lang, version }))
}

/** 목록에 없는 조합(없는 버전, 번역되지 않은 언어)은 요청 시 렌더링하지 않고 404로 끝낸다. */
export const dynamicParams = false

export default async function TermsDocumentPage({ params }: { params: Promise<{ lang: string; version: string }> }) {
  const { lang, version } = await params
  const doc = findTerms(lang, version)
  // dynamicParams=false라 목록 밖 값은 여기 오지 않는다. 데이터와 목록이 어긋났을 때를 위한 방어선이다.
  if (!doc) notFound()

  return (
    <TermsArticle
      doc={doc}
      aside={
        <div className="space-y-2">
          <RenderStamp file="documents/[lang]/[version]/page.tsx" />
          <AgreementBadge version={doc.version} />
        </div>
      }
    />
  )
}
