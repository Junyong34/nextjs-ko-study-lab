# Environment Variables

- 공식 문서: [Environment Variables](https://nextjs.org/docs/app/guides/environment-variables)
- 상위 메뉴: [Guides](./README.md)
- 전체 목차: [Next.js 학습 문서](../README.md)

## 학습 목표

- `.env*` 파일이 `process.env`로 로드되는 위치와 순서를 설명한다.
- 서버 전용 변수와 `NEXT_PUBLIC_` 클라이언트 변수를 구분한다.
- 빌드 시점 inline 값과 요청 시점 런타임 값을 상황에 맞게 사용한다.
- 테스트 환경과 Next.js 외부 도구에서 같은 환경 변수 로딩 규칙을 적용한다.

## 핵심 개념 및 설명

Next.js는 `.env*` 파일의 값을 `process.env`에 로드한다. 기본 환경 변수는 서버에서만 사용할 수 있다. 브라우저 번들에 포함할 값에는 `NEXT_PUBLIC_` 접두사를 붙인다.

> **경고**: 기본 `create-next-app` 템플릿은 모든 `.env` 파일을 `.gitignore`에 추가한다. 이 파일들은 거의 항상 저장소에 커밋하지 않는다.

### 환경 변수 로드하기

프로젝트 루트의 `.env`에 값을 정의하면 Next.js가 Node.js 환경의 `process.env`로 로드한다.

```bash
DB_HOST=localhost
DB_USER=myuser
DB_PASS=mypassword
```

App Router에서는 Server Component와 Route Handler 같은 서버 코드에서 사용할 수 있다.

```ts
// app/api/route.ts
export async function GET() {
  const db = await myDB.connect({
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
  })
  return Response.json(await db.query('select 1'))
}
```

> **참고**: 여러 줄 값은 큰따옴표 안에 실제 줄바꿈을 쓰거나 `\n`으로 표현할 수 있다.

```bash
PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----
...
-----END RSA PRIVATE KEY-----"

PRIVATE_KEY_ESCAPED="-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----\n"
```

> **알아두면 좋은 점**: `/src` 폴더를 사용해도 `.env*` 파일은 `/src`가 아니라 프로젝트 루트에 둔다.

#### `@next/env`로 Next.js 외부에서 로드하기

ORM 설정이나 테스트 실행기처럼 Next.js 런타임 밖의 루트 설정 파일에서도 같은 규칙으로 환경 변수를 읽으려면 `@next/env`의 `loadEnvConfig`를 사용한다.

```bash
npm install @next/env
```

```ts
// envConfig.ts
import { loadEnvConfig } from '@next/env'

loadEnvConfig(process.cwd())
```

```ts
// orm.config.ts
import './envConfig'

export default defineConfig({
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
})
```

#### 다른 변수 참조하기

`.env*` 안에서 `$VARIABLE`로 다른 환경 변수를 참조하면 Next.js가 값을 확장한다.

```bash
TWITTER_USER=nextjs
TWITTER_URL=https://x.com/$TWITTER_USER
```

이때 `process.env.TWITTER_URL`은 `https://x.com/nextjs`가 된다.

> **알아두면 좋은 점**: 값 자체에 `$` 문자가 필요하면 `\$`로 escape한다.

### 브라우저용 환경 변수 번들링

`NEXT_PUBLIC_`이 없는 변수는 Node.js 환경에서만 사용할 수 있다. 브라우저에서 필요한 값은 접두사를 붙인다.

```bash
NEXT_PUBLIC_ANALYTICS_ID=abcdefghijk
```

Next.js는 `next build` 때 `process.env.NEXT_PUBLIC_ANALYTICS_ID` 참조를 실제 값으로 바꾸고 클라이언트 JavaScript에 inline한다. 따라서 이 값은 공개 정보이며 비밀을 넣어서는 안 된다.

빌드한 뒤에는 변수 값이 바뀌어도 클라이언트 번들이 반응하지 않는다. 하나의 Docker 이미지나 빌드 결과를 여러 환경으로 승격하면 `NEXT_PUBLIC_` 값은 빌드한 환경의 값으로 고정된다. 클라이언트에서 런타임 값이 필요하면 초기화 또는 요청 시 서버 API를 통해 제공해야 한다.

Next.js는 정적 속성 접근만 inline한다. 다음과 같은 다이나믹 조회는 변환하지 않는다.

```js
const key = 'NEXT_PUBLIC_ANALYTICS_ID'
setupAnalyticsService(process.env[key])

const env = process.env
setupAnalyticsService(env.NEXT_PUBLIC_ANALYTICS_ID)
```

### 런타임 환경 변수

환경 변수는 기본적으로 서버에서만 사용할 수 있으므로 App Router의 다이나믹 렌더링에서는 요청 시점 값을 안전하게 읽을 수 있다. [`connection()`](../3-api-reference/3.3-functions/connection.md), `cookies()`, `headers()` 같은 요청 시점 API를 사용하면 해당 코드는 런타임에 평가된다.

```tsx
import { connection } from 'next/server'

export default async function Component() {
  await connection()
  const value = process.env.MY_VALUE
  return <p>{value}</p>
}
```

이 방식은 하나의 Docker 이미지를 여러 환경으로 승격하면서 서버 변수만 환경별로 바꿀 수 있게 한다.

> **알아두면 좋은 점**: 서버 시작 때 코드를 실행해야 한다면 [`register`](./instrumentation.md)도 사용할 수 있다.

### 테스트 환경 변수

`development`, `production` 외에 `test` 환경이 있다. `.env.test`에 테스트 기본값을 정의할 수 있으며, `NODE_ENV=test`에서는 `.env.development`와 `.env.production`을 읽지 않는다. Jest나 Cypress 같은 도구가 보통 `NODE_ENV`를 설정한다.

> **알아두면 좋은 점**: 테스트는 누구에게나 같은 결과를 내야 하므로 `.env.local`을 로드하지 않는다. `.env.test`는 저장소에 포함할 수 있지만 개인 override인 `.env.test.local`은 포함하지 않는다.

테스트 전역 설정에서도 `@next/env`를 사용할 수 있다.

```js
import { loadEnvConfig } from '@next/env'

export default async () => {
  loadEnvConfig(process.cwd())
}
```

### 환경 변수 탐색 순서

Next.js는 다음 순서로 값을 찾고, 처음 발견한 값을 사용한다.

1. `process.env`
2. `.env.$(NODE_ENV).local`
3. `.env.local` (`NODE_ENV=test`일 때는 확인하지 않음)
4. `.env.$(NODE_ENV)`
5. `.env`

예를 들어 `NODE_ENV=development`이고 `.env.development.local`과 `.env`에 같은 변수가 있으면 `.env.development.local` 값이 선택된다.

> **알아두면 좋은 점**: `NODE_ENV`에 허용되는 값은 `production`, `development`, `test`다.

### 알아두면 좋은 점

- `/src` 디렉터리를 사용해도 `.env.*`는 프로젝트 루트에 둔다.
- `NODE_ENV`가 없으면 `next dev`는 `development`, 나머지 Next.js 명령은 `production`을 지정한다.

### 버전 기록

| 버전 | 변경 사항 |
|---|---|
| `v9.4.0` | `.env`와 `NEXT_PUBLIC_` 지원 추가 |

## 예제 및 데모 설계

- 데모 가능 여부: 가능 (Phase 2에서 구현 예정)
- 데모 목적: 서버 전용 값, 빌드 시 inline 공개 값, 요청 시점 런타임 값의 수명을 비교한다.
- 사용자가 확인할 화면과 상호작용:
  - `NEXT_PUBLIC_` 변수는 재빌드 전에는 바뀌지 않고 서버 변수는 새 요청에 반영되는지 확인한다.
  - `.env.local`, `.env.development`, `process.env`에 같은 키를 두고 우선순위를 확인한다.
  - `NODE_ENV=test`에서 `.env.local`이 무시되고 `.env.test`가 로드되는지 확인한다.

## 연습 문제

1. 브라우저 코드에서 사용할 수 있도록 빌드 시 inline되는 접두사는 무엇인가?

   - A. `SERVER_ONLY_`
   - B. `NEXT_PUBLIC_`
   - C. `NODE_ENV_`

   <details><summary>정답 보기</summary>

   정답: B. 이 접두사가 붙은 값은 클라이언트 번들에 포함되므로 공개 정보로 취급한다.

   </details>

2. `NODE_ENV=test`에서 로드하지 않는 파일은 무엇인가?

   - A. `.env.test`
   - B. `.env.local`
   - C. `process.env`

   <details><summary>정답 보기</summary>

   정답: B. 테스트 재현성을 위해 개인 override인 `.env.local`을 무시한다.

   </details>

3. 환경 변수 탐색 순서에서 가장 먼저 확인하는 위치는 어디인가?

   - A. `.env`
   - B. `.env.local`
   - C. `process.env`

   <details><summary>정답 보기</summary>

   정답: C. 이미 프로세스에 설정된 값을 가장 먼저 사용한다.

   </details>

## 챕터 요약

- Next.js는 프로젝트 루트의 `.env*` 파일을 `process.env`로 로드한다.
- 서버 변수는 기본적으로 비공개이고 `NEXT_PUBLIC_` 값은 빌드 시 클라이언트에 inline된다.
- 공개 변수는 빌드 뒤 고정되며 서버의 다이나믹 렌더링에서는 런타임 값을 읽을 수 있다.
- 테스트에서는 `.env.local`을 무시하고 `.env.test`로 재현 가능한 기본값을 제공한다.
- 중복 키는 `process.env`에서 `.env` 순서로 탐색해 처음 찾은 값을 사용한다.
