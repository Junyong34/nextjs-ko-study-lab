# Development Environment

- 공식 문서: [Development Environment](https://nextjs.org/docs/app/guides/local-development)
- 상위 메뉴: [Guides](./README.md)
- 전체 목차: [Next.js 학습 문서](../README.md)

## 학습 목표

- `next dev`와 프로덕션 빌드의 컴파일 방식 차이를 설명한다.
- 로컬 컴파일 지연을 파일 시스템, bundler, import, CSS, 데이터 요청 관점에서 점검한다.
- fetch 로그와 Turbopack trace로 느린 구간을 근거 있게 찾는다.

## 핵심 개념 및 설명

앱이 커지면 로컬 컴파일 시간이 늘 수 있다. 무작정 설정을 바꾸기 전에 개발 모드가 어떤 작업을 하고 있는지 확인하고 병목을 재현한다.

### 로컬 개발과 프로덕션의 차이

`next dev`는 방문하거나 이동한 route를 필요할 때 컴파일한다. 모든 route를 미리 만들지 않아 시작이 빠르고 메모리도 덜 쓴다. `next build`는 minify와 content hash 생성 같은 프로덕션 최적화까지 수행하므로 로컬 개발과 실행 시간 및 자원 사용량을 직접 비교하면 안 된다.

### 로컬 개발 성능 점검 순서

1. **백신과 파일 검사**: 실시간 검사 도구가 소스 파일 읽기를 늦출 수 있다. Windows에서는 Microsoft Defender의 프로젝트 폴더 제외를 검토하고, macOS에서는 신뢰할 수 있는 터미널을 Developer Tools로 허용한다. 조직의 보안 정책을 먼저 따른다.
2. **Next.js와 Turbopack**: 최신 Next.js의 성능 개선을 확인한다. Turbopack은 개발 모드의 기본 bundler다. Webpack이 꼭 필요할 때만 `pnpm dev --webpack`을 사용한다.
3. **import 범위**: 큰 아이콘 패키지의 barrel export 대신 필요한 모듈을 직접 import한다. Dependency Cruiser나 Madge로 의존 관계를 살펴볼 수 있다.
4. **package import 최적화**: Webpack에서 barrel 파일이 큰 패키지는 `experimental.optimizePackageImports`를 검토한다. Turbopack은 import를 자동 분석하므로 이 설정이 필요 없다.
5. **Tailwind CSS**: `content` glob이 `node_modules`나 넓은 상위 디렉토리까지 훑지 않도록 실제 소스 범위로 좁힌다.
6. **커스텀 Webpack 설정**: 개발 중에도 실행되는 plugin과 loader가 병목인지 확인한다. 필요하면 프로덕션에서만 켜거나 Turbopack loader로 옮긴다.
7. **메모리**: 큰 앱은 [Memory Usage](./memory-usage.md)의 heap 진단과 설정을 적용한다.
8. **Server Component 데이터 요청**: Server Component 수정은 페이지 재렌더링과 데이터 재요청을 일으킨다. `serverComponentsHmrCache`는 HMR 사이의 `fetch` 응답을 캐시해 개발 응답과 과금 API 호출을 줄일 수 있다.
9. **Docker 파일 시스템**: macOS와 Windows의 Docker bind mount는 HMR을 크게 늦출 수 있다. 가능하면 개발은 로컬에서 하고 Docker는 프로덕션 빌드 검사에 사용한다.

```js
// next.config.js
module.exports = {
  experimental: {
    optimizePackageImports: ['package-name'],
  },
}
```

### 문제를 찾는 도구

개발 중 데이터 요청을 자세히 보려면 fetch 전체 URL 로그를 켠다.

```js
module.exports = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
}
```

Turbopack trace는 모듈별 컴파일 시간과 관계를 기록한다.

```bash
pnpm dev --internal-trace
# 느린 동작을 재현한 뒤 서버를 종료한다.
npx next internal trace .next-profiles/trace-turbopack.bin
```

`trace` 명령이 없는 버전은 `npx next internal turbo-trace-server .next-profiles/trace-turbopack.bin`을 사용한다. trace viewer에서 집계 순서와 개별 span 순서를 바꿔 병목을 찾는다.

> **알아두면 좋은 점**: trace 파일은 프로젝트 루트의 `.next-profiles` 디렉토리에 저장된다. 해결하지 못한 문제를 보고할 때 이 파일과 재현 절차를 GitHub Discussions나 Discord에 함께 제공한다.

## 예제 및 데모 설계

- Phase 2에서 큰 barrel import와 직접 import의 첫 컴파일 시간을 비교한다.
- fetch 상세 로그로 HMR 전후의 Server Component 요청 횟수를 기록한다.
- Turbopack trace를 생성해 가장 오래 걸린 모듈과 의존 경로를 찾는다.

## 연습 문제

1. `next dev`가 모든 route를 시작 전에 컴파일하지 않는 이유로 맞는 것은 무엇인가?

   1. 방문한 route를 필요할 때 컴파일해 시작 시간과 메모리를 줄이기 위해서다.
   2. 프로덕션 minify를 생략하지 않기 위해서다.
   3. content hash를 먼저 만들기 위해서다.
   4. E2E 테스트를 자동 실행하기 위해서다.

   <details><summary>정답 보기</summary>

   **정답: 1**. 개발 모드는 필요한 route를 지연 컴파일한다.

   </details>

2. Turbopack trace 파일이 기본 저장되는 곳은 어디인가?

   1. `public`
   2. `.next-profiles`
   3. `node_modules/.cache`
   4. `app`

   <details><summary>정답 보기</summary>

   **정답: 2**. 프로젝트 루트의 `.next-profiles`에 `trace-turbopack.bin`이 생성된다.

   </details>

## 챕터 요약

- 개발 모드는 방문한 route를 지연 컴파일하므로 프로덕션 빌드와 동작이 다르다.
- 파일 검사, bundler, import, Tailwind glob, 커스텀 Webpack 설정을 차례로 점검한다.
- Server Component HMR은 데이터 재요청까지 일으킬 수 있다.
- macOS와 Windows에서는 Docker 파일 시스템이 HMR 병목이 될 수 있다.
- fetch 로그와 Turbopack trace로 추측 대신 측정값을 남긴다.
