# packages/ui (@study/ui)

셸(`apps/shell`) 전용 UI 컴포넌트입니다. 헤더, 좌측 트리, 우측 목차, 카드, shadcn 기반 프리미티브.

## 지켜야 할 것

1. **셸 전용이다.** 데모 앱이 여기 의존하면 헤더·검색 팔레트까지 데모 앱 빌드에 끌려 들어온다. 데모 공통 UI는 `@study/demo-kit`에 둔다 ([01. 7-4](../../docs/01-ui-and-screen-design.md)).
2. **화면 라벨과 도메인 용어를 섞지 않는다.** 화면에는 `예제`라고 쓰지만 URL·파일·설계 문서의 용어는 `데모`다. 코드에서 `example`로 바꿔 쓰지 않는다 ([01. 6-2](../../docs/01-ui-and-screen-design.md)).
3. **디자인 토큰 이름을 새로 만들지 않는다.** shadcn의 Tailwind v4 규약(`@theme inline` + oklch)을 그대로 쓴다 ([01. 8-1](../../docs/01-ui-and-screen-design.md)).
