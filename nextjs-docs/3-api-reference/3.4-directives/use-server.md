# use server

- 공식 문서: [use server](https://nextjs.org/docs/app/api-reference/directives/use-server)
- 상위 메뉴: [Directives](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- `'use server'` 지시어의 역할과 함수/파일을 서버 측에서 실행되는 [Server Function](https://react.dev/reference/rsc/server-functions)으로 지정하는 원리를 이해한다.
- 파일 최상단 선언 방식과 Server Component 내부 인라인 선언 방식의 차이점 및 적용 위치를 익힌다.
- Client Component에서 Server Function을 임포트하여 호출할 때 필요한 전용 파일 구성 규칙을 적용한다.
- 인증/인가 검증, 입력 데이터 유효성 검사, 민감 정보 반환 차단 등 Server Action 보안 원칙을 수립한다.

## 핵심 개념 및 설명

`'use server'` 지시어는 함수 또는 파일 전체가 **서버 측(server side)**에서 실행되도록 지정한다. 파일 최상단에 선언하여 해당 파일의 모든 함수를 서버 함수로 만들거나, 비동기 함수 내부 최상단에 인라인으로 선언하여 개별 함수를 [Server Function](https://react.dev/reference/rsc/server-functions)으로 표시할 수 있다. 이는 React의 표준 기능이다.

Next.js 특화 Server Action 동작(응답 모델, 보안, 설정, 배포 등)에 대한 자세한 내용은 [Server Actions 및 변형(Mutations) 가이드](../../2-guides/2.14-server-actions.md)를 참조한다.

### 1. 파일 최상단에서 `'use server'` 사용

파일 최상단에 `'use server'` 지시어를 작성하면 해당 파일에서 export되는 모든 함수가 서버 측에서 실행된다.

```tsx filename="app/actions.ts" highlight={1} switcher
'use server'

import { db } from '@/lib/db'
import { auth } from '@/lib/auth'

export async function createUser(data: { name: string; email: string }) {
  const session = await auth()
  if (!session?.user) {
    throw new Error('인증되지 않은 사용자입니다')
  }

  const user = await db.user.create({ data })
  return { id: user.id, name: user.name }
}
```

```jsx filename="app/actions.js" highlight={1} switcher
'use server'

import { db } from '@/lib/db'
import { auth } from '@/lib/auth'

export async function createUser(data) {
  const session = await auth()
  if (!session?.user) {
    throw new Error('인증되지 않은 사용자입니다')
  }

  const user = await db.user.create({ data })
  return { id: user.id, name: user.name }
}
```

#### Client Component에서 Server Function 임포트 및 호출

Client Component에서 Server Function을 직접 호출하려면 반드시 파일 최상단에 `'use server'`가 선언된 전용 모듈 파일(예: `actions.ts`)에서 함수를 정의하고 export해야 한다.

```tsx filename="app/actions.ts" highlight={1} switcher
'use server'

import { db } from '@/lib/db'
import { auth } from '@/lib/auth'

export async function fetchUsers() {
  const session = await auth()
  if (!session?.user) {
    throw new Error('인증되지 않은 요청입니다')
  }

  return await db.user.findMany({
    select: { id: true, name: true, email: true },
  })
}
```

```tsx filename="app/components/my-button.tsx" highlight={1,2,6} switcher
'use client'

import { fetchUsers } from '../actions'

export default function MyButton() {
  return (
    <button type="button" onClick={() => fetchUsers()}>
      사용자 목록 조회
    </button>
  )
}
```

### 2. 인라인(Inline)으로 `'use server'` 사용

Server Component 내부에서 비동기 함수 본문 최상단에 `'use server'`를 인라인으로 선언하여 개별 함수만 Server Function으로 지정할 수 있다. 이 함수를 하위 Client Component의 action prop으로 전달할 수 있다.

```tsx filename="app/posts/[id]/page.tsx" highlight={8} switcher
import { EditPost } from './edit-post'
import { revalidatePath } from 'next/cache'

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const post = await getPost(id)

  async function updatePost(formData: FormData) {
    'use server'
    // 저장 전 인증/인가 확인 (예: savePost 내부)
    await savePost(id, formData)
    revalidatePath(`/posts/${id}`)
  }

  return <EditPost updatePostAction={updatePost} post={post} />
}
```

```jsx filename="app/posts/[id]/page.js" highlight={8} switcher
import { EditPost } from './edit-post'
import { revalidatePath } from 'next/cache'

export default async function PostPage({ params }) {
  const { id } = await params
  const post = await getPost(id)

  async function updatePost(formData) {
    'use server'
    await savePost(id, formData)
    revalidatePath(`/posts/${id}`)
  }

  return <EditPost updatePostAction={updatePost} post={post} />
}
```

> **알아두면 좋은 점**:
> Client Component 파일 내부에서는 인라인 `'use server'` 함수를 직접 정의할 수 없다. Client Component에서 사용할 Server Function은 항상 `'use server'`가 파일 최상단에 명시된 외부 파일에서 가져와야 한다.

### 보안 고려사항 (Security Considerations)

Server Function은 클라이언트가 네트워크를 통해 트리거할 수 있는 공개 HTTP 엔드포인트와 유사하게 취급해야 한다:

1. **인증 및 인가(Authentication & Authorization)**: 민감한 작업을 수행하기 전에 항상 세션을 검증한다. 클라이언트 인자로 토큰을 넘겨받지 않고 서버 쿠키나 세션 저장소에서 직접 확인한다.
2. **반환값 제어(Return Values)**: Server Function의 반환값은 직렬화되어 클라이언트로 전송된다. 데이터베이스의 전체 엔티티(비밀번호 해시, 내부 플래그 등)를 그대로 반환하지 말고 UI에 필요한 필드만 선별하여 반환한다.
3. **데이터 접근 계층(Data Access Layer)**: 데이터 변형 로직을 데이터 접근 계층 함수로 일원화하여 보안 규칙이 항상 일관되게 적용되도록 설계한다.

## 예제 및 데모 설계

- `app/actions/user.ts` 파일 최상단에 `'use server'`를 두고 회원가입 폼 제출 시 유효성 검증과 DB 저장을 수행하는 데모를 설계한다.
- Server Component에서 인라인으로 정의된 Server Action이 하위 Client Component 버튼 클릭 시 실행되어 `revalidatePath`로 즉시 화면을 갱신하는 시나리오를 구성한다.
- 클라이언트 컴포넌트 내부에서 인라인 `'use server'` 선언을 시도했을 때의 번들링 오류를 확인한다.

## 연습 문제

1. Client Component 파일 내부에서 Server Function을 사용하는 올바른 방법은?
   - A. Client Component 함수 본문 안에 `'use server'` 함수를 직접 정의한다.
   - B. 파일 최상단에 `'use server'`가 선언된 별도 파일에서 export된 Server Function을 임포트하여 호출한다.
   - C. `useRouter`의 `serverAction()` 메서드를 통해서만 호출할 수 있다.
   - D. Client Component에서는 Server Function을 호출할 수 없다.

<details><summary>정답 보기</summary>

정답: **B**  
해설: Client Component 파일 안에서는 인라인 `'use server'` 선언이 허용되지 않으므로, 최상단에 `'use server'`가 선언된 독립 모듈 파일에서 함수를 export하고 이를 Client Component로 임포트하여 사용해야 한다.
</details>

2. Server Function 작성 시 보안 모범 사례로 적절하지 않은 것은?
   - A. 클라이언트에서 전달받은 사용자 ID 인자만 믿고 즉시 결제 처리를 수행한다.
   - B. 서버 쿠키/세션을 통해 현재 로그인된 사용자의 권한을 직접 검증한다.
   - C. 반환 객체에 비밀번호나 개인 식별 정보 등 민감한 DB 컬럼을 제외하고 필요한 필드만 포함한다.
   - D. 데이터베이스 수정 전 입력 폼 데이터의 유효성을 검사한다.

<details><summary>정답 보기</summary>

정답: **A**  
해설: Server Function은 공개 엔드포인트와 같으므로 클라이언트 인자를 무조건 신뢰해서는 안 되며, 서버 세션/쿠키를 통해 인증 및 인가 권한을 반드시 직접 검증해야 한다.
</details>

## 챕터 요약

- `'use server'`는 해당 함수나 파일이 서버 환경에서 실행되는 Server Function임을 명시하는 React 지시어다.
- 파일 최상단 선언(모든 export 함수 대상)과 Server Component 내부의 인라인 함수 선언 방식을 지원한다.
- Client Component에서 호출할 Server Function은 반드시 `'use server'`가 최상단에 명시된 전용 파일에 정의해야 한다.
- Server Action은 공개 엔드포인트와 같으므로 철저한 인증/인가 검증과 입력 데이터 검증이 필수적이다.
- 클라이언트로 반환되는 직렬화 페이로드에 민감 정보가 포함되지 않도록 필요한 필드만 필터링하여 반환한다.
