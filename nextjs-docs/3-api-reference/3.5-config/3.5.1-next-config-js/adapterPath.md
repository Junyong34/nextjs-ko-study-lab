# adapterPath

- 공식 문서: [adapterPath](https://nextjs.org/docs/app/api-reference/config/next-config-js/adapterPath)
- 상위 메뉴: [next.config.js](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

## 학습 목표

- Next.js의 built-in adapters API가 배포 플랫폼이나 빌드 시스템을 빌드 과정에 연결하는 방식을 이해한다.
- `adapterPath`로 adapter 모듈의 경로를 지정하는 방법을 익힌다.
- `NEXT_ADAPTER_PATH`로 zero-config를 활성화하는 방법과 adapter 관련 후속 문서의 범위를 구분한다.

## 핵심 개념 및 설명

Next.js는 built-in adapters API를 제공한다. 배포 플랫폼이나 빌드 시스템을 Next.js 빌드 과정에 통합할 때 이 API를 사용한다. 전체 구현 예시는 [`nextjs/adapter-vercel`](https://github.com/nextjs/adapter-vercel) adapter에서 확인한다.

## 설정 (Configuration)

adapter를 사용하려면 `adapterPath`에 adapter 모듈의 경로를 지정한다.

```js filename="next.config.js"
/** @type {import('next').NextConfig} */
const nextConfig = {
  adapterPath: require.resolve('./my-adapter.js'),
}

module.exports = nextConfig
```

배포 플랫폼에서는 `NEXT_ADAPTER_PATH`를 설정해 zero-config로 사용할 수도 있다.

## Adapters

adapter의 전체 구현 방법은 전용 Adapters 문서에서 다룬다.

- [Configuration](https://nextjs.org/docs/app/api-reference/adapters/configuration)
- [Creating an Adapter](https://nextjs.org/docs/app/api-reference/adapters/creating-an-adapter)
- [API Reference](https://nextjs.org/docs/app/api-reference/adapters/api-reference)
- [Testing Adapters](https://nextjs.org/docs/app/api-reference/adapters/testing-adapters)
- [Routing with `@next/routing`](https://nextjs.org/docs/app/api-reference/adapters/routing-with-next-routing)
- [Implementing PPR in an Adapter](https://nextjs.org/docs/app/api-reference/adapters/implementing-ppr-in-an-adapter)
- [Runtime Integration](https://nextjs.org/docs/app/api-reference/adapters/runtime-integration)
- [Invoking Entrypoints](https://nextjs.org/docs/app/api-reference/adapters/invoking-entrypoints)
- [Output Types](https://nextjs.org/docs/app/api-reference/adapters/output-types)
- [Routing Information](https://nextjs.org/docs/app/api-reference/adapters/routing-information)
- [Use Cases](https://nextjs.org/docs/app/api-reference/adapters/use-cases)

## Adapter 만들기 (Creating an Adapter)

[Creating an Adapter](https://nextjs.org/docs/app/api-reference/adapters/creating-an-adapter)에서 adapter를 만드는 방법을 확인한다.

## API Reference

[API Reference](https://nextjs.org/docs/app/api-reference/adapters/api-reference)에서 adapter API를 확인한다.

## Adapter 테스트하기 (Testing Adapters)

[Testing Adapters](https://nextjs.org/docs/app/api-reference/adapters/testing-adapters)에서 adapter 테스트 방법을 확인한다.

## `@next/routing`을 사용한 라우팅 (Routing with `@next/routing`)

[Routing with `@next/routing`](https://nextjs.org/docs/app/api-reference/adapters/routing-with-next-routing)에서 `@next/routing`을 사용하는 방법을 확인한다.

## Adapter에서 PPR 구현하기 (Implementing PPR in an Adapter)

[Implementing PPR in an Adapter](https://nextjs.org/docs/app/api-reference/adapters/implementing-ppr-in-an-adapter)에서 adapter에 PPR을 구현하는 방법을 확인한다.

## Runtime Integration

[Runtime Integration](https://nextjs.org/docs/app/api-reference/adapters/runtime-integration)에서 runtime 통합 방법을 확인한다.

## Entrypoint 호출하기 (Invoking Entrypoints)

[Invoking Entrypoints](https://nextjs.org/docs/app/api-reference/adapters/invoking-entrypoints)에서 entrypoint를 호출하는 방법을 확인한다.

## Output Types

[Output Types](https://nextjs.org/docs/app/api-reference/adapters/output-types)에서 output type을 확인한다.

## Routing Information

[Routing Information](https://nextjs.org/docs/app/api-reference/adapters/routing-information)에서 라우팅 정보를 확인한다.

## Use Cases

[Use Cases](https://nextjs.org/docs/app/api-reference/adapters/use-cases)에서 adapter 사용 사례를 확인한다.

## 예제 및 데모 설계

- 데모 가능 여부: 불가
- adapter는 배포 플랫폼이나 빌드 시스템을 Next.js 빌드 과정에 연결하는 통합 지점이다. 그래서 일반적인 브라우저 화면만으로는 `adapterPath`의 효과를 분리해 관찰하기 어렵다.
- 별도 검증 프로젝트를 만든다면 빌드 파이프라인 실습으로 설계한다. `adapterPath`와 `NEXT_ADAPTER_PATH`를 각각 설정해 빌드 과정에서 adapter가 선택되는지 확인하는 방식이다.

## 연습 문제

1. `adapterPath`의 역할로 올바른 것은 무엇인가?
   - A. 정적 자산의 공개 URL 접두사를 설정한다.
   - B. Next.js 빌드 과정에 사용할 adapter 모듈의 경로를 지정한다.
   - C. 개발 서버가 허용할 Origin 목록을 지정한다.
   - D. `app` 디렉터리 사용 여부를 전환한다.

<details><summary>정답 보기</summary>

정답: **B**<br>
해설: `adapterPath`는 Next.js 빌드 과정에 연결할 adapter 모듈의 경로를 지정한다.
</details>

2. 배포 플랫폼에서 `adapterPath`를 설정 파일에 직접 적지 않고 zero-config로 활성화할 때 사용할 수 있는 환경 변수는 무엇인가?
   - A. `NEXT_ADAPTER_PATH`
   - B. `NEXT_RUNTIME_PATH`
   - C. `NEXT_BUILD_ADAPTER`
   - D. `ADAPTER_PATH_NEXT`

<details><summary>정답 보기</summary>

정답: **A**<br>
해설: 공식 문서는 배포 플랫폼의 zero-config 사용을 위해 `NEXT_ADAPTER_PATH`를 설정할 수 있다고 설명한다.
</details>

## 챕터 요약

- Next.js는 배포 플랫폼이나 빌드 시스템을 빌드 과정에 통합하도록 built-in adapters API를 제공한다.
- `adapterPath`에는 adapter 모듈의 경로를 지정한다.
- 설정 파일 대신 `NEXT_ADAPTER_PATH`를 사용해 배포 플랫폼에서 zero-config로 adapter를 활성화할 수 있다.
- adapter의 구현, API, 테스트, 라우팅, runtime 통합은 전용 Adapters 문서에서 이어서 학습한다.
- 이 옵션의 효과는 일반 브라우저 화면보다 빌드와 배포 통합 과정에서 확인하는 편이 적절하다.
