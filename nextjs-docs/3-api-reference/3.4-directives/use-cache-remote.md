# use cache: remote

- 공식 문서: [use cache: remote](https://nextjs.org/docs/app/api-reference/directives/use-cache-remote)
- 상위 메뉴: [Directives](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- `'use cache: remote'` 지시어의 역할과 원격 캐시 핸들러(Redis, KV 등)를 활용한 서버 인스턴스 간 공유 캐시 원리를 이해한다.
- 일반 `use cache`(인메모리), `'use cache: private'`(브라우저 메모리), `'use cache: remote'`(분산 원격 저장소) 3대 캐싱 지시어의 차이를 비교한다.
- 레이트 리밋이 걸린 외부 API, 고비용 DB 집계 연산 등 원격 캐싱이 적합한 시나리오와 부적합한 시나리오를 구분한다.
- 캐시 키 고유값 분산을 방지하기 위한 캐시 키 설계 패턴과 캐시 지시어 간 중첩 규칙(Nesting Rules)을 적용한다.

## 핵심 개념 및 설명

일반 `use cache` 지시어는 대부분의 애플리케이션 요구사항에 충분하지만, 서버 인스턴스의 메모리(in-memory)에 캐시를 저장하므로 다음과 같은 한계가 발생할 수 있다:

- 새 항목 추가 시 기존 캐시 축출(eviction)
- 서버리스(Serverless) 환경에서 요청마다 인스턴스가 달라져 메모리가 공유되지 않는 문제
- 서버 재시작 시 인메모리 캐시 초기화

`'use cache: remote'` 지시어는 캐시된 출력을 인메모리 대신 **원격 캐시(Remote Cache Handler)**에 저장하도록 선언하여, 모든 서버 인스턴스가 공유할 수 있는 지속성 높은 캐시 레이어를 제공한다. 단, 원격 캐시 조회에 따른 네트워크 지연과 인프라 비용이 수반된다.

### 사용법 (Usage)

`next.config.ts` 파일에서 [`cacheComponents`](../3.5-config/3.5.1-next-config-js/cacheComponents.md) 플래그를 활성화한다:

```ts filename="next.config.ts" switcher
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
}

export default nextConfig
```

```js filename="next.config.js" switcher
/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: true,
}

module.exports = nextConfig
```

원격 캐싱이 필요한 함수나 컴포넌트에 `'use cache: remote'` 지시어를 선언한다. 자체 호스팅 환경에서는 [`cacheHandlers`](../3.5-config/3.5.1-next-config-js/cacheHandlers.md)를 통해 원격 저장소(Redis 등)를 설정할 수 있다:

```tsx filename="lib/data.ts"
import { cacheLife, cacheTag } from 'next/cache'

export async function getGlobalStats() {
  'use cache: remote'
  cacheTag('global-stats')
  cacheLife({ expire: 60 }) // 1분간 원격 캐시 유지

  // 모든 사용자가 원격 캐시를 공유하므로 DB에는 분당 최대 1회의 쿼리만 발생한다
  return await db.analytics.aggregate({
    totalUsers: 'count',
    revenue: 'sum',
  })
}
```

### 원격 캐시 사용 권장 시점과 비권장 시점

#### 권장 시점

- **호출량 제한(Rate-limited) API**: 업스트림 서비스의 요청 쿼터를 초과할 위험이 있는 경우.
- **느린 백엔드 및 DB 보호**: 트래픽 급증 시 데이터베이스 병목을 방지해야 하는 경우.
- **고비용 연산**: 반복 실행 시 서버 자원 소모가 큰 집계 쿼리나 복잡한 알고리즘 연산.
- **서버리스 환경의 요청 시점(Request time) 렌더링**: 각 서버리스 인스턴스가 단일 원격 캐시를 공유하여 캐시 적중률(Hit Rate)을 극대화해야 하는 경우.

#### 비권장 시점

- 데이터 레이어 앞단에 이미 별도의 KV 캐시가 구성되어 있는 경우.
- 연산 속도가 이미 50ms 미만으로 매우 빠른 로컬 작업인 경우(오히려 네트워크 조회 지연 발생).
- 캐시 키의 고유값(Unique Values)이 너무 많아 적중률이 거의 없는 경우(개인화 검색 필터 등).
- 데이터가 초/분 단위로 너무 자주 바뀌는 경우.

### 3대 캐싱 지시어 완벽 비교

| 기능 / 특성 | `use cache` | `'use cache: remote'` | `'use cache: private'` |
|---|---|---|---|
| **서버 측 캐싱** | 인메모리(기본) 또는 핸들러 | **원격 캐시 핸들러** | 없음 ❌ |
| **캐시 공유 범위** | 모든 사용자 공유 | **모든 사용자 공유 (인스턴스 간 공유)** | 단일 클라이언트(브라우저 메모리) |
| **쿠키/헤더 직접 접근** | 불가능 ❌ (인자로 전달) | 불가능 ❌ (인자로 전달) | **가능 ⭕** |
| **서버 캐시 적중률** | static shell 밖에서는 낮을 수 있음 | **인스턴스 간 공유로 높음** | N/A |
| **추가 인프라 비용** | 없음 | 원격 저장소 및 네트워크 비용 | 없음 |
| **조회 지연 시간** | 메모리 접근 (매우 빠름) | 원격 핸들러 네트워크 조회 지연 | 메모리 접근 (매우 빠름) |
| **배포 간 유지 여부** | 유지 안 됨 (새 빌드 시 무효화) | 유지 안 됨 (새 빌드 시 무효화) | N/A |

### 캐시 키 최적화 전략

고유값이 많은 차원(예: 사용자 ID, 세부 가격 필터)으로 캐시 키를 생성하면 캐시 항목만 급증하고 적중률이 떨어진다. 고유값이 적은 상위 차원(카테고리, 언어 코드, 통화 단위)으로 원격 캐시를 생성하고, 세부 필터링은 메모리에서 처리하는 것이 모범 사례다.

```tsx filename="app/components/welcome-message.tsx"
import { cookies } from 'next/headers'
import { cacheLife } from 'next/cache'

export async function WelcomeMessage() {
  // 쿠키에서 언어 설정 추출 (유저당 고유값이 아닌 언어별 공유 값)
  const language = (await cookies()).get('language')?.value || 'ko'
  const content = await getCMSContent(language)

  return <div>{content.welcomeMessage}</div>
}

async function getCMSContent(language: string) {
  'use cache: remote'
  cacheLife({ expire: 3600 })
  // 사용자 수천 명 단위가 아니라 언어별(~수십 개)로 캐시가 공유됨
  return cms.getHomeContent(language)
}
```

### 지시어 중첩 규칙 (Nesting Rules)

- `remote` 내부에 `remote` 중첩 ⭕ (허용)
- 일반 `use cache` 내부에 `remote` 중첩 ⭕ (허용)
- `private` 내부에 `remote` 중첩 ❌ (에러 발생)
- `remote` 내부에 `private` 중첩 ❌ (에러 발생)

```tsx filename="app/product/[id]/page.tsx"
// ⭕ 올바른 예: 일반 캐시 내부의 원격 캐시
async function outerCache() {
  'use cache'
  return await innerRemote()
}

async function innerRemote() {
  'use cache: remote'
  return getData()
}

// ❌ 금지된 예: private과 remote의 상호 중첩
async function outerPrivate() {
  'use cache: private'
  return await innerRemote() // 에러!
}
```

### Version History

| 버전 | 변경 사항 |
|---|---|
| `v16.0.0` | Cache Components 기능과 함께 `"use cache: remote"` 활성화 |

## 예제 및 데모 설계

- 대시보드 통계 집계 함수에 `'use cache: remote'`와 `cacheLife({ expire: 60 })`를 적용하고, 동시 요청 시 DB 쿼리가 단 1회만 발생하는지 모니터링하는 데모를 설계한다.
- 통화(Currency) 쿠키 값에 따라 가격을 원격 캐시하고, 동일 통화를 사용하는 사용자 간 캐시 적중을 확인한다.
- `use cache: private`와 `use cache: remote`를 잘못 중첩했을 때 발생하는 정적 분석 오류를 검증한다.

## 연습 문제

1. `'use cache: remote'` 지시어가 일반 `'use cache'`에 비해 제공하는 핵심적인 기술적 이점은?
   - A. 클라이언트 브라우저의 localStorage를 사용한다.
   - B. 서버리스 다중 인스턴스 환경에서도 모든 인스턴스가 공유하는 지속성 높은 원격 캐시를 제공한다.
   - C. 함수 내부에서 `cookies()`와 `headers()`를 직접 호출할 수 있게 해준다.
   - D. 새 버전 배포 후에도 캐시가 영구히 삭제되지 않는다.

<details><summary>정답 보기</summary>

정답: **B**  
해설: `'use cache: remote'`는 인메모리 대신 원격 분산 캐시 저장소를 활용하여 다중 서버리스 인스턴스 간에 캐시를 공유하고 적중률을 극대화한다.
</details>

2. 다음 중 캐싱 지시어 중첩으로 유효하지 **않은** 조합은?
   - A. `'use cache: remote'` 내부에서 다른 `'use cache: remote'` 함수 호출
   - B. 일반 `'use cache'` 내부에서 `'use cache: remote'` 함수 호출
   - C. `'use cache: private'` 내부에서 `'use cache: remote'` 함수 호출
   - D. 일반 함수 내부에서 `'use cache: remote'` 함수 호출

<details><summary>정답 보기</summary>

정답: **C**  
해설: 프라이빗 캐시(`use cache: private`)와 원격 캐시(`use cache: remote`)는 서로 중첩 호출될 수 없다.
</details>

## 챕터 요약

- `'use cache: remote'`는 캐시 항목을 원격 캐시 핸들러에 저장하여 모든 서버 인스턴스가 공유하도록 만드는 지시어다.
- 서버리스 환경에서 인스턴스별 메모리 파편화로 인한 낮은 캐시 적중률 문제를 해결한다.
- 요율 제한 API 보호, 느린 DB 쿼리 부하 분산, 고비용 연산 최적화에 탁월하다.
- 캐시 키는 고유값이 많은 데이터(유저 ID 등)보다 공유 가능한 범주(언어, 통화 등) 단위로 설계해야 한다.
- `private` 캐시와 `remote` 캐시는 상호 중첩될 수 없다.
