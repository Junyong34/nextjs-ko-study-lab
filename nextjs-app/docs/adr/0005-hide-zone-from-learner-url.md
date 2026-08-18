---
status: accepted
date: 2026-08-18
---

# 학습자 URL에서 zone을 감추고, 데모 앱 경로는 `/zone/*`으로 분리한다

zone은 **설정 축**이다 ([ADR 0001](./0001-config-axis-as-app-boundary.md)) — 구현 세부이지 학습 개념이 아니다. 그런데 데모가 어느 zone에 속하는지는 바뀐다. `demo-prefetch`·`demo-export`·`demo-proxy` 세 zone이 아직 "설계만" 상태이고, 지금 `demo-baseline`에 둔 데모가 나중에 대조가 필요해져 다른 zone으로 옮겨갈 수 있다. zone을 URL에 박으면 **학습 내용은 그대로인데 주소와 문서 링크와 북마크가 깨진다.**

셸은 `demos.yaml`을 보고 어느 zone인지 안다. URL에 적을 이유가 없다.

```
학습자   /demo/{문서 파일명}/{데모명}          셸이 소유
내부     /zone/{zone 슬러그}/{문서 파일명}/{데모명}   데모 앱이 소유
자산     /demo-static/{zone 슬러그}/…          데모 앱이 소유
```

첫 세그먼트를 문서 **파일명**으로 삼는 이유는 안정성이다. 카테고리·하위그룹 폴더에는 번호가 붙어 있고 [nextjs-docs ADR 0002](../../../nextjs-docs/docs/adr/0002-reorder-learning-sequence.md)가 학습 순서 재배열을 허용하므로 순번은 움직이지만, 리프 md 파일명에는 번호를 붙이지 않으므로 움직이지 않는다.

## Considered Options

- **`/demo/{zone}/{문서}/{데모}` (학습자 URL에 zone 노출)**: 셸 URL과 내부 URL이 zone까지 대칭이라 rewrite 대응을 눈으로 따라가기 쉽다. 하지만 zone 재편이 곧 URL 파괴다.
- **내부 경로를 `/_zone/*`으로**: 밑줄이 "내부"를 가장 강하게 드러내지만, App Router에서 `_folder`는 **폴더와 하위 전체를 라우팅에서 제외**한다. `%5Fzone`으로 우회할 수 있으나 디스크의 폴더 이름이 `%5Fzone`이 되어, Next.js를 가르치는 저장소에서 설명하기 나쁘다.
- **셸 경로를 `/demos/*`, 내부를 `/demo/*`로**: `s` 한 글자 차이라 오타가 404가 아니라 **다른 앱이 응답**하는 것으로 나타난다. 화면에 오류가 뜨지 않아 원인을 찾기 어렵다.
- **순번 기반(`/demo/2-7/basic`)**: 문서와 데모의 대응이 기계적이지만 순서 재배열이 URL을 통째로 바꾼다.

## Consequences

- 학습자 URL이 전역에서 유일해야 한다. 리프 md 파일명은 11건이 중복되므로(`proxy`, `forbidden`, `cacheLife`, `headers`, `images`, `instrumentation`, `not-found`, `turbopack`, `typescript`, `unauthorized`, `draft-mode`) 해당 데모는 `demos.yaml`에서 URL을 명시 선언하고 lint가 유일성을 검사한다.
- 같은 개념을 켠/끈 상태로 대조하는 데모는 zone이 아니라 **이름**으로 갈린다 (`caching/use-cache-basic` 대 `caching/no-cache-baseline`). 어차피 다른 데모이므로 이름도 달라야 한다.
- `demo`와 `zone`은 오타로 서로 바뀔 수 없는 다른 단어다.
