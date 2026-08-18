# TypeScript

- 공식 문서: [TypeScript](https://nextjs.org/docs/app/api-reference/config/typescript)
- 상위 메뉴: [Configuration](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- Next.js의 기본 TypeScript 통합 환경과 `tsconfig.json`, `next-env.d.ts`의 동작 원리를 이해한다.
- Server Component의 무직렬화 데이터 전달 모델을 통한 엔드투엔드(End-to-End) 타입 안전성을 파악한다.
- `typedRoutes` 설정을 통해 라우트 경로(`Link`, `router.push`)의 정적 타이핑 및 오타 방지 기능을 활성화한다.
- `next.config.ts` 구성 및 `PageProps`, `LayoutProps`, `RouteContext` 등 라우트 인식 전역 타입 헬퍼를 활용한다.

## 핵심 개념 및 설명

Next.js는 TypeScript-first 개발 경험을 기본 제공한다. `create-next-app`으로 프로젝트를 생성할 때 TypeScript를 선택하면 필요한 패키지와 최적화된 `tsconfig.json`이 자동으로 구성된다.

기존 프로젝트에 TypeScript를 도입할 때는 파일 확장자를 `.ts` 또는 `.tsx`로 변경한 후 `next dev`를 실행하면 프레임워크가 필수 의존성을 자동 설치하고 환경을 초기화한다.

### 엔드투엔드 (End-to-End) 타입 안전성

Next.js App Router의 Server Component는 데이터를 브라우저용 JSON 문자열로 직렬화(Serialization)할 필요가 없다.

서버 컴포넌트 간 데이터 전달 시 `Date`, `Map`, `Set` 등의 복합 JavaScript 객체를 타입 손실 없이 그대로 반환하고 전달받을 수 있다:

```tsx filename="app/page.tsx" switcher
async function getUserData() {
  const res = await fetch('https://api.example.com/user')
  const user: { name: string; createdAt: Date } = await res.json()
  return user
}

export default async function Page() {
  const user = await getUserData()
  return <div>{user.name} (가입일: {user.createdAt.toLocaleDateString()})</div>
}
```

```jsx filename="app/page.js" switcher
async function getUserData() {
  const res = await fetch('https://api.example.com/user')
  const user = await res.json()
  return user
}

export default async function Page() {
  const user = await getUserData()
  return <div>{user.name}</div>
}
```

### 정적으로 타이핑된 라우트 (`typedRoutes`)

`typedRoutes`를 활성화하면 프로젝트 내의 모든 실제 라우트 경로를 수집하여 유효한 경로만 `Link`나 `router.push`에서 허용되도록 컴파일 시점에 검증한다:

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  typedRoutes: true, // 정적 라우트 타입 검증 활성화
}

export default nextConfig
```

```tsx filename="app/components/navigation.tsx"
'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

export function Navigation() {
  const router = useRouter()

  return (
    <nav>
      {/* ⭕ 올바른 라우트: 정상 컴파일 */}
      <Link href="/dashboard" />

      {/* ❌ 존재하지 않는 라우트: TypeScript 컴파일 에러 발생 */}
      <Link href="/dashbord" />

      <button onClick={() => router.push('/settings')}>설정</button>
    </nav>
  )
}
```

### 라우트 인식 전역 타입 헬퍼

Next.js는 `next dev`, `next build`, 또는 `next typegen` 실행 시 라우트 세그먼트별 전역 Props 헬퍼를 자동 생성한다 (별도 임포트 불필요):

- `PageProps<'/route'>`: 페이지의 `params` 및 `searchParams` 타입.
- `LayoutProps<'/route'>`: 레이아웃의 `params` 및 `children` 타입.
- `RouteContext<'/api/route'>`: Route Handler의 두 번째 인자 타입.

### `next-env.d.ts` 관리 규칙

- `next-env.d.ts`는 Next.js가 자동으로 생성하고 갱신하는 선언 파일이다.
- 이미지, CSS 모듈 등 비코드 파일의 import 선언을 담고 있으며, **절대 수동으로 수정하거나 커밋하지 않는다** (`.gitignore` 등록 권장).
- 커스텀 전역 타입 선언은 별도의 `types/global.d.ts` 파일을 생성하여 `tsconfig.json`의 `include`에 추가한다.

### Version Changes

| 버전 | 변경 사항 |
|---|---|
| `v15.0.0` | `next.config.ts` 기본 지원 |
| `v13.2.0` | `typedRoutes` (정적 타이핑 라우트) 도입 |
| `v12.0.0` | SWC 기반 초고속 TypeScript 컴파일 적용 |

## 예제 및 데모 설계

- `next.config.ts`에 `typedRoutes: true`를 적용한 후 의도적으로 오타가 있는 `<Link href="/aboot" />`를 작성했을 때 VS Code 및 빌드 시점에서 TS 에러가 발생하는지 확인한다.
- `tsconfig.json`에 `incremental: true`를 적용하여 대규모 프로젝트의 증분 타입 체킹 성능을 검증한다.
- Server Component에서 반환한 `Date` 객체가 클라이언트로 문제없이 전달되는지 확인한다.

## 연습 문제

1. Next.js에서 `Link` 컴포넌트의 `href` 속성에 오타가 있을 때 TypeScript 컴파일 에러를 발생시키도록 활성화하는 설정은?
   - A. `strictLinks: true`
   - B. `typedRoutes: true`
   - C. `validatePaths: true`
   - D. `typeCheckedNavigation: true`

<details><summary>정답 보기</summary>

정답: **B**  
해설: `next.config.ts`에서 `typedRoutes: true`를 설정하면 애플리케이션 내의 실제 라우트 목록을 바탕으로 정적 타입 검증을 수행한다.
</details>

2. 프로젝트 루트에 자동 생성되는 `next-env.d.ts` 파일에 대한 올바른 관리 지침은?
   - A. 사용자가 직접 커스텀 인터페이스를 작성하고 Git에 커밋해야 한다.
   - B. Next.js가 빌드 시마다 자동 재생성하므로 수동으로 편집하지 않으며 `.gitignore`에 추가하는 것이 권장된다.
   - C. 삭제하면 프로젝트가 영구적으로 실행되지 않는다.
   - D. `tsconfig.json`에서 제외해야 한다.

<details><summary>정답 보기</summary>

정답: **B**  
해설: `next-env.d.ts`는 프레임워크 구현 상세 파일로 Next.js에 의해 매번 갱신되므로 수동 편집을 피하고 `.gitignore`로 관리하는 것이 권장된다.
</details>

## 챕터 요약

- Next.js는 기본적으로 TypeScript를 지원하며 `tsconfig.json`을 자동 설정한다.
- Server Component의 무직렬화 데이터 모델로 완벽한 엔드투엔드 타입 안전성을 제공한다.
- `typedRoutes`를 통해 라우트 URL의 오타를 컴파일 타임에 감지한다.
- `PageProps`, `LayoutProps` 등의 전역 타입 헬퍼가 자동 생성된다.
- `next.config.ts`를 지원하여 설정 파일도 타입 안전하게 작성할 수 있다.
