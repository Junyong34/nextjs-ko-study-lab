# Draft Mode

- 공식 문서: [Draft Mode](https://nextjs.org/docs/app/guides/draft-mode)
- 상위 메뉴: [Guides](./README.md)
- 전체 목차: [Next.js 학습 문서](../README.md)

## 학습 목표

- Draft Mode가 우회하는 캐시 계층과 다른 방문자에게 미치는 영향을 설명할 수 있다.
- CMS preview URL을 검증하고 Draft Mode cookie를 안전하게 설정할 수 있다.
- 최신 초안 콘텐츠와 preview 표시·종료 흐름을 구현할 수 있다.
- Cache Components와 별도 초안 endpoint에서 `isEnabled`를 사용할 수 있다.

## 핵심 개념 및 설명

### Next.js에서 Draft Mode로 콘텐츠 미리 보기

Draft Mode는 편집자가 revalidation을 기다리지 않고 초안이나 작업 중 콘텐츠가 사이트에서 어떻게 보일지 확인하게 한다. 편집자의 요청은 캐시되거나 prerender된 콘텐츠를 우회해 upstream에서 직접 가져온다. 다른 방문자는 계속 캐시되거나 prerender된 버전을 본다.

CMS가 초안과 게시 콘텐츠를 같은 URL에서 제공하면 기존 데이터 fetching 코드를 바꿀 필요가 없다. URL이 다르면 [별도 초안 endpoint](#cms가-별도-초안-endpoint를-사용하는-경우)처럼 분기한다.

### Draft Mode의 동작

Draft Mode가 활성화된 요청에서는 다음이 적용된다.

- `fetch()`가 Next.js fetch 캐시를 건너뛰고 네트워크를 직접 호출한다.
- `'use cache'` 안의 컴포넌트와 함수가 요청마다 다시 실행되며 결과를 저장하지 않는다.
- `unstable_cache` 읽기와 쓰기도 우회한다.
- 페이지를 ISR 응답 캐시에서 제외하고 `Cache-Control: private, no-cache, no-store, max-age=0, must-revalidate`로 제공한다.

페이지가 정적으로 생성됐거나 캐시에서 제공되거나 ISR로 revalidate되는 경우 모두 같은 효과가 적용된다.

### 이 가이드의 전제와 흐름

CMS가 편집자의 Preview 클릭 때 `/api/draft?secret=XXX&slug=/posts/foo`를 새 탭에서 연다고 가정한다. Next.js 앱은 secret과 slug를 검증하고 Draft Mode를 활성화한 뒤 해당 slug로 이동한다.

1. cookie를 설정하는 Route Handler를 만든다.
2. CMS의 secret과 slug로 Handler를 보호한다.
3. 최신 초안을 읽는 페이지를 렌더링한다.
4. preview banner와 종료 폼을 제공한다.

> **알아두면 좋은 점**: `GET`은 안전한 읽기 전용 메서드가 원칙이다. cookie처럼 이후 요청에 영향을 주는 작업은 `POST`가 적합하다. 다만 CMS가 새 브라우저 탭으로 preview URL을 여는 통합을 가정해 진입 Handler는 `GET`을 사용하고, 종료 흐름은 Server Action 또는 `POST` Route Handler를 사용한다.

### 1단계: Route Handler 만들기

`app/api/draft/route.ts` 같은 Route Handler에서 `draftMode().enable()`을 호출한다.

```tsx filename="app/api/draft/route.ts"
import { draftMode } from 'next/headers'

export async function GET() {
  const draft = await draftMode()
  draft.enable()
  return new Response('Draft mode is enabled')
}
```

`enable()`은 `__prerender_bypass` cookie를 설정한다. 이 cookie를 가진 이후 요청은 위 캐시 계층을 우회한다. 현재 코드는 공개되어 있으므로 다음 단계에서 secret으로 보호한다.

### 2단계: Headless CMS에서 Route Handler 접근

CMS와 Next.js 앱만 아는 secret token을 만들고 다음 preview URL을 설정한다.

```text filename="Terminal"
https://<your-site>/api/draft?secret=<token>&slug=<path>
```

Handler는 secret과 slug를 확인하고, slug가 실제 CMS 콘텐츠인지 검증한 뒤 cookie를 설정한다. open redirect를 막으려면 query string의 slug로 바로 이동하지 않고 CMS에서 조회한 게시물의 경로를 사용한다.

```tsx filename="app/api/draft/route.ts"
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  const slug = searchParams.get('slug')
  if (secret !== 'MY_SECRET_TOKEN' || !slug) {
    return new Response('Invalid token', { status: 401 })
  }
  const post = await getPostBySlug(slug)
  if (!post) return new Response('Invalid slug', { status: 401 })
  const draft = await draftMode()
  draft.enable()
  redirect(post.slug)
}
```

### 3단계: 초안 콘텐츠 미리 보기

Draft Mode가 캐시를 자동으로 우회하므로 같은 endpoint를 쓰는 CMS라면 페이지가 활성 여부를 알 필요가 없다.

```tsx filename="app/posts/[slug]/page.tsx"
async function getPost(slug: string) {
  const res = await fetch(`https://cms.example.com/posts/${slug}`)
  return res.json()
}

export default async function Page({ params }: PageProps<'/posts/[slug]'>) {
  const { slug } = await params
  const post = await getPost(slug)
  return <article><h1>{post.title}</h1>{post.content}</article>
}
```

cookie가 있으면 CMS에서 현재 초안을 직접 가져오고, 없으면 같은 요청이 평소처럼 캐시에서 제공될 수 있다.

### 4단계: preview 표시기 보여주기

`isEnabled`는 편집자가 초안을 보고 있다는 것을 알려주는 신호로 유용하다. 모든 preview 페이지에서 보이도록 root layout에 banner와 종료 폼을 렌더링한다.

```tsx filename="app/preview-banner.tsx"
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

async function exitPreview() {
  'use server'
  const draft = await draftMode()
  draft.disable()
  redirect('/')
}

export async function PreviewBanner() {
  const { isEnabled } = await draftMode()
  if (!isEnabled) return null
  return <aside role="status">Preview mode is on.<form action={exitPreview}><button>Exit preview</button></form></aside>
}
```

종료를 `GET` Route Handler로 만들 수도 있지만 의미상 `POST`가 더 알맞다. `GET`을 쓴다면 `<Link>` 대신 `<form method="GET">`으로 호출한다. `<Link>`는 기본적으로 prefetch하므로 편집자가 클릭하기 전에 cookie를 지울 수 있지만 폼은 prefetch되지 않는다.

### Cache Components와 Draft Mode

`'use cache'` 범위 안에서 `isEnabled`를 읽어 preview 표시기를 그릴 수 있다. Draft Mode의 캐시 우회는 그대로 적용되어 해당 컴포넌트가 초안 요청마다 새 데이터로 실행된다.

> **알아두면 좋은 점**: `draftMode().enable()`과 `disable()`은 캐싱 지시어 범위 안에서 호출할 수 없다. Route Handler나 Server Action에서 토글한다.

### CMS가 별도 초안 endpoint를 사용하는 경우

초안 콘텐츠 URL이나 인증 정보가 다르면 `isEnabled`로 fetch 대상만 분기한다.

```tsx filename="app/posts/[slug]/page.tsx"
import { draftMode } from 'next/headers'

async function getPost(slug: string) {
  const { isEnabled } = await draftMode()
  const baseUrl = isEnabled
    ? 'https://cms.example.com/preview'
    : 'https://cms.example.com/published'
  return fetch(`${baseUrl}/posts/${slug}`).then((res) => res.json())
}
```

두 분기 모두 Draft Mode에서는 캐시를 우회한다. 분기는 읽을 upstream만 선택한다.

### 다음 단계

세부 API는 [`draftMode`](../3-api-reference/3.3-functions/draft-mode.md) 문서를 참고한다.

## 예제 및 데모 설계

- Phase 2에서 게시 콘텐츠와 초안 콘텐츠가 다른 모의 CMS를 만든다.
- secret·slug 검증 성공/실패와 `Set-Cookie`를 네트워크 패널에서 확인한다.
- 일반 사용자와 편집자 세션을 나눠 서로 다른 콘텐츠가 보이는지 비교한다.
- `<Link>`와 종료 폼을 각각 사용해 의도하지 않은 prefetch cookie 삭제를 재현한다.

## 연습 문제

1. Draft Mode가 활성화된 편집자의 `fetch()`는 어떻게 동작하는가?

   - A. Next.js fetch 캐시만 사용한다.
   - B. 캐시를 건너뛰고 upstream을 직접 호출한다.
   - C. 모든 방문자의 캐시를 삭제한다.

   <details><summary>정답 보기</summary>

   정답: B. 해당 cookie를 가진 요청만 캐시 계층을 우회한다.

   </details>

2. preview Handler에서 open redirect를 막는 방법은 무엇인가?

   - A. query의 slug로 즉시 이동한다.
   - B. CMS에서 검증해 조회한 게시물 경로로 이동한다.
   - C. secret 검사를 제거한다.

   <details><summary>정답 보기</summary>

   정답: B. 신뢰할 수 있는 CMS 조회 결과의 경로를 사용한다.

   </details>

3. Draft Mode 종료 `GET` Handler를 호출할 때 `<Link>`를 피하는 이유는 무엇인가?

   - A. `<Link>`가 기본 prefetch해 클릭 전에 cookie를 지울 수 있다.
   - B. `<Link>`는 외부 URL만 지원한다.
   - C. 폼은 cookie를 보낼 수 없다.

   <details><summary>정답 보기</summary>

   정답: A. 종료는 prefetch되지 않는 폼으로 명시적으로 제출하는 편이 안전하다.

   </details>

## 챕터 요약

- Draft Mode는 편집자 요청의 fetch·`use cache`·ISR 캐시를 우회한다.
- 다른 방문자는 계속 게시된 캐시 버전을 본다.
- CMS preview Handler는 secret과 slug를 검증하고 검증된 경로로 이동해야 한다.
- banner와 POST 종료 폼으로 편집자에게 상태와 탈출 경로를 제공한다.
- 별도 초안 endpoint에서는 `isEnabled`로 upstream만 분기한다.
