# taint

- 공식 문서: [taint](https://nextjs.org/docs/app/api-reference/config/next-config-js/taint)
- 상위 메뉴: [next.config.js](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

> **Experimental**: 이 기능은 현재 experimental 상태이며 변경될 수 있다. production 환경에는 권장하지 않는다. 사용해 보고 [GitHub](https://github.com/vercel/next.js/issues)에 피드백을 남길 수 있다.

## 학습 목표

- `experimental.taint`를 활성화해 React의 `experimental_taintObjectReference`와 `experimental_taintUniqueValue`를 사용하는 방법을 익힌다.
- 민감한 데이터가 `Server Component`와 `Client Component` 사이의 경계를 넘어가지 못하게 taint가 막는 방식을 이해한다.
- 객체 참조, 고유 값, taint된 값에서 파생한 값이 각각 어떻게 처리되는지 구분한다.
- `experimental` 기능의 제한과 `process.env`에 적용되는 기본 taint의 범위를 확인한다.

## 핵심 개념 및 설명

이 기능은 현재 `experimental`이며 변경될 수 있다. production에서는 사용을 권장하지 않는다. 사용해 본 뒤 [GitHub](https://github.com/vercel/next.js/issues)에서 의견을 공유한다.

### 사용법 (Usage)

`taint` 옵션은 객체와 값에 taint를 적용하는 React `experimental` API를 활성화한다. 이 기능은 민감한 데이터가 실수로 클라이언트에 전달되는 일을 막는 데 도움이 된다. 활성화하면 다음 API를 사용할 수 있다.

- [`experimental_taintObjectReference`](https://react.dev/reference/react/experimental_taintObjectReference)로 객체 참조에 taint를 적용한다.
- [`experimental_taintUniqueValue`](https://react.dev/reference/react/experimental_taintUniqueValue)로 고유 값에 taint를 적용한다.

> **알아두면 좋은 점**: 이 flag를 활성화하면 `app` 디렉토리에서 React `experimental` 채널도 활성화한다. `process.env`에도 taint를 적용하므로 `process.env` 전체를 `Client Component`에 전달할 수 없다.

```ts filename="next.config.ts" switcher
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    taint: true,
  },
}

export default nextConfig
```

```js filename="next.config.js" switcher
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    taint: true,
  },
}

module.exports = nextConfig
```

> **경고**: 클라이언트에 민감한 데이터가 노출되는 것을 막는 수단으로 taint API에만 의존하지 않는다. [보안 권장 사항](https://nextjs.org/blog/security-nextjs-server-components-actions)을 확인한다.

taint API를 쓰면 클라이언트로 전달해서는 안 되는 데이터를 선언적으로 명시해 방어적으로 처리할 수 있다. 객체나 값이 `Server Component`와 `Client Component` 사이의 경계를 넘어가면 React가 오류를 발생시킨다.

다음 상황에서 유용하다.

- 데이터를 읽는 메서드를 제어할 수 없다.
- 직접 정의하지 않은 민감한 데이터 형태를 다뤄야 한다.
- `Server Component`를 렌더링하는 중에 민감한 데이터에 접근한다.

민감한 데이터가 필요하지 않은 컨텍스트로 반환되지 않도록 데이터와 API를 설계하는 편이 낫다.

### 주의사항 (Caveats)

- taint는 객체를 참조로만 추적한다. 객체를 복사하면 taint가 적용되지 않은 객체가 생기므로 API가 제공하던 보장도 사라진다. 복사한 객체에는 taint를 다시 적용해야 한다.
- 기본 제공되는 `process.env` taint는 객체 참조에만 적용된다. `process.env.MY_VAR`처럼 개별 변수를 읽어 얻은 문자열을 `Client Component`에 전달할 때는 영향을 받지 않고, `{ ...process.env }`처럼 복사한 값을 전달할 때도 마찬가지다.
- taint는 taint된 값에서 파생된 데이터를 추적할 수 없다. 파생한 값에도 taint를 적용해야 한다.
- 값은 수명 참조(`lifetime reference`)가 범위 안에 있는 동안 taint된 상태로 유지된다. 자세한 내용은 [`experimental_taintUniqueValue` 매개변수 참고 문서](https://react.dev/reference/react/experimental_taintUniqueValue#parameters)를 확인한다.

### 예제 (Examples)

#### 객체 참조에 taint 적용 (Tainting an object reference)

`getUserDetails` 함수는 특정 사용자의 데이터를 반환한다. 사용자 객체 참조에 taint를 적용하면 해당 객체는 `Server Component`와 `Client Component` 사이의 경계를 넘어가지 못한다. 여기서는 `UserCard`가 `Client Component`라고 가정한다.

```ts switcher
import { experimental_taintObjectReference } from 'react'

async function getUserDetails(id: string): Promise<UserDetails> {
  const user = await db.queryUserById(id)

  experimental_taintObjectReference(
    'Do not use the entire user info object. Instead, select only the fields you need.',
    user
  )

  return user
}
```

```js switcher
import { experimental_taintObjectReference } from 'react'

async function getUserDetails(id) {
  const user = await db.queryUserById(id)

  experimental_taintObjectReference(
    'Do not use the entire user info object. Instead, select only the fields you need.',
    user
  )

  return user
}
```

taint된 `userDetails` 객체의 개별 필드는 계속 읽을 수 있다.

```tsx filename="app/contact/page.tsx" switcher
export async function ContactPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const userDetails = await getUserDetails(id)

  return (
    <UserCard
      firstName={userDetails.firstName}
      lastName={userDetails.lastName}
    />
  )
}
```

```jsx filename="app/contact/page.js" switcher
export async function ContactPage({ params }) {
  const { id } = await params
  const userDetails = await getUserDetails(id)

  return (
    <UserCard
      firstName={userDetails.firstName}
      lastName={userDetails.lastName}
    />
  )
}
```

객체 전체를 `Client Component`에 전달하면 오류가 발생한다.

```tsx switcher
export async function ContactPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const userDetails = await getUserDetails(id)

  // 오류가 발생한다
  return <UserCard user={userDetails} />
}
```

```jsx switcher
export async function ContactPage({ params }) {
  const { id } = await params
  const userDetails = await getUserDetails(id)

  // 오류가 발생한다
  return <UserCard user={userDetails} />
}
```

#### 고유 값에 taint 적용 (Tainting a unique value)

`configService.getConfigDetails` 호출을 기다리면 서버 설정을 읽을 수 있다고 가정한다. 이 시스템 설정에는 클라이언트에 노출하지 않아야 하는 `SERVICE_API_KEY`가 들어 있다.

`config.SERVICE_API_KEY` 값에 taint를 적용할 수 있다.

```ts switcher
import { experimental_taintUniqueValue } from 'react'

async function getSystemConfig(): Promise<SystemConfig> {
  const config = await configService.getConfigDetails()

  experimental_taintUniqueValue(
    'Do not pass configuration tokens to the client',
    config,
    config.SERVICE_API_KEY
  )

  return config
}
```

```js switcher
import { experimental_taintUniqueValue } from 'react'

async function getSystemConfig() {
  const config = await configService.getConfigDetails()

  experimental_taintUniqueValue(
    'Do not pass configuration tokens to the client',
    config,
    config.SERVICE_API_KEY
  )

  return config
}
```

`systemConfig` 객체의 다른 속성은 계속 읽을 수 있다.

```tsx
export async function Dashboard() {
  const systemConfig = await getSystemConfig()

  return <ClientDashboard version={systemConfig.SERVICE_API_VERSION} />
}
```

`SERVICE_API_KEY`를 `ClientDashboard`에 전달하면 오류가 발생한다.

```tsx
export async function Dashboard() {
  const systemConfig = await getSystemConfig()
  // PR에서 누군가 실수한다
  const version = systemConfig.SERVICE_API_KEY

  return <ClientDashboard version={version} />
}
```

`systemConfig.SERVICE_API_KEY`를 새 변수에 다시 할당해도 taint는 유지된다. 따라서 이 값을 `Client Component`에 전달하면 여전히 오류가 발생한다.

반대로 taint된 고유 값에서 파생한 값은 클라이언트에 노출된다.

```tsx
export async function Dashboard() {
  const systemConfig = await getSystemConfig()
  // PR에서 누군가 실수한다
  const version = `version::${systemConfig.SERVICE_API_KEY}`

  return <ClientDashboard version={version} />
}
```

`getSystemConfig`가 반환하는 데이터에서 `SERVICE_API_KEY`를 제거하는 편이 더 낫다.

## 예제 및 데모 설계

- 데모 가능 여부: 가능
- `experimental.taint: true`를 설정하고 `Server Component`에서 사용자 객체의 개별 필드만 `Client Component`로 전달하는 화면을 구성한다.
- 객체 전체나 taint된 `SERVICE_API_KEY`를 전달하면 오류가 발생하고, 개별 필드를 전달하면 정상적으로 렌더링되는 모습을 브라우저에서 비교한다.
- taint된 고유 값으로 새 문자열을 만들면 클라이언트에 값이 노출될 수 있다는 차이도 같은 화면에서 확인한다.

## 연습 문제

1. `experimental_taintObjectReference`를 적용한 객체에 대한 설명으로 올바른 것은 무엇인가?
   - A. 객체를 복사해도 원본의 taint가 항상 자동으로 복사된다.
   - B. 객체 전체는 `Client Component`로 전달할 수 없지만 개별 필드는 읽을 수 있다.
   - C. 객체에서 파생한 모든 값도 자동으로 taint된다.
   - D. `process.env.MY_VAR`처럼 개별 환경 변수 문자열도 항상 전달할 수 없다.

<details><summary>정답 보기</summary>

정답: **B**  
해설: 객체 참조에 taint를 적용하면 객체 전체는 경계를 넘어 전달할 수 없지만 필요한 개별 필드는 사용할 수 있다.
</details>

2. 기본 제공되는 `process.env` taint의 영향을 받지 않는 동작은 무엇인가? 복수 선택한다.
   - A. `process.env` 객체 전체를 `Client Component`에 전달한다.
   - B. `process.env` 객체 참조를 그대로 다른 변수에 할당한다.
   - C. `process.env.MY_VAR`를 읽어 얻은 문자열을 `Client Component`에 전달한다.
   - D. `{ ...process.env }`처럼 복사한 값을 `Client Component`에 전달한다.

<details><summary>정답 보기</summary>

정답: **C, D**  
해설: 기본 `process.env` taint는 객체 참조에만 적용되므로 개별 변수에서 읽은 문자열과 복사한 값에는 영향을 주지 않는다.
</details>

3. taint된 고유 값을 다루는 방법으로 올바른 것은 무엇인가?
   - A. taint된 값을 새 변수에 할당하면 taint가 사라지므로 그대로 전달한다.
   - B. taint된 고유 값에서 파생한 값도 항상 자동으로 taint된다고 가정한다.
   - C. 원래 taint된 값은 새 변수에 할당해도 보호되며, 민감한 값은 반환 데이터에서 제거하는 편이 낫다.
   - D. `experimental.taint`를 비활성화하고 오류를 무시한다.

<details><summary>정답 보기</summary>

정답: **C**  
해설: taint된 값 자체는 재할당해도 보호되지만 파생한 값은 추적되지 않으므로 민감한 값을 반환 데이터에서 제거하는 편이 낫다.
</details>

## 챕터 요약

- `experimental.taint`는 React의 `experimental_taintObjectReference`와 `experimental_taintUniqueValue`를 활성화한다.
- taint된 객체나 값이 `Server Component`와 `Client Component` 사이의 경계를 넘으면 React가 오류를 발생시킨다.
- 객체를 복사하거나 taint된 값에서 값을 파생하면 taint가 자동으로 이어지지 않으므로 별도로 처리해야 한다.
- 기본 `process.env` taint는 객체 참조에만 적용되고 개별 환경 변수 문자열이나 복사본에는 적용되지 않는다.
- taint API만으로 민감한 데이터 노출을 막지 말고, 필요하지 않은 컨텍스트로 민감한 데이터를 반환하지 않도록 데이터와 API를 설계한다.
