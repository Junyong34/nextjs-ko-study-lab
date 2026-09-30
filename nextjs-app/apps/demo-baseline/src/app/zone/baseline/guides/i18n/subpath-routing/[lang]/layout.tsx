import React from 'react'
import { notFound } from 'next/navigation'
import { LOCALES, hasLocale } from '../locales'

/**
 * 지원 언어를 알려주면 next build가 언어마다 하위 page를 미리 만든다(●).
 * 목록 밖 [lang](예: fr)은 요청 시 렌더링되지만 아래 hasLocale 검사에서 404로 끝난다.
 */
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }))
}

/**
 * 이 layout은 root layout이 아니라 중첩 layout이라 <html lang>은 바꿀 수 없다(root layout이 app/layout.tsx에 있음).
 * 실제 앱처럼 [lang]을 root layout으로 두면 <html lang={lang}>을 여기서 설정한다. 여기서는 래퍼의 lang 속성으로 대신한다.
 */
export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()

  return (
    <div lang={lang} data-route-lang={lang} className="space-y-3">
      {children}
    </div>
  )
}
