# staticGeneration*

- 공식 문서: [staticGeneration*](https://nextjs.org/docs/app/api-reference/config/next-config-js/staticGeneration)
- 상위 메뉴: [next.config.js](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

## 학습 목표

- `staticGeneration*` 옵션이 Static Generation 프로세스를 조정하는 방식을 이해한다.
- 페이지 생성이 실패했을 때의 재시도 횟수와 worker별 처리량 설정을 구분한다.
- 세 가지 옵션이 빌드 성공 여부와 worker 실행에 미치는 영향을 설명한다.

## 핵심 개념 및 설명

`staticGeneration*` 옵션은 고급 사용 사례에서 Static Generation 프로세스를 구성하는 데 쓴다.

> **experimental**: 이 기능은 현재 실험적이며 변경될 수 있다. 프로덕션 사용은 권장하지 않는다. 테스트해 보고 [GitHub](https://github.com/vercel/next.js/issues)에 의견을 남길 수 있다.

```ts filename="next.config.ts" switcher
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    staticGenerationRetryCount: 1,
    staticGenerationMaxConcurrency: 8,
    staticGenerationMinPagesPerWorker: 25,
  },
}

export default nextConfig
```

```js filename="next.config.js" switcher
const nextConfig = {
  experimental: {
    staticGenerationRetryCount: 1,
    staticGenerationMaxConcurrency: 8,
    staticGenerationMinPagesPerWorker: 25,
  },
}

module.exports = nextConfig
```

## Config Options

다음 옵션을 사용할 수 있다.

- `staticGenerationRetryCount`: 페이지 생성에 실패했을 때 빌드를 실패로 처리하기 전까지 다시 시도하는 횟수다.
- `staticGenerationMaxConcurrency`: worker 하나가 처리할 수 있는 페이지의 최대 개수다.
- `staticGenerationMinPagesPerWorker`: 새 worker를 시작하기 전에 처리해야 하는 페이지의 최소 개수다.

## 예제 및 데모 설계

- 데모 가능 여부: 불가
- 이 옵션은 Static Generation과 빌드 worker의 처리 방식을 조정하므로 배포된 브라우저 화면만으로 직접 관찰하기 어렵다.
- 브라우저 데모 대신 로컬 빌드에서 검증 절차를 설계할 수 있다. 페이지 생성이 실패했을 때의 재시도 횟수와 worker별 처리 페이지 수를 로그와 빌드 시간으로 비교하는 방식이다.

## 연습 문제

1. `staticGenerationRetryCount`가 조정하는 값은 무엇인가?
   - A. 한 worker가 동시에 처리하는 페이지 수
   - B. 실패한 페이지 생성을 다시 시도하는 횟수
   - C. 새 worker를 시작하는 최소 페이지 수
   - D. 브라우저의 페이지 캐시 기간

<details><summary>정답 보기</summary>

정답: **B**<br>
해설: `staticGenerationRetryCount`는 실패한 페이지 생성을 빌드 실패 전에 다시 시도하는 횟수다.
</details>

2. `staticGenerationMaxConcurrency`의 의미는 무엇인가?
   - A. worker 하나가 처리할 수 있는 최대 페이지 수
   - B. 빌드 전체에서 생성할 수 있는 최대 라우트 수
   - C. 페이지 생성의 최대 재시도 횟수
   - D. 클라이언트 내비게이션의 최대 동시 요청 수

<details><summary>정답 보기</summary>

정답: **A**<br>
해설: 이 옵션은 worker 하나가 동시에 처리할 수 있는 페이지 수를 제한한다.
</details>

3. `staticGenerationMinPagesPerWorker`의 설명으로 올바른 것은 무엇인가?
   - A. 새 worker를 시작하기 전에 처리해야 하는 페이지의 최소 개수다.
   - B. worker 하나가 처리할 수 있는 페이지의 최대 개수다.
   - C. 실패한 페이지 생성을 다시 시도하는 횟수다.
   - D. 브라우저에서 캐시할 페이지의 최소 개수다.

<details><summary>정답 보기</summary>

정답: **A**<br>
해설: `staticGenerationMinPagesPerWorker`는 새 worker를 시작하기 전 처리해야 하는 최소 페이지 수를 설정한다.
</details>

## 챕터 요약

- `staticGeneration*`은 고급 사용 사례에서 Static Generation 프로세스를 구성하는 실험적 옵션 그룹이다.
- `staticGenerationRetryCount`는 페이지 생성 실패 시 재시도 횟수를 정한다.
- `staticGenerationMaxConcurrency`는 worker 하나가 처리할 수 있는 페이지의 최대 개수를 정한다.
- `staticGenerationMinPagesPerWorker`는 새 worker를 시작하기 전 처리해야 하는 페이지의 최소 개수를 정한다.
- 이 옵션들은 빌드 프로세스에 영향을 주므로 브라우저 화면만으로 동작을 직접 확인하기 어렵다.
