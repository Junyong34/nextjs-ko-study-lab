# Parallel Routes

- 공식 문서: [Parallel Routes](https://nextjs.org/docs/app/api-reference/file-conventions/parallel-routes)
- 상위 메뉴: [File-system conventions](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- named slot으로 같은 layout 안에 여러 page를 동시에 렌더링한다.
- soft/hard navigation에서 slot 상태와 `default.js` 동작을 설명한다.
- 조건부 route, tab, modal을 안전하게 설계한다.

## 핵심 개념 및 설명

### Slots

`@analytics`처럼 `@folder`로 named slot을 만들면 부모 layout의 prop으로 전달된다. slot은 route segment가 아니므로 URL에 포함되지 않는다. `children`도 폴더 매핑이 필요 없는 암시적 slot이다. 같은 세그먼트 level의 slot 중 하나가 다이나믹이면 모두 다이나믹이어야 한다.

```tsx
export default function Layout({ children, analytics, team }: LayoutProps<'/dashboard'>) {
  return <>{children}{analytics}{team}</>
}
```

### 내비게이션과 fallback

soft navigation에서는 한 slot만 partial render하면서 다른 slot의 활성 subpage를 유지한다. hard navigation에서는 URL과 맞지 않는 slot 상태를 복구할 수 없으므로 `default.js`를 렌더링하고, 없으면 404가 된다.

### 조건부 route와 보안

역할에 따라 `@admin`과 `@user` 중 하나만 반환해도 두 slot은 서버에서 모두 렌더링되고 데이터 fetching 결과가 응답에 포함될 수 있다. 조건부 표시를 authorization으로 착각하지 말고 각 slot page 또는 Data Access Layer에서 권한을 검사한다.

slot 안에 layout을 두면 독립 tab을 만들 수 있다. Intercepting Routes와 결합하면 URL 공유, 뒤로/앞으로 이동, 새로고침 시 full page를 지원하는 modal을 만들 수 있다. modal을 닫을 route에는 `null`을 반환하는 page나 catch-all slot을 둔다.

`useSelectedLayoutSegment`와 `useSelectedLayoutSegments`에 `parallelRoutesKey`를 전달하면 특정 slot의 활성 segment를 읽을 수 있다. 각 slot에는 독립적인 `loading.js`와 `error.js`를 둘 수 있어 한 영역을 다른 영역과 별도로 스트리밍하고 복구할 수 있다.

## 예제 및 데모 설계

- Phase 2에서 dashboard의 두 slot을 동시에 표시하고 각각 독립 loading/error UI를 둔다.
- client navigation과 새로고침에서 활성 slot과 `default.tsx` 결과를 비교한다.
- intercepted login modal의 URL·뒤로가기·새로고침 동작을 검증한다.

## 연습 문제

1. `@analytics`가 URL에 미치는 영향은?
   - A. `/@analytics`가 추가된다.
   - B. URL에는 포함되지 않는다.
   - C. query string이 된다.

<details><summary>정답 보기</summary>

정답: B. slot은 route segment가 아니다.
</details>

2. layout이 `@admin`을 반환하지 않으면 그 slot의 fetching은?
   - A. 실행되지 않는다.
   - B. 서버에서 실행될 수 있으므로 slot 내부 authorization이 필요하다.
   - C. 브라우저에서만 실행된다.

<details><summary>정답 보기</summary>

정답: B. 조건부 표시 자체는 보안 경계가 아니다.
</details>

## 챕터 요약

- Parallel Routes는 `@slot`으로 여러 page를 함께 렌더링한다.
- slot은 URL segment가 아니며 `children`도 slot이다.
- soft navigation은 다른 slot 상태를 보존한다.
- hard navigation에는 `default.js` fallback이 필요하다.
- 조건부 slot마다 독립적으로 authorization해야 한다.
