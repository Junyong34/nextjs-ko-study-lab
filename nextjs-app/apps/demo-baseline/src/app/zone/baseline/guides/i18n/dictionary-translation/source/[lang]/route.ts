import { LOCALES } from '../../locales'
import { getDictionary, hasLocale } from '../../dictionaries'

/**
 * 검증 전용 엔드포인트: 사전 원본 JSON을 그대로 돌려준다.
 * 브라우저의 검증 스크립트가 "SSR HTML의 번역 문자열 == 사전 원본"을 대조하고, 같은 문자열이
 * JS 청크에 있는지 찾을 때 쓴다. 검색어를 번들에 넣지 않으려고 요청 시에만 받아 온다.
 * 실제 서비스의 사전 패턴에는 필요 없는 파일이다.
 */
export const dynamic = 'force-static'

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }))
}

export async function GET(_request: Request, { params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!hasLocale(lang)) return Response.json({ error: `unsupported lang: ${lang}` }, { status: 404 })
  return Response.json(await getDictionary(lang))
}
