# turbopackMemoryEviction

- 공식 문서: [turbopackMemoryEviction](https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopackMemoryEviction)
- 상위 메뉴: [next.config.js](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

## 학습 목표

- persistent `FileSystem Cache`가 활성화된 상태에서 Turbopack이 메모리를 회수하는 방식을 이해한다.
- `false`, `'auto'`, `'full'` 세 가지 회수 전략의 차이를 구분한다.
- 이 옵션은 `next dev` 세션과 `FileSystem Cache`가 함께 활성화된 경우에만 효과가 있다는 제한을 파악한다.

## 핵심 개념 및 설명

### Usage (사용법)

`turbopackMemoryEviction`은 persistent `FileSystem Cache`를 사용하는 동안 Turbopack이 메모리를 회수할지를 제어한다. Turbopack은 캐시 snapshot을 디스크에 쓴 뒤 메모리에 남아 있는 데이터 사본을 회수할 수 있다. 필요한 데이터는 나중에 디스크에서 다시 읽는다.

현재 세 가지 옵션을 사용할 수 있다.

- `false`: 회수하지 않는다. 캐시 데이터는 프로세스 수명 동안 메모리에 남는다.
- `'auto'` (기본값): snapshot을 저장한 뒤, 마지막 회수 이후 메모리가 충분히 할당되어 회수할 가치가 생겼을 때만 회수한다. 운영체제의 임계값과 메모리 압박 피드백으로 시점을 판단한다.
- `'full'`: 디스크에 저장할 때마다 메모리에서 회수할 수 있는 데이터를 모두 회수한다.

> **알아두면 좋은 점**:
>
> 이 옵션은 [FileSystem Cache](./turbopackFileSystemCache.md)를 활성화한 `next dev` 세션에서만 효과가 있다. 이미 디스크에 저장된 데이터가 있어야 회수할 수 있기 때문이다. 이 기능은 `experimental` 상태이며 활발히 개발 중이다.

```ts filename="next.config.ts" switcher
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    turbopackMemoryEviction: 'auto',
  },
}

export default nextConfig
```

### Version Changes (버전 변경 이력)

| 버전 | 변경 사항 |
| --- | --- |
| `v16.3.0` | `turbopackMemoryEviction`을 `experimental` 기능으로 공개했다. |

## 예제 및 데모 설계

- 데모 가능 여부: 불가
- 메모리 회수와 디스크 snapshot 재사용은 Turbopack의 `next dev` 프로세스와 운영체제 메모리 상태에 따라 일어난다. 배포된 브라우저 화면만으로는 이 동작을 직접 관찰하기 어렵다.
- 로컬 환경에서는 `turbopackMemoryEviction`을 `false`, `'auto'`, `'full'`로 바꿔가며 개발 서버의 메모리 사용량과 캐시 재사용 로그를 비교하는 실험을 설계할 수 있다.

## 연습 문제

1. `turbopackMemoryEviction: 'auto'`의 동작으로 올바른 것은?
   - A. 프로세스 수명이 끝날 때까지 캐시를 회수하지 않는다.
   - B. 마지막 회수 이후 메모리가 충분히 할당되어 회수할 가치가 생긴 뒤 snapshot을 저장하면 데이터를 회수한다.
   - C. 디스크에 저장할 때마다 가능한 모든 데이터를 회수한다.

<details><summary>정답 보기</summary>

정답: **B**<br>해설: `'auto'`는 마지막 회수 이후 할당된 메모리 양과 운영체제의 메모리 압박 피드백을 바탕으로 회수 시점을 정한다.
</details>

2. 이 옵션이 효과를 내는 조건은?
   - A. `next build`에서만 사용해야 한다.
   - B. `next dev` 세션에서 `FileSystem Cache`가 활성화되어야 한다.
   - C. webpack을 사용해야 한다.

<details><summary>정답 보기</summary>

정답: **B**<br>해설: 공식 문서는 `next dev` 세션에서 `FileSystem Cache`가 활성화되어야 이 옵션이 효과를 낸다고 설명한다.
</details>

## 챕터 요약

- `turbopackMemoryEviction`은 persistent `FileSystem Cache`의 메모리 회수 방식을 설정한다.
- `false`는 회수하지 않고, `'auto'`는 회수할 가치가 생긴 시점에 회수하며, `'full'`은 저장할 때마다 가능한 데이터를 회수한다.
- 이 옵션은 `next dev` 세션에서 `FileSystem Cache`가 활성화된 경우에만 효과가 있다.
- 이 기능은 `experimental` 상태이며 활발히 개발 중이다.
- `v16.3.0`에 `experimental` 기능으로 공개됐다.
