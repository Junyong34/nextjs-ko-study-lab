# maxDuration

- 공식 문서: [maxDuration](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/maxDuration)
- 상위 메뉴: [Route Segment Config](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

## 학습 목표

- route segment 서버 로직의 최대 실행 시간을 deployment platform에 전달한다.
- 페이지의 Server Actions timeout에 미치는 범위를 이해한다.

## 핵심 개념 및 설명

`maxDuration`은 서버 로직의 최대 실행 시간을 초 단위로 선언한다. Next.js build output에 포함되며 deployment platform이 실행 제한을 적용하는 데 사용할 수 있다. 실제 기본값과 강제 방식은 platform이 정한다.

```ts
export const maxDuration = 5
```

Server Actions를 사용할 때 page level에 선언하면 그 페이지에서 사용하는 모든 Server Action의 기본 timeout을 바꾼다.

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
- page level 선언은 그 페이지의 Server Actions에도 적용된다.
