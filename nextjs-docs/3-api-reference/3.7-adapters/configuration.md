# Configuration

- 공식 문서: [Configuration](https://nextjs.org/docs/app/api-reference/adapters/configuration)
- 상위 메뉴: [Adapters](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- `adapterPath` 설정으로 커스텀 어댑터를 등록하는 방법을 익힌다.
- `NEXT_ADAPTER_PATH` 환경 변수로 배포 플랫폼에서 zero-config 방식을 사용하는 방법을 이해한다.

## 핵심 개념 및 설명

어댑터를 사용하려면 `next.config.js`의 `adapterPath`에 어댑터 모듈 경로를 지정한다.

```js filename="next.config.js"
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  adapterPath: require.resolve('./my-adapter.js'),
}

module.exports = nextConfig
```

또는 `NEXT_ADAPTER_PATH` 환경 변수를 설정할 수 있다. 이 방식은 배포 플랫폼에서 별도 설정 없이(zero-config) 어댑터를 사용할 수 있게 해준다.

## 예제 및 데모 설계

- 데모 가능 여부: 가능 (Phase 1에서는 구현 예정)
- Phase 2에서는 `adapterPath`로 로컬 어댑터를 등록하는 경우와 `NEXT_ADAPTER_PATH` 환경 변수만으로 등록하는 경우를 비교하는 데모를 계획한다.

## 연습 문제

1. 어댑터를 zero-config 방식으로 사용하려면 어떤 환경 변수를 설정하는가?
   - A. `NEXT_ADAPTER_PATH`
   - B. `ADAPTER_CONFIG_PATH`
   - C. `NEXT_CONFIG_ADAPTER`

<details><summary>정답 보기</summary>

정답: A. `NEXT_ADAPTER_PATH` 환경 변수를 설정하면 배포 플랫폼에서 별도 설정 없이 어댑터를 사용할 수 있다.
</details>

## 챕터 요약

- 어댑터를 사용하려면 `next.config.js`의 `adapterPath`에 어댑터 모듈 경로를 지정한다.
- `adapterPath`에는 `require.resolve()`로 어댑터 모듈의 경로를 전달한다.
- `NEXT_ADAPTER_PATH` 환경 변수를 설정하면 배포 플랫폼에서 zero-config로 어댑터를 사용할 수 있다.
