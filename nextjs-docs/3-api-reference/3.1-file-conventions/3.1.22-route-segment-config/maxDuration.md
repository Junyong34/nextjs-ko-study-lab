# maxDuration

- 공식 문서: [maxDuration](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/maxDuration)
- 상위 메뉴: [Route Segment Config](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

## 학습 목표

- route segment 서버 로직의 최대 실행 시간을 deployment platform에 전달한다.
- page의 Server Actions timeout에 미치는 범위를 이해한다.

## 핵심 개념 및 설명

`maxDuration` 옵션을 사용하면 라우트 세그먼트의 서버 측 논리에 대한 최대 실행 시간(초)을 설정할 수 있다. 배포 플랫폼은 Next.js 빌드 출력의 `maxDuration`를 사용하여 특정 실행 제한을 추가할 수 있다.

```tsx filename="layout.tsx | page.tsx | route.ts" switcher
export const maxDuration = 5
```

```js filename="layout.js | page.js | route.js" switcher
export const maxDuration = 5
```

<a id="server-actions"></a>
### Server Action

[Server Action](../../../1-getting-started/mutating-data.md)을 사용하는 경우 페이지 수준에서 `maxDuration`를 설정하여 페이지에서 사용되는 모든 Server Action의 기본 시간 초과를 변경한다.

<a id="version-history"></a>
### Version History

| 버전 | 변경 사항 |
| ---------- | ------------------------- |
| `v13.4.10` | `maxDuration`가 출시되었다. |

## 예제 및 데모 설계

- Phase 2에서 짧은 제한을 선언한 Route Handler와 Server Action을 배포 환경에서 검증한다.
- local과 deployment platform의 차이를 기록한다.

## 연습 문제

1. `maxDuration`의 단위는?
   - A. 밀리초
   - B. 초
   - C. 분

<details><summary>정답 보기</summary>

정답: B. 최대 실행 시간을 초 단위 number로 선언한다.
</details>

## 챕터 요약

- `maxDuration`은 서버 실행 시간 상한을 선언한다.
- 단위는 초다.
- deployment platform이 build output을 읽어 적용할 수 있다.
- page level 선언은 그 page의 Server Actions에도 적용된다.
