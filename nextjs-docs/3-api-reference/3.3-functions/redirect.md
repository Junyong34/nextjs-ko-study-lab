# redirect

- 공식 문서: [redirect](https://nextjs.org/docs/app/api-reference/functions/redirect)
- 상위 메뉴: [Functions](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- `redirect` 함수를 사용하여 Server Component, Server Action, Route Handler에서 사용자를 다른 URL로 안전하게 리다이렉트하는 방법을 익힌다.
- Next.js가 기본 리다이렉트 상태 코드로 302/303 대신 **307(Temporary Redirect)**을 채택한 이유와 기술적 차이를 이해한다.
- `redirect`가 내부적으로 `NEXT_REDIRECT` 에러를 던져(throw) 흐름을 중단하는 메커니즘과 `try/catch` 블록 내에서의 올바른 처리 패턴을 파악한다.
- `RedirectType`(`'replace'` vs `'push'`) 옵션을 통해 브라우저 히스토리 스택을 제어한다.

## 핵심 개념 및 설명

`redirect` 함수는 Server Component, Server Action, Route Handler에서 호출되어 즉시 다른 URL로 페이지를 이동시킨다.

```tsx filename="app/team/[id]/page.tsx"
import { redirect } from 'next/navigation'

async function fetchTeam(id: string) {
  const res = await fetch(`https://api.example.com/team/${id}`)
  if (!res.ok) {
    redirect('/login')
  }
  return res.json()
}

export default async function Profile({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const team = await fetchTeam(id)
  return <div>{team.name}</div>
}
```

---

### 매개변수 (Parameters)

`redirect(url, type)`

1. **`url`**: 이동할 대상 경로 문자열 (상대 경로 `/login` 또는 완전한 절대 URL `https://example.com/login`)
2. **`type`** (선택 사항): Server Action 내에서 브라우저 히스토리 스택을 제어하는 리다이렉트 유형
   - `'replace'` (기본값): 현재 URL을 히스토리 스택에서 교체하여 '뒤로 가기' 시 이전 페이지로 이동
   - `'push'`: 새 URL을 히스토리 스택에 추가

---

### 동작 메커니즘 및 주의사항

#### 1. 에러 기반 제어 흐름 (`NEXT_REDIRECT`)

`redirect()`는 내부적으로 `NEXT_REDIRECT` 특수 에러를 `throw`하여 컴포넌트 렌더링이나 비동기 작업의 실행을 즉시 중단하고 리다이렉트를 시작한다.

> **알아두면 좋은 점 (try/catch 사용 시 주의)**:
>
> `redirect()`를 `try...catch` 블록 내부에서 호출하면 `catch` 문에 의해 `NEXT_REDIRECT` 에러가 잡혀 리다이렉트가 취소될 수 있다. 따라서 **`try/catch` 블록 외부에서 호출**하거나 `catch` 블록에서 `isRedirectError` 또는 `unstable_rethrow`로 다시 던져야 한다.

```tsx filename="app/actions.ts"
'use server'

import { redirect } from 'next/navigation'

export async function createUser(formData: FormData) {
  try {
    await db.user.create({ data: { name: formData.get('name') } })
  } catch (error) {
    return { error: '생성 실패' }
  }

  // try/catch 블록 외부에서 호출
  redirect('/dashboard')
}
```

#### 2. HTTP 307(Temporary Redirect)을 사용하는 이유 (FAQ)

Next.js는 기본 리다이렉트 상태 코드로 전통적인 `302 Found` 대신 **`307 Temporary Redirect`**를 사용한다.

- `302`는 브라우저에 따라 POST 요청을 GET 요청으로 임의 변경하는 문제가 있었다.
- `307`은 클라이언트가 **원래의 HTTP 메서드(POST, GET 등)와 요청 본문을 그대로 유지한 채 리다이렉트 대상 URL로 재요청**하도록 보장하므로 데이터 변경 흐름에서 훨씬 안전하다.
- 영구 리다이렉트가 필요할 때는 [`permanentRedirect`](./permanentRedirect.md)(308)를 사용한다.

---

### 실행 컨텍스트별 동작 비교

| 컨텍스트 | 상태 코드 / 동작 |
|---|---|
| **Server Component** | 렌더링 중 즉시 중단되고 클라이언트에 307 리다이렉트 응답을 반환 |
| **Server Action** | 액션 완료 후 클라이언트 사이드에서 대상 경로로 즉시 내비게이션 |
| **Route Handler** | `307 Temporary Redirect` HTTP 응답 헤더(`Location`)를 즉시 반환 |
| **Client Component** | 이벤트 핸들러 대신 `useRouter().push()`를 권장하며, 렌더링 중 호출 시 Server Component와 동일하게 307로 처리 |

---

### Version History

| 버전 | 변경 사항 |
|---|---|
| `v13.0.0` | App Router 전용 `redirect` 도입 |

## 예제 및 데모 설계

- Server Action에서 폼 제출 성공 후 `redirect('/dashboard')`를 호출하여 상태 코드와 페이지 전환을 확인한다.
- `try/catch` 내부에서 잘못 `redirect()`를 호출했을 때 리다이렉트가 실패하는 현상과, `try/catch` 밖으로 분리하여 정상 동작하는 패턴을 비교 검증한다.

## 연습 문제

1. Next.js의 `redirect()` 함수가 기본 상태 코드로 302 대신 307을 사용하는 주된 기술적 이유는?
   - A. 307이 검색 엔진 크롤링 속도를 높여주기 때문
   - B. 원래 요청의 HTTP 메서드(예: POST)와 본문을 보존하여 안전하게 리다이렉트하기 때문
   - C. 브라우저가 응답을 영구 캐시하도록 만들기 때문
   - D. HTTPS 연결을 강제하기 때문

<details><summary>정답 보기</summary>

정답: **B**  
해설: 307 상태 코드는 HTTP 메서드(POST/GET)의 변형 없이 요청을 그대로 대상 경로로 전달하도록 보장한다.
</details>

2. `redirect()`를 Server Action에서 사용할 때 권장되는 작성 패턴은?
   - A. `try` 블록 내부에서 호출하고 `catch`에서 에러를 무시한다.
   - B. `try/catch` 블록 외부에서 작업 성공 후 호출한다.
   - C. `redirect()` 호출 후 `return true`를 반드시 작성한다.
   - D. `redirect()`를 `Promise.all`로 감싸서 실행한다.

<details><summary>정답 보기</summary>

정답: **B**  
해설: `redirect`는 `NEXT_REDIRECT` 에러를 던져 흐름을 제어하므로 `try/catch` 내부에서 호출하면 에러가 가로채어 리다이렉트가 취소될 수 있다.
</details>

## 챕터 요약

- `redirect`는 307 임시 리다이렉트를 수행하여 원래의 HTTP 메서드를 안전하게 보존한다.
- 내부적으로 특수 에러를 던지므로 `try/catch` 블록 외부에서 호출해야 한다.
- Server Action에서는 `RedirectType`(`'replace'` / `'push'`)으로 브라우저 히스토리 스택을 제어할 수 있다.
