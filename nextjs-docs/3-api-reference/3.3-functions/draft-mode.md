# draftMode

- 공식 문서: [draftMode](https://nextjs.org/docs/app/api-reference/functions/draft-mode)
- 상위 메뉴: [Functions](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- 헤드리스 CMS의 미발행 초안 콘텐츠를 미리 볼 수 있도록 지원하는 `draftMode` 비동기 함수의 역할을 이해한다.
- Route Handler를 통해 Draft Mode를 활성화(`enable()`)하고 비활성화(`disable()`)하는 엔드포인트를 구현한다.
- Server Component에서 `isEnabled` 속성을 확인하여 초안 전용 데이터를 안전하게 조건부 렌더링한다.
- [`use cache`](../3.4-directives/use-cache.md) 환경에서 Draft Mode 활성화 시 캐시 바이패스 동작 원리를 파악한다.

## 핵심 개념 및 설명

`draftMode`는 [Draft Mode](../../2-guides/README.md)를 활성화/비활성화하고, Server Component에서 현재 Draft Mode가 켜져 있는지 여부를 확인할 수 있게 해주는 **비동기(async)** 함수다.

```tsx filename="app/page.tsx" switcher
import { draftMode } from 'next/headers'

export default async function Page() {
  const { isEnabled } = await draftMode()

  return (
    <main>
      <h1>블로그 포스트</h1>
      {isEnabled && <div className="draft-banner">현재 초안 미리보기 모드입니다.</div>}
    </main>
  )
}
```

```jsx filename="app/page.js" switcher
import { draftMode } from 'next/headers'

export default async function Page() {
  const { isEnabled } = await draftMode()

  return (
    <main>
      <h1>블로그 포스트</h1>
      {isEnabled && <div className="draft-banner">현재 초안 미리보기 모드입니다.</div>}
    </main>
  )
}
```

> **알아두면 좋은 점**:
>
> - `draftMode`는 **비동기 함수**이므로 반드시 `await` 키워드를 사용하여 호출해야 한다.
> - Draft Mode가 활성화되면 Next.js는 `__prerender_bypass` 쿠키를 설정한다. 이 쿠키 값은 `next build` 시마다 새로 무작위 생성되어 외부에서 유추할 수 없다.
> - `use cache` 스코프 내부에서 `isEnabled` 값을 읽는 것은 허용되나, `enable()`이나 `disable()`을 호출하면 에러가 발생한다.
> - Draft Mode가 켜져 있으면 `use cache`가 적용된 모든 함수와 컴포넌트가 캐시 저장을 건너뛰고 매 요청마다 최신 데이터로 다시 실행된다.

### 메서드 및 속성 (Methods and Properties)

| 항목 | 타입 | 설명 |
|---|---|---|
| `isEnabled` | `boolean` | 현재 Draft Mode가 활성화되어 있는지 여부를 나타낸다. |
| `enable()` | `void` | Route Handler 내부에서 호출하여 바이패스 쿠키를 설정하고 Draft Mode를 활성화한다. |
| `disable()` | `void` | Route Handler 내부에서 호출하여 바이패스 쿠키를 제거하고 Draft Mode를 비활성화한다. |

### 예제

#### 1. Route Handler를 통한 Draft Mode 활성화

```tsx filename="app/api/draft/route.ts" switcher
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  const slug = searchParams.get('slug')

  // CMS 시크릿 토큰 검증
  if (secret !== process.env.DRAFT_SECRET || !slug) {
    return new Response('유효하지 않은 토큰입니다', { status: 401 })
  }

  const draft = await draftMode()
  draft.enable() // Draft Mode 활성화 쿠키 설정

  redirect(`/posts/${slug}`)
}
```

```js filename="app/api/draft/route.js" switcher
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  const slug = searchParams.get('slug')

  if (secret !== process.env.DRAFT_SECRET || !slug) {
    return new Response('유효하지 않은 토큰입니다', { status: 401 })
  }

  const draft = await draftMode()
  draft.enable()

  redirect(`/posts/${slug}`)
}
```

#### 2. Draft Mode 비활성화

```tsx filename="app/api/disable-draft/route.ts" switcher
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET() {
  const draft = await draftMode()
  draft.disable() // 바이패스 쿠키 삭제

  redirect('/')
}
```

```js filename="app/api/disable-draft/route.js" switcher
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET() {
  const draft = await draftMode()
  draft.disable()

  redirect('/')
}
```

> **주의**: 비활성화 엔드포인트로 연결되는 [`<Link>`](../3.2-components/link.md) 컴포넌트에는 반드시 `prefetch={false}`를 지정해야 한다. 그렇지 않으면 브라우저 prefetch로 인해 의도치 않게 미리보기 세션이 조기 종료될 수 있다.

### Version History

| 버전 | 변경 사항 |
|---|---|
| `v15.0.0-RC` | `draftMode`가 비동기 함수(`Promise`)로 변경됨 |
| `v13.4.0` | App Router에 `draftMode` 도입 |

## 예제 및 데모 설계

- Contentful 또는 Sanity CMS의 미리보기 URL 클릭 시 `/api/draft?secret=...&slug=...`로 인입되어 `draftMode().enable()`이 실행되는 전체 프리뷰 파이프라인을 구성한다.
- `isEnabled`가 참일 때 초안 전용 알림 배너와 함께 비활성화 버튼(`<Link href="/api/disable-draft" prefetch={false}>`)을 렌더링하는 데모를 설계한다.
- Draft Mode 상태에서 `use cache` 함수들이 매번 신규 데이터를 가져오는지 검증한다.

## 연습 문제

1. Server Component에서 현재 Draft Mode 활성화 상태를 확인하는 올바른 코드는?
   - A. `const isDraft = draftMode.status`
   - B. `const { isEnabled } = await draftMode()`
   - C. `const isDraft = useDraftMode()`
   - D. `const { active } = cookies().get('draft')`

<details><summary>정답 보기</summary>

정답: **B**  
해설: Next.js 15+에서 `draftMode()`는 비동기 함수이며 `await draftMode()`의 반환 객체에서 `isEnabled` 불리언 값을 읽을 수 있다.
</details>

2. Draft Mode 비활성화 라우트로 이동하는 `<Link>` 태그를 작성할 때 반드시 설정해야 하는 속성은?
   - A. `target="_blank"`
   - B. `prefetch={false}`
   - C. `replace={true}`
   - D. `scroll={false}`

<details><summary>정답 보기</summary>

정답: **B**  
해설: `prefetch={false}`를 설정하지 않으면 링크가 화면에 노출될 때 Next.js가 미리 라우트를 prefetch하여 의도치 않게 비활성화 쿠키 삭제가 먼저 실행될 위험이 있다.
</details>

## 챕터 요약

- `draftMode`는 CMS 초안 콘텐츠를 캐시 없이 미리 볼 수 있게 해주는 `next/headers`의 비동기 함수다.
- Next.js 15+에서는 반드시 `await draftMode()`로 호출한다.
- Route Handler에서 `enable()`과 `disable()`을 호출하여 바이패스 쿠키를 설정/삭제한다.
- Server Component에서는 `const { isEnabled } = await draftMode()`로 활성 상태를 확인한다.
- Draft Mode 활성화 시 `use cache`를 포함한 모든 캐싱이 우회되어 매 요청마다 실시간 렌더링된다.
