# permanentRedirect

- 공식 문서: [permanentRedirect](https://nextjs.org/docs/app/api-reference/functions/permanentRedirect)
- 상위 메뉴: [Functions](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- 사용자를 영구적으로 다른 URL로 이동시키고 검색 엔진에 주소 이전을 알리는 `permanentRedirect` 함수의 사용법을 익힌다.
- 영구 리다이렉트 상태코드인 HTTP 308과 임시 리다이렉트인 [`redirect`](./redirect.md)(HTTP 307)의 차이를 이해한다.
- 사용자 ID 변경, URL 구조 개편, 구형 주소 영구 마이그레이션 시나리오에 적합한 리다이렉트 전략을 수립한다.
- Server Component, Route Handler, Server Action에서의 호출 규칙 및 예외 전파 특성을 확인한다.

## 핵심 개념 및 설명

`permanentRedirect`는 엔티티의 표준 주소가 영구적으로 변경되었을 때, 사용자와 검색 엔진 크롤러를 새 URL로 안내하기 위해 **HTTP 308 Permanent Redirect** 상태코드를 반환하는 함수다.

검색 엔진은 308 응답을 받으면 기존 URL의 검색 순위 가치를 새 URL로 이전하고 브라우저 캐시에 반영한다.

```tsx filename="app/user/[username]/page.tsx" switcher
import { permanentRedirect } from 'next/navigation'

export default async function UserProfile({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params
  const user = await db.user.findByUsername(username)

  // 사용자가 아이디(username)를 변경한 경우 영구 리다이렉트
  if (user?.newUsername) {
    permanentRedirect(`/user/${user.newUsername}`)
  }

  return <div>프로필: {user?.name}</div>
}
```

```jsx filename="app/user/[username]/page.js" switcher
import { permanentRedirect } from 'next/navigation'

export default async function UserProfile({ params }) {
  const { username } = await params
  const user = await db.user.findByUsername(username)

  if (user?.newUsername) {
    permanentRedirect(`/user/${user.newUsername}`)
  }

  return <div>프로필: {user?.name}</div>
}
```

> **알아두면 좋은 점**:
>
> - 로그인 여부에 따른 리다이렉트나 일시적인 점검 안내 등 일시적 이동에는 `permanentRedirect` 대신 [`redirect()`](./redirect.md)(HTTP 307)를 사용해야 한다.
> - `permanentRedirect`도 `NEXT_REDIRECT` 특수 에러를 던지므로 `try/catch` 블록 **외부**에서 호출해야 한다.
> - Server Action에서는 JavaScript 환경일 때 클라이언트 사이드 네비게이션을 수행하며, 점진적 향상 폼 제출 시에는 303 응답을 보낸다.

### 매개변수 (Parameters)

```tsx
permanentRedirect(path: string, type?: 'replace' | 'push'): void
```

- `path`: 이동할 새 대상 URL 문자열이다 (상대 경로 및 절대 URL 지원).
- `type` (선택 사항): 히스토리 스택 조작 방식 (`'replace'` 또는 `'push'`). Server Action 기본값은 `'push'`, 그 외는 `'replace'`다.

### 307 vs 308 리다이렉트 비교

| 함수 | HTTP 상태코드 | 캐싱 및 SEO 처리 | 주요 용도 |
|---|---|---|---|
| [`redirect()`](./redirect.md) | **307 Temporary Redirect** | 브라우저/검색엔진이 캐시하지 않음 | 로그인 이동, 권한 분기, 일시적 이벤트 페이지 |
| `permanentRedirect()` | **308 Permanent Redirect** | **브라우저/검색엔진이 영구 캐시 및 인덱스 이전** | 도메인/경로 개편, 사용자명/슬러그 영구 변경 |

### Version History

| 버전 | 변경 사항 |
|---|---|
| `v13.0.0` | App Router에 `permanentRedirect` 도입 |

## 예제 및 데모 설계

- 블로그 글의 slug가 변경되었을 때 이전 slug 접근 시 `permanentRedirect('/posts/' + newSlug)`를 통해 308 응답이 전달되는지 네트워크 탭에서 확인한다.
- `redirect`와 `permanentRedirect`를 각각 호출했을 때 브라우저 캐시 및 재요청 동작의 차이를 비교한다.
- Server Action에서 영구 변경 처리 후 `permanentRedirect`로 이동하는 시나리오를 구성한다.

## 연습 문제

1. `permanentRedirect()`가 반환하는 표준 HTTP 영구 리다이렉트 상태코드는?
   - A. 301
   - B. 302
   - C. 307
   - D. 308

<details><summary>정답 보기</summary>

정답: **D**  
해설: Next.js의 `permanentRedirect()`는 HTTP 요청 메서드를 보존하는 `308 Permanent Redirect` 상태코드를 반환한다.
</details>

2. 다음 중 `permanentRedirect()`를 사용하는 것이 가장 적합한 시나리오는?
   - A. 로그인하지 않은 사용자를 `/login` 화면으로 보낼 때
   - B. 결제 완료 후 결제 결과 확인 페이지로 이동할 때
   - C. 게시물의 고유 URL 슬러그가 영구적으로 변경되어 기존 주소를 새 주소로 완전히 이전할 때
   - D. 모바일 브라우저 접속자를 모바일 전용 페이지로 보낼 때

<details><summary>정답 보기</summary>

정답: **C**  
해설: URL 구조나 슬러그가 영구적으로 바뀌어 검색 엔진 색인과 링크 자산을 새 주소로 완전히 이전해야 할 때 308 `permanentRedirect`를 사용한다.
</details>

## 챕터 요약

- `permanentRedirect`는 영구 리다이렉트(HTTP 308)를 수행하는 `next/navigation`의 함수다.
- 검색 엔진에 영구적인 주소 이전을 알리고 크롤러 색인을 갱신할 때 사용한다.
- 임시 이동인 `redirect`(307)와 구분하여 엔티티 주소 변경, 영구 개편에 적용한다.
- `try/catch` 블록 외부에서 호출해야 하며, `never` 반환 타입을 가진다.
- Server Component, Client Component, Route Handler, Server Action에서 지원된다.
