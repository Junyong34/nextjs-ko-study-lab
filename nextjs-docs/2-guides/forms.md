# Forms

- 공식 문서: [Forms](https://nextjs.org/docs/app/guides/forms)
- 상위 메뉴: [Guides](./README.md)
- 전체 목차: [Next.js 학습 문서](../README.md)

## 학습 목표

- `<form>`과 Server Action으로 서버에서 제출을 처리하는 흐름을 설명할 수 있다.
- `FormData`, `bind`, Zod를 이용해 입력을 전달하고 검증할 수 있다.
- `useActionState`, `useFormStatus`, `useOptimistic`으로 오류·대기·낙관적 UI를 설계할 수 있다.
- 중첩 제출 요소와 `requestSubmit()`의 사용 시점을 구분할 수 있다.

## 핵심 개념 및 설명

### Server Actions로 폼 만들기

React Server Action은 서버에서 실행되는 [Server Function](https://react.dev/reference/rsc/server-functions)이다. Server Component와 Client Component 모두에서 폼 제출을 처리하는 데 호출할 수 있다. 폼을 넘어 단일 왕복 응답, 순차 디스패치, 보안, 배포 동작이 필요하면 [Server Actions](./server-actions.md)를 함께 본다.

인증된 페이지에만 폼을 렌더링하더라도 각 Server Action 안에서 [인증과 인가](./authentication.md)를 다시 검증해야 한다. Server Action은 직접 POST 요청을 보낼 수 있는 신뢰할 수 없는 진입점이기 때문이다.

### 동작 방식

React는 HTML `<form>`의 `action` 속성으로 Server Action을 호출할 수 있게 확장한다. 폼에서 호출된 함수는 `FormData`를 자동으로 받는다.

```tsx filename="app/invoices/page.tsx"
import { auth } from '@/lib/auth'

export default function Page() {
  async function createInvoice(formData: FormData) {
    'use server'

    const session = await auth()
    if (!session?.user) throw new Error('Unauthorized')

    const invoice = {
      customerId: formData.get('customerId'),
      amount: formData.get('amount'),
      status: formData.get('status'),
    }
    // 데이터를 변경하고 관련 캐시를 갱신한다.
  }

  return <form action={createInvoice}>...</form>
}
```

> **알아두면 좋은 점**: 필드가 많으면 `Object.fromEntries(formData)`를 쓸 수 있다. 결과에는 `$ACTION_` 접두사가 붙은 추가 속성도 포함된다.

### 추가 인수 전달

폼 필드가 아닌 값을 Server Function에 넘기려면 `bind`를 사용한다. `bind`는 Server Component와 Client Component에서 모두 작동하고 점진적 향상을 지원한다.

```tsx filename="app/client-component.tsx"
'use client'

import { updateUser } from './actions'

export function UserProfile({ userId }: { userId: string }) {
  const updateUserWithId = updateUser.bind(null, userId)
  return <form action={updateUserWithId}>...</form>
}
```

```tsx filename="app/actions.ts"
'use server'

export async function updateUser(userId: string, formData: FormData) {}
```

숨겨진 입력으로도 값을 보낼 수 있지만 렌더링된 HTML에 인코딩되지 않은 값이 노출된다. 클라이언트가 보낸 ID는 신뢰하지 말고 서버에서 소유권을 다시 확인한다.

### 폼 검증

기본적인 클라이언트 검증에는 `required`, `type="email"` 같은 HTML 속성을 사용한다. 서버에서는 Zod 같은 스키마 라이브러리로 다시 검증한다.

```tsx filename="app/actions.ts"
'use server'

import { z } from 'zod'

const schema = z.object({ email: z.string().email() })

export async function createUser(formData: FormData) {
  const result = schema.safeParse({ email: formData.get('email') })
  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors }
  }
  // 검증된 데이터만 변경에 사용한다.
}
```

### 검증 오류

오류 메시지를 화면에 표시하려면 폼 컴포넌트를 Client Component로 만들고 `useActionState`를 사용한다. 이때 Server Function의 첫 번째 인수로 `prevState`가 추가되고 `FormData`는 두 번째 인수가 된다.

```tsx filename="app/ui/signup.tsx"
'use client'

import { useActionState } from 'react'
import { createUser } from '@/app/actions'

const initialState = { message: '' }

export function Signup() {
  const [state, formAction, pending] = useActionState(createUser, initialState)
  return (
    <form action={formAction}>
      <input name="email" type="email" required />
      <p aria-live="polite">{state?.message}</p>
      <button disabled={pending}>Sign up</button>
    </form>
  )
}
```

### 대기 상태

`useActionState`가 반환하는 `pending`으로 제출 버튼을 비활성화하거나 로딩 UI를 표시할 수 있다. 폼 내부의 별도 버튼 컴포넌트에서는 `useFormStatus`를 쓸 수 있다. 이 훅은 자신이 렌더링된 폼의 제출 상태를 읽으므로 버튼 컴포넌트를 폼 안에 배치해야 한다.

```tsx filename="app/ui/button.tsx"
'use client'

import { useFormStatus } from 'react-dom'

export function SubmitButton() {
  const { pending } = useFormStatus()
  return <button disabled={pending}>Sign Up</button>
}
```

> **알아두면 좋은 점**: React 19의 `useFormStatus`는 `pending` 외에 `data`, `method`, `action`도 반환한다.

> **알아두면 좋은 점**: 실험적인 `useOffline`을 활성화하면 연결 중단으로 끊긴 Server Action이 대기 상태를 유지하고 네트워크가 돌아왔을 때 완료될 수 있다.

### 낙관적 업데이트

`useOptimistic`은 Server Function 응답을 기다리기 전에 예상 결과를 UI에 반영한다. 실제 쓰기가 실패할 수 있으므로 오류 처리와 원래 상태 복원 전략도 함께 설계한다.

```tsx filename="app/actions.ts"
'use client'

import { useOptimistic } from 'react'
import { send } from './actions'

export function Thread({ messages }: { messages: string[] }) {
  const [optimistic, addOptimistic] = useOptimistic(
    messages,
    (state, message: string) => [...state, message]
  )
  async function formAction(formData: FormData) {
    const message = String(formData.get('message'))
    addOptimistic(message)
    await send(message)
  }
  return <form action={formAction}>...</form>
}
```

### 중첩 폼 요소

`<button>`, `<input type="submit">`, `<input type="image">` 같은 폼 내부 요소도 `formAction` prop으로 Server Action을 호출할 수 있다. 한 폼에 “초안 저장”과 “게시”처럼 여러 제출 동작이 필요할 때 유용하다.

### 프로그래밍 방식 폼 제출

`requestSubmit()`은 가장 가까운 `<form>`을 실제 제출 절차로 보낸다. 예를 들어 `⌘`/`Ctrl` + `Enter` 단축키를 제공할 수 있다.

```tsx filename="app/entry.tsx"
'use client'

export function Entry() {
  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      e.currentTarget.form?.requestSubmit()
    }
  }
  return <textarea name="entry" required onKeyDown={handleKeyDown} />
}
```

## 예제 및 데모 설계

- Phase 2에서 회원 가입 폼과 메시지 작성 폼을 구현한다.
- 잘못된 이메일, 제출 대기, 성공, 서버 오류를 한 화면에서 전환해 본다.
- 느린 Server Action을 흉내 내 `pending`과 낙관적 메시지의 차이를 시각화한다.
- 인증·소유권 검사를 제거한 위험한 예와 안전한 예의 서버 로그를 비교한다.

## 연습 문제

1. 폼에서 호출한 Server Action이 자동으로 받는 값은 무엇인가?

   - A. `Request`
   - B. `FormData`
   - C. `URLSearchParams`

   <details><summary>정답 보기</summary>

   정답: B. React가 폼의 값을 `FormData`로 전달한다.

   </details>

2. 폼 전체가 아닌 제출 버튼에서 현재 제출 상태를 읽는 훅은 무엇인가?

   - A. `useFormStatus`
   - B. `useOptimistic`
   - C. `useRouter`

   <details><summary>정답 보기</summary>

   정답: A. 버튼을 폼 안에 배치하고 `useFormStatus`의 `pending`을 읽는다.

   </details>

3. Server Action 보안에 관한 설명으로 맞는 것은 무엇인가?

   - A. 인증된 페이지에서 렌더링됐으면 Action의 인증 검사는 생략해도 된다.
   - B. Zod 검증만 통과하면 데이터 소유권도 증명된다.
   - C. 각 Action에서 인증·인가와 입력 검증을 수행해야 한다.

   <details><summary>정답 보기</summary>

   정답: C. Server Action은 직접 호출 가능한 진입점이므로 모든 검사를 서버에서 반복한다.

   </details>

## 챕터 요약

- `<form action={serverAction}>`은 제출 값을 `FormData`로 서버에 전달한다.
- `bind`로 추가 인수를 전달할 수 있지만 클라이언트 값은 서버에서 검증해야 한다.
- `useActionState`와 `useFormStatus`는 오류와 대기 상태를 UI에 연결한다.
- `useOptimistic`은 서버 응답 전 예상 결과를 보여준다.
- 중첩 `formAction`과 `requestSubmit()`으로 여러 제출 방식과 단축키를 설계할 수 있다.
