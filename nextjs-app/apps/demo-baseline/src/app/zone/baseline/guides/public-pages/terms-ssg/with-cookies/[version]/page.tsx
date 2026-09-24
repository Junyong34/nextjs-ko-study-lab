import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { RenderStamp } from '../../components/RenderStamp'
import { TermsArticle } from '../../components/TermsArticle'
import { AGREED_COOKIE, TERMS_DOCS, findTerms } from '../../terms'

/**
 * 흔한 실수를 재현한 대조 라우트: documents/와 같은 generateStaticParams를 두었지만,
 * "동의했는지"를 서버에서 보여주려고 page 본문에서 cookies()를 호출한다.
 * 요청 시점 API가 섞이는 순간 generateStaticParams가 있어도 이 라우트는 ƒ(Dynamic)가 된다.
 */
export function generateStaticParams() {
  return TERMS_DOCS.filter((d) => d.lang === 'ko').map(({ version }) => ({ version }))
}

export const dynamicParams = false

export default async function TermsWithCookiesPage({ params }: { params: Promise<{ version: string }> }) {
  const { version } = await params
  const doc = findTerms('ko', version)
  if (!doc) notFound()

  const agreed = (await cookies()).get(AGREED_COOKIE)?.value

  return (
    <TermsArticle
      doc={doc}
      aside={
        <div className="space-y-2">
          <RenderStamp file="with-cookies/[version]/page.tsx" />
          <p className="rounded border border-dashed border-rose-300 px-3 py-2 text-[11px] text-rose-700 dark:border-rose-900 dark:text-rose-300">
            서버가 cookies()로 읽은 동의 상태: <strong className="font-mono">{agreed ? `v${agreed}에 동의함` : '동의 기록 없음'}</strong>
          </p>
        </div>
      }
    />
  )
}
