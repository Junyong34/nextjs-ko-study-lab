# Memory Usage

- 공식 문서: [Memory Usage](https://nextjs.org/docs/app/guides/memory-usage)
- 상위 메뉴: [Guides](./README.md)
- 전체 목차: [Next.js 학습 문서](../README.md)

## 학습 목표

- 개발과 빌드 중 메모리를 많이 쓰는 의존성, cache, source map, 정적 분석 요인을 찾는다.
- Next.js 메모리 진단 모드, heap profile, heap snapshot을 상황에 맞게 사용한다.
- 메모리 절약 설정의 성능과 정확성 trade-off를 평가한다.

## 핵심 개념 및 설명

기능과 의존성이 늘면 개발 서버와 프로덕션 빌드가 더 많은 메모리를 요구한다. 먼저 메모리 사용량을 측정하고 큰 의존성을 줄인 뒤, 진단 기능과 설정 변경을 적용한다.

### 의존성과 Webpack 메모리 최적화

Bundle Analyzer로 큰 의존성을 찾아 제거하거나 더 작은 모듈로 바꾼다. Webpack을 사용한다면 Next.js 15.0.0부터 다음 옵션으로 최대 메모리 사용량을 낮출 수 있다. 컴파일 시간은 조금 늘 수 있다.

```js
module.exports = {
  experimental: {
    webpackMemoryOptimizations: true,
  },
}
```

> **알아두면 좋은 점**: `webpackMemoryOptimizations`는 아직 실험 기능이지만 낮은 위험도로 평가된다.

### 빌드 메모리 진단

Next.js 14.2.0부터 빌드 중 heap 사용량과 garbage collection 통계를 계속 출력하고 한계에 가까워지면 snapshot을 만드는 모드를 제공한다.

```bash
next build --experimental-debug-memory-usage
```

> **알아두면 좋은 점**: 이 모드는 커스텀 Webpack 설정이 없을 때 자동 활성화되는 Webpack build worker와 호환되지 않는다.

Node.js heap profile은 빌드 전체의 할당 흐름을 살필 때 쓴다.

```bash
node --heap-prof node_modules/next/dist/bin/next build
```

생성된 `.heapprofile`을 Chrome DevTools Memory 탭의 Load Profile로 연다.

특정 시점에 남아 있는 객체를 보려면 inspector로 연결해 heap snapshot을 기록한다.

```bash
NODE_OPTIONS=--inspect next build
# 사용자 코드 전 실행을 멈추려면 --inspect-brk를 사용한다.
```

`--experimental-debug-memory-usage` 실행 중 `SIGUSR2`를 보내도 프로젝트 루트에 heap snapshot을 만들 수 있다.

### build worker와 cache

Webpack build worker는 별도 Node.js worker에서 컴파일해 주 프로세스 메모리를 줄인다. Next.js 14.1.0부터 커스텀 Webpack 설정이 없으면 기본 활성화된다. 오래된 버전이나 커스텀 구성에서는 `experimental.webpackBuildWorker: true`를 검토한다.

> **알아두면 좋은 점**: 일부 커스텀 Webpack plugin은 build worker와 호환되지 않을 수 있다.

Webpack cache는 빌드 속도를 높이는 대신 메모리와 디스크를 쓴다. 메모리가 더 중요한 환경에서는 프로덕션 cache 방식을 조정할 수 있지만 재빌드가 느려지는지 함께 측정한다.

### 정적 분석과 source map

TypeScript 검사는 대형 프로젝트에서 많은 메모리를 쓸 수 있다. 빌드에서 `ignoreBuildErrors: true`를 사용하면 타입 오류가 있어도 산출물이 만들어지므로 위험하다. 별도 CI의 타입 검사가 성공하고 staging 검증까지 끝난 결과만 프로덕션으로 승격한다.

source map 생성도 빌드 메모리를 쓴다. `productionBrowserSourceMaps`, `experimental.serverSourceMaps`, prerender 단계의 `enablePrerenderSourceMaps`를 끌 수 있지만 운영 오류 추적 능력이 줄어든다. 일부 plugin이 source map을 다시 켤 수 있으므로 최종 설정을 확인한다.

### Edge와 entry preload

Edge Runtime 메모리 문제는 Next.js 14.1.3에서 수정됐으므로 그 이상으로 업데이트한다. 서버 시작 시 모든 page 모듈을 미리 올리는 동작은 첫 응답을 빠르게 하지만 초기 메모리를 늘린다.

```ts
import type { NextConfig } from 'next'

const config: NextConfig = {
  experimental: {
    preloadEntriesOnStart: false,
  },
}

export default config
```

preload를 꺼도 요청된 모듈은 unload되지 않는다. 결국 모든 page가 요청되면 최종 메모리 크기는 같아질 수 있다.

## 예제 및 데모 설계

- Phase 2에서 메모리를 많이 쓰는 의존성을 넣고 Bundle Analyzer 결과와 빌드 최대 heap을 기록한다.
- 일반 빌드와 `--experimental-debug-memory-usage` 빌드의 로그를 비교한다.
- heap profile과 snapshot을 Chrome DevTools에서 열어 retained object 경로를 찾는다.

## 연습 문제

1. 빌드 중 heap 사용량과 garbage collection 통계를 계속 출력하는 옵션은 무엇인가?

   1. `--inspect-wait`
   2. `--experimental-debug-memory-usage`
   3. `--internal-trace`
   4. `--webpack`

   <details><summary>정답 보기</summary>

   **정답: 2**. 이 빌드 모드는 메모리 통계를 출력하고 한계에 가까워지면 snapshot도 만든다.

   </details>

2. `preloadEntriesOnStart: false`의 설명으로 맞는 것은 무엇인가?

   1. 모든 모듈을 영구히 unload한다.
   2. 서버의 초기 module preload를 끄지만 요청된 모듈은 계속 메모리에 남을 수 있다.
   3. source map만 비활성화한다.
   4. 타입 검사를 생략한다.

   <details><summary>정답 보기</summary>

   **정답: 2**. 초기 메모리는 줄일 수 있지만 모든 page가 요청되면 최종 크기는 같아질 수 있다.

   </details>

## 챕터 요약

- 큰 의존성을 줄이는 것이 메모리 최적화의 첫 단계다.
- Next.js 진단 모드, heap profile, heap snapshot은 서로 다른 관점의 증거를 제공한다.
- build worker와 Webpack cache는 메모리와 호환성 또는 속도를 맞바꾼다.
- 타입 검사와 source map을 끄면 정확성과 운영 디버깅 능력이 낮아진다.
- entry preload를 꺼도 요청된 모듈은 계속 쌓일 수 있다.
