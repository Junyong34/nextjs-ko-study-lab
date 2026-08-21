# permanentRedirect

- 공식 문서: [permanentRedirect](https://nextjs.org/docs/app/api-reference/functions/permanentRedirect)
- 상위 메뉴: [Functions](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- `permanentRedirect` 함수를 사용하여 리소스를 영구적으로 새 URL로 이전(SEO 인덱싱 이전)하는 방법을 익힌다.
- 임시 리다이렉트(`redirect`, 307)와 영구 리다이렉트(`permanentRedirect`, 308)의 차이점 및 사용 시나리오를 구분한다.
- `try/catch` 블록 외부에서 호출해야 하는 에러 제어 흐름 특성을 이해한다.

## 핵심 개념 및 설명

`permanentRedirect` 함수는 사용자를 다른 URL로 **영구 리다이렉트(HTTP 308 Permanent Redirect)**시키는 Server Component 및 Route Handler 전용 함수다. 주로 엔티티의 정규 URL이 영구적으로 변경되었을 때(예: 사용자 프로필 URL 변경) 사용된다.

```tsx filename="app/user/[id]/page.tsx"
import { permanentRedirect } from 'next/navigation'

async function fetchUser(id: string) {
  const res = await fetch(`https://api.example.com/user/${id}`)
  if (!res.ok) {
    permanentRedirect('/users')
  }
  return res.json()
}

export default async function UserProfile({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await fetchUser(id)
  return <div>{user.username}</div>
}
```

---

### 매개변수 (Parameters)

`permanentRedirect(url, type)`

1. **`url`**: 영구 이전할 대상 경로 문자열 (상대 경로 `/users` 또는 절대 URL `https://example.com/users`)
2. **`type`** (선택 사항): Server Action 내에서의 히스토리 제어 (`'replace'` 기본값, `'push'`)

---

### 307 vs 308 상태 코드 비교

| 구분 | `redirect()` (307) | `permanentRedirect()` (308) |
|---|---|---|
| **의미** | 임시 이전 (Temporary Redirect) | 영구 이전 (Permanent Redirect) |
| **SEO 영향** | 검색 엔진이 기존 URL의 인덱스를 유지 | 검색 엔진이 새 URL로 색인 및 링크 점수를 이전 |
| **브라우저 캐싱** | 기본적으로 응답을 캐시하지 않음 | 브라우저가 리다이렉트 응답을 캐시할 수 있음 |
| **주요 사용 사례** | 로그인 후 이동, 폼 제출 후 완료 페이지 | 도메인/경로 영구 변경, 사용자명 변경에 따른 새 프로필 URL |

---

### 주의사항: `try/catch` 블록 분리

`permanentRedirect()` 역시 내부적으로 `NEXT_REDIRECT` 에러를 던지므로 `try/catch` 블록 외부에서 호출해야 한다.

```tsx filename="app/team/[id]/page.js"
'use server'

import { permanentRedirect } from 'next/navigation'

export async function updateUsername(formData: FormData) {
  let newSlug = ''
  try {
    newSlug = await db.updateUser({ username: formData.get('username') })
  } catch (error) {
    return { error: '업데이트 실패' }
  }

  // 성공 후 외부에서 호출
  permanentRedirect(`/profile/${newSlug}`)
}
```

---

### Version History

| 버전 | 변경 사항 |
|---|---|
| `v13.0.0` | App Router 전용 `permanentRedirect` 도입 |

## 예제 및 데모 설계

- 사용자 계정 변경 시 `permanentRedirect('/profile/new-username')`를 트리거하고 네트워크 탭에서 `308 Permanent Redirect` 상태 코드가 반환되는지 확인한다.

## 연습 문제

1. 리소스의 URL이 영구적으로 이전되어 검색 엔진의 색인 주소를 새 URL로 갱신하고자 할 때 사용해야 하는 함수와 상태 코드는?
   - A. `redirect()`, 307
   - B. `permanentRedirect()`, 308
   - C. `redirect()`, 302
   - D. `notFound()`, 404

<details><summary>정답 보기</summary>

정답: **B**  
해설: 영구적인 URL 이전 및 SEO 인덱스 갱신에는 308 상태 코드를 사용하는 `permanentRedirect()`를 사용한다.
</details>

## 챕터 요약

- `permanentRedirect`는 308 상태 코드로 영구 리다이렉트를 수행하여 검색 엔진 색인을 갱신한다.
- `redirect`(307)와 마찬가지로 내부 특수 에러를 발생시키므로 `try/catch` 블록 외부에서 호출한다.
