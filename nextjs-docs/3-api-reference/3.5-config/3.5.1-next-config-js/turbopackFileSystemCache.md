# Turbopack FileSystem Caching

- 공식 문서: [turbopackFileSystemCache](https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopackFileSystemCache)
- 상위 메뉴: [next.config.js](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

## 학습 목표

- Turbopack FileSystem Cache가 `next dev`와 `next build` 실행 사이에 작업 결과를 저장하고 복원하는 방식을 이해한다.
- 개발용 cache와 build용 cache를 각각 제어하는 두 옵션과 기본값을 구분한다.
- self-hosted builds, containerized builds, CI providers에서 `.next/cache`를 보존해야 하는 이유를 설명할 수 있다.
- FileSystem caching의 버전별 기본 활성화 시점과 `false`로 opt out하는 조건을 확인한다.

## 핵심 개념 및 설명

### 사용법 (Usage)

Turbopack FileSystem Cache는 `next dev`나 `next build`를 여러 번 실행할 때 Turbopack이 다시 해야 하는 작업을 줄인다. 활성화하면 Turbopack이 `.next` 디렉토리 아래에 데이터를 저장하고 다음 실행에서 복원한다. 그 결과 이후 build와 개발 세션이 크게 빨라질 수 있다.

cache를 제어하는 옵션은 `next dev`용과 `next build`용으로 하나씩 있다. 두 옵션은 모두 기본으로 활성화되어 있다.

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    turbopackFileSystemCacheForDev: true,
    turbopackFileSystemCacheForBuild: true,
  },
}

export default nextConfig
```

### 옵션 (Options)

- **`turbopackFileSystemCacheForDev`** (기본값: `true`): `next dev`에서 Turbopack이 수행한 작업을 `.next/dev/cache/turbopack`에 cache한다. 개발 서버를 다시 시작하면 이전 컴파일 결과를 재사용한다.
- **`turbopackFileSystemCacheForBuild`** (기본값: `true`): `next build`에서 Turbopack이 수행한 작업을 `.next/cache/turbopack`에 cache한다. 이후 build는 `warm` 상태로 시작한다. 자세한 내용은 [Build environments](#build-environments)를 참고한다.

opt out하려면 두 옵션 중 하나를 `false`로 설정한다.

### Build environments

build cache는 `.next/cache`에 저장된다. build를 실행하기 전에 이 디렉토리를 복원해야 build가 빨라진다.

- **Self-hosted builds**: build 사이에 같은 작업 디렉토리를 재사용한다. Containerized builds는 깨끗한 layer에서 시작한다. 그래서 cache하거나 명시적으로 mount하지 않으면 `.next/cache`를 다음 build로 가져가지 않는다.
- **CI providers**: [build caching을 구성](../../../2-guides/ci-build-caching.md)해 `.next/cache`를 보존한다.

build 환경이 `.next/cache`를 전혀 보존하지 않는다면 `turbopackFileSystemCacheForBuild: false`로 설정한다. 다음에 읽지 않을 cache를 쓰는 일을 건너뛸 수 있다.

### 버전 기록 (Version History)

| 버전 | 변경 사항 |
| --- | --- |
| `v16.3.0` | build에서 FileSystem caching을 기본으로 활성화했다. |
| `v16.1.0` | development에서 FileSystem caching을 기본으로 활성화했다. |
| `v16.0.0` | build와 development에 별도 플래그를 사용하는 Beta release를 제공했다. |
| `v15.5.0` | canary release에서 Persistent caching을 `experimental` 기능으로 출시했다. |

## 예제 및 데모 설계

- 데모 가능 여부: 불가
- 같은 프로젝트에서 `turbopackFileSystemCacheForDev`와 `turbopackFileSystemCacheForBuild`를 각각 `true`와 `false`로 바꿔 `next dev` 재시작과 `next build` 반복 실행 시간을 비교한다.
- `.next/dev/cache/turbopack`, `.next/cache/turbopack`, `.next/cache`가 생성되고 다음 실행에서 재사용되는지 파일 시스템과 터미널 출력으로 확인한다.
- CI에서는 build 전후에 `.next/cache`를 복원할 때와 복원하지 않을 때의 실행 결과를 비교한다.

## 연습 문제

1. `turbopackFileSystemCacheForDev`의 기본 동작으로 올바른 것은 무엇인가?
   - A. `next dev`의 작업을 `.next/dev/cache/turbopack`에 cache하고 개발 서버 재시작 후 재사용한다.
   - B. `next build` 결과를 `.next/cache/turbopack`에만 저장한다.
   - C. 개발 서버가 실행될 때마다 cache를 삭제한다.
   - D. CI provider의 원격 cache만 활성화한다.

<details><summary>정답 보기</summary>

정답: **A**  
해설: `turbopackFileSystemCacheForDev`는 `next dev` 작업을 `.next/dev/cache/turbopack`에 저장하고 개발 서버를 다시 시작할 때 이전 컴파일 결과를 재사용한다.
</details>

2. build 환경이 `.next/cache`를 보존하지 않는다면 어떤 설정을 사용할 수 있는가?
   - A. `turbopackFileSystemCacheForBuild: false`
   - B. `turbopackFileSystemCacheForDev: false`만 설정한다.
   - C. `turbopackFileSystemCacheForBuild: 'never'`
   - D. `turbopackFileSystemCacheForBuild: null`

<details><summary>정답 보기</summary>

정답: **A**  
해설: 다음 build에서 읽을 수 없는 cache를 쓰지 않도록 `turbopackFileSystemCacheForBuild`를 `false`로 설정한다.
</details>

3. FileSystem caching의 버전 기록으로 올바른 것은 무엇인가?
   - A. v16.3.0에서 build cache가 기본 활성화됐다.
   - B. v16.1.0에서 Persistent caching이 처음 출시됐다.
   - C. v15.5.0에서 build cache가 기본 활성화됐다.
   - D. v16.0.0부터 개발과 build에 하나의 플래그만 사용했다.

<details><summary>정답 보기</summary>

정답: **A**  
해설: v16.3.0에서 build의 FileSystem caching이 기본 활성화됐고, v16.1.0에서는 development의 caching이 기본 활성화됐다.
</details>

## 챕터 요약

- Turbopack FileSystem Cache는 `.next` 아래에 작업 결과를 저장하고 다음 `next dev` 또는 `next build` 실행에서 복원한다.
- `turbopackFileSystemCacheForDev`는 `.next/dev/cache/turbopack`을, `turbopackFileSystemCacheForBuild`는 `.next/cache/turbopack`을 사용한다.
- 두 옵션의 기본값은 `true`이며 각각 `false`로 설정해 opt out할 수 있다.
- build가 빨라지려면 build 전에 `.next/cache`를 복원해야 하므로 self-hosted builds와 CI providers의 cache 보존 설정이 중요하다.
- build 환경이 cache를 보존하지 않는다면 `turbopackFileSystemCacheForBuild: false`로 불필요한 cache 기록을 건너뛴다.
