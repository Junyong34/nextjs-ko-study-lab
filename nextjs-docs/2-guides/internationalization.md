# Internationalization

- 공식 문서: [Internationalization](https://nextjs.org/docs/app/guides/internationalization)
- 상위 메뉴: [Guides](./README.md)
- 전체 목차: [Next.js 학습 문서](../README.md)

## 학습 목표

- locale, 국제화 라우팅, localization의 역할을 구분한다.
- `Accept-Language`를 지원 locale과 대조해 sub-path로 redirect한다.
- 다이나믹 `[lang]` segment와 서버 전용 dictionary를 안전하게 구성한다.
- `next/root-params`와 `generateStaticParams`의 적용 범위를 설명한다.

## 핵심 개념 및 설명

Next.js는 여러 언어를 지원하도록 콘텐츠 라우팅과 렌더링을 구성할 수 있다. 사이트를 locale에 맞추는 작업에는 번역된 콘텐츠를 제공하는 localization과 locale을 나타내는 라우트가 모두 포함된다.

### 용어

- **locale**: 언어와 서식 선호를 나타내는 식별자다. 사용자의 언어와 지역을 함께 담을 수 있다.
  - `en-US`: 미국에서 사용하는 영어
  - `nl-NL`: 네덜란드에서 사용하는 네덜란드어
  - `nl`: 특정 지역을 지정하지 않은 네덜란드어

### 라우팅 개요

브라우저의 언어 선호를 사용해 locale을 고르는 것을 권장한다. 사용자가 선호 언어를 바꾸면 요청의 `Accept-Language` 헤더가 달라진다. `Negotiator`로 선호 목록을 읽고 `@formatjs/intl-localematcher`로 지원 locale과 대조할 수 있다.

```ts
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'

const headers = { 'accept-language': 'en-US,en;q=0.5' }
const languages = new Negotiator({ headers }).languages()
const locales = ['en-US', 'nl-NL', 'nl']

match(languages, locales, 'en-US') // 'en-US'
```

국제화 라우트는 `/fr/products` 같은 sub-path나 `my-site.fr/products` 같은 도메인을 사용할 수 있다. locale이 없는 요청은 [Proxy](../3-api-reference/3.1-file-conventions/proxy.md)에서 선택한 locale 경로로 redirect한다.

```ts
import { NextResponse } from 'next/server'

const locales = ['en-US', 'nl-NL', 'nl']

export function proxy(request) {
  const { pathname } = request.nextUrl
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return

  request.nextUrl.pathname = `/${getLocale(request)}${pathname}`
  return NextResponse.redirect(request.nextUrl)
}

export const config = { matcher: ['/((?!_next).*)'] }
```

`app/`의 모든 특수 파일을 `app/[lang]` 아래에 두면 Router가 locale을 다이나믹 segment로 처리하고 모든 layout과 page에 `lang`을 전달한다. root layout도 `app/[lang]/layout.js`에 둘 수 있다.

```tsx
export default async function Page({ params }: PageProps<'/[lang]'>) {
  const { lang } = await params
  return <p>{lang}</p>
}
```

> **알아두면 좋은 점**: [`PageProps`](../3-api-reference/3.1-file-conventions/page.md)와 [`LayoutProps`](../3-api-reference/3.1-file-conventions/layout.md)는 라우트 파라미터를 강하게 타입 지정하는 전역 TypeScript helper다.

### Localization

사용자 locale에 따라 표시 문자열을 바꾸는 localization은 Next.js에만 있는 패턴이 아니다. 언어별 dictionary를 만들고 키를 번역 문자열에 대응시킨다.

```json
{
  "products": {
    "cart": "Add to Cart"
  }
}
```

dictionary는 다이나믹 import로 요청한 locale만 불러온다. `hasLocale` type guard는 `string`인 `lang`을 지원 locale로 좁히고 번역이 없는 경로에는 runtime 오류 대신 404를 반환하게 한다.

```ts
import 'server-only'

const dictionaries = {
  en: () => import('./dictionaries/en.json').then((module) => module.default),
  nl: () => import('./dictionaries/nl.json').then((module) => module.default),
}

export type Locale = keyof typeof dictionaries
export const hasLocale = (locale: string): locale is Locale =>
  locale in dictionaries
export const getDictionary = async (locale: Locale) => dictionaries[locale]()
```

`app/`의 layout과 page는 기본적으로 [Server Component](../1-getting-started/server-and-client-components.md)다. dictionary 코드는 서버에서만 실행되며 결과 HTML만 브라우저로 보내므로 번역 파일 크기가 클라이언트 JavaScript 번들에 들어가지 않는다.

### 앱 전체에서 locale 공유하기

공유 데이터 유틸리티나 깊은 Server Component까지 `lang` prop을 계속 전달하는 대신 [`next/root-params`](../3-api-reference/3.3-functions/next-root-params.md)를 사용할 수 있다. `[lang]`이 root layout 위의 다이나믹 segment이므로 `next/root-params`가 `lang()` getter를 제공한다.

```ts
import { lang } from 'next/root-params'
import { notFound } from 'next/navigation'

export const getDictionary = async () => {
  const locale = await lang()
  if (!hasLocale(locale)) notFound()
  return dictionaries[locale]()
}
```

> **알아두면 좋은 점**: `next/root-params`를 import한 파일은 `import 'server-only'`가 없어도 된다. Client Component에서 사용하면 빌드 시 import가 실패한다.

호출하는 page와 컴포넌트는 인자 없이 `getDictionary()`를 사용한다.

> **알아두면 좋은 점**: root parameter getter는 Server Component와 서버 유틸리티에서 동작하지만 Client Component, Server Action, Route Handler에서는 동작하지 않는다. 캐싱과 자세한 범위는 [`next/root-params`](../3-api-reference/3.3-functions/next-root-params.md)를 확인한다.

### 정적 렌더링

`generateStaticParams`로 지원 locale 경로를 빌드 시점에 생성할 수 있다. root layout에 두면 전체 앱의 locale segment에 적용할 수 있다.

```tsx
export async function generateStaticParams() {
  return [{ lang: 'en-US' }, { lang: 'de' }]
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<'/[lang]'>) {
  return (
    <html lang={(await params).lang}>
      <body>{children}</body>
    </html>
  )
}
```

### 자료

- [Minimal i18n routing and translations](https://github.com/vercel/next.js/tree/canary/examples/i18n-routing)
- [`next-intl`](https://next-intl.dev/)
- [`next-international`](https://github.com/QuiiBz/next-international)
- [`next-i18n-router`](https://github.com/i18nexus/next-i18n-router)
- [`paraglide-next`](https://inlang.com/m/osslbuzt/paraglide-next-i18n)
- [`lingui`](https://lingui.dev/)
- [`tolgee`](https://tolgee.io/apps-integrations/next)
- [`next-intlayer`](https://intlayer.org/doc/environment/nextjs)
- [`gt-next`](https://generaltranslation.com/en/docs/next)

#### root-params

root 수준 라우트 파라미터 접근은 [`next/root-params` API Reference](../3-api-reference/3.3-functions/next-root-params.md)를 참고한다.

## 예제 및 데모 설계

- Phase 2에서 `Accept-Language`를 `en-US`, `nl-NL`, `nl`과 대조하고 locale 없는 경로를 redirect한다.
- `app/[lang]`의 dictionary를 다이나믹 import하고 지원하지 않는 locale이 404가 되는지 확인한다.
- 중첩 Server Component에서 `lang()`을 직접 읽어 prop drilling 제거 전후를 비교한다.
- `generateStaticParams`가 만든 locale별 HTML과 `<html lang>` 속성을 빌드 결과에서 확인한다.

## 연습 문제

1. `nl-NL`이 나타내는 것은 무엇인가?

   - A. 특정 지역 없는 네덜란드어
   - B. 네덜란드에서 사용하는 네덜란드어 locale
   - C. 도메인 이름

   <details><summary>정답 보기</summary>

   정답: B. locale은 언어와 지역 선호를 함께 나타낼 수 있다.

   </details>

2. `next/root-params` getter를 사용할 수 없는 곳은 어디인가?

   - A. Server Component
   - B. 서버 유틸리티
   - C. Client Component

   <details><summary>정답 보기</summary>

   정답: C. root parameter getter는 Client Component, Server Action, Route Handler에서 동작하지 않는다.

   </details>

3. dictionary의 다이나믹 import가 클라이언트 번들 크기에 영향을 주지 않는 이유는 무엇인가?

   - A. layout과 page가 기본적으로 Server Component이기 때문이다.
   - B. 모든 JSON을 브라우저가 캐시하기 때문이다.
   - C. Proxy가 번역을 제거하기 때문이다.

   <details><summary>정답 보기</summary>

   정답: A. dictionary 코드는 서버에서 실행되고 렌더링 결과만 브라우저로 전달된다.

   </details>

## 챕터 요약

- 국제화는 locale 선택과 국제화 라우팅, 번역 콘텐츠를 함께 설계한다.
- 브라우저의 `Accept-Language`를 지원 locale과 대조해 경로나 도메인을 선택할 수 있다.
- `app/[lang]`은 locale을 모든 layout과 page에 전달하는 다이나믹 segment다.
- 서버 전용 dictionary는 번역 파일을 클라이언트 JavaScript 번들에서 제외한다.
- `next/root-params`와 `generateStaticParams`로 locale 전달과 정적 생성을 단순화한다.
