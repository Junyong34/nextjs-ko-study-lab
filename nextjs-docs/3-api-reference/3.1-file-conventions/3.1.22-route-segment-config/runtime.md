# runtime

- 공식 문서: [runtime](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/runtime)
- 상위 메뉴: [Route Segment Config](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

## 학습 목표

- route rendering에 사용할 JavaScript runtime 상태를 이해한다.
- deprecated Edge Runtime과 Proxy 제약을 확인한다.

## 핵심 개념 및 설명

```ts
export const runtime = 'nodejs'
```

현재 지원되는 기본 runtime은 `'nodejs'`다. Edge Runtime은 deprecated되었으므로 route 파일의 edge `runtime` export를 제거하고 Node.js runtime으로 이동한다. Proxy에서는 이 옵션을 사용할 수 없다.

## 예제 및 데모 설계

- Phase 2에서 Node.js 전용 API를 사용하는 route를 만들고 runtime 기본값을 확인한다.
- 기존 edge export 제거 전후 build warning을 기록한다.

## 연습 문제

1. 현재 권장 runtime은?
   - A. `'nodejs'`
   - B. `'edge'`
   - C. `'browser'`

<details><summary>정답 보기</summary>

정답: A. Edge Runtime은 deprecated되었다.
</details>

## 챕터 요약

- `runtime`은 route의 JavaScript 실행 환경을 정한다.
- 기본값은 Node.js다.
- Edge Runtime은 deprecated 상태다.
- Proxy에서는 runtime export를 사용할 수 없다.
