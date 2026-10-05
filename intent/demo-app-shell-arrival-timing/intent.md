Intent: `app-shell` 실습을 "요청 건수"에서 "클릭 후 영역별 도착 시각"으로 확장해 Cache Components prefetch를 체감하게 하기
Author: Claude (초안)
Status: approved
Approval: 2026-10-05 대화 승인(PR 없음, 커밋·push는 별도 요청 시). 사용자가 개념 설명과 설계안(영역 A~D, 클릭 후 도착 시각 측정)을 본 뒤 "intent 초안부터 작성해줘 작업 진행해줘"라고 지시했다. 초안 작성과 구현 진행을 한 번에 지시한 것이므로, 아래 요구사항을 검토한 뒤 바꾸고 싶으면 알려 달라(바뀐 범위는 재승인 대상). 선행 작업은 [`demo-gap-dynamic-suspense-partial-prefetch`](../demo-gap-dynamic-suspense-partial-prefetch/intent.md)(커밋 `900ebc6`·`8a6dfa4`)이며, 그 intent는 완료된 승인으로 보고 이 작업은 새 슬러그로 둔다.

## Problem

`guides/adopting-partial-prefetching/app-shell`(cache zone, `done`)은 같은 라우트를 가리키는 링크가 App Shell 요청 1건을 공유하는지를 **요청 건수**로만 보여 준다. 학습자가 알고 싶은 것은 "그래서 클릭했을 때 내 화면에서 무엇이 즉시 보이고 무엇이 늦게 오는가"인데, 현재 데모는 이를 보여 주지 못한다.

- 도착 페이지에 `'use cache'` 영역이 없어 "캐시된 내용이 prefetch된 App Shell에 실려 있다"는 핵심을 확인할 수 없다.
- 공식 문서에 따르면 App Shell에는 `stale`이 5분 이상인 캐시만 들어가는데(`cacheLife` 문서 Prerendering behavior), 이 조건을 관찰할 수단이 없다.
- 이전 배포 관찰에서 기본 링크에도 PPR 런타임 요청(헤더 2)이 URL마다 나가는 현상이 확인됐으나 원인을 모른다(개념 정리에 "미확인"으로 기록).

근거: 선행 plan의 배포 환경 관찰 기록, `nextjs-docs/2-guides/adopting-partial-prefetching.md`의 데모 설계 절(정적·세션·URL별·실시간 목적지), 번들 문서 `adopting-partial-prefetching.md`·`cacheLife.md`·용어집(App Shell, URL data).

## Proposed outcome

도착 페이지를 영역별로 나누고, 링크를 클릭한 시점부터 **각 영역이 화면에 나타난 시각(ms)** 을 실제로 측정해 표로 보여 준다. 학습자는 링크 종류(기본 / `prefetch` / `prefetch={false}`)와 라우트(`partial` / `legacy`)별로 어떤 영역이 먼저 보이는지 비교한다.

| 영역 | 구현 | 가설(측정으로 확인·정정) |
|---|---|---|
| A. 고정 문구 | 서버 컴포넌트, 데이터 없음 | App Shell에 포함, 클릭 직후 |
| B. 캐시(긴 stale) | `'use cache'` + `cacheLife('hours')` | App Shell에 포함, 클릭 직후 |
| B2. 캐시(짧은 stale) | `'use cache'` + `cacheLife({ stale: 60, … })` | 프리렌더에는 들어가나 App Shell에서는 제외, 셸보다 늦게 도착 |
| C. URL별 | Suspense 안에서 `params` 읽기 + 지연 | 클릭 뒤에 해결 |
| D. 실시간 | Suspense 안에서 `connection()` 후 값 생성 + 지연 | 항상 클릭 뒤 |

가설이 측정과 다르면 실측대로 가이드·검증·개념 정리를 쓰고 차이를 기록한다. 세션 데이터(`cookies()`) 영역은 이번 범위에 넣지 않는다.

## Requirements / Spec 통합

1. 대상은 `nextjs-app/apps/demo-cache-components/src/app/zone/cache/guides/adopting-partial-prefetching/app-shell/` 하나다. 기존 `partial/[id]`·`legacy/[id]` 라우트와 링크 그룹(A·B·C·D 링크)은 유지한다.
2. 영역 B·B2의 캐시 태그·프로필 이름에는 데모 접두사를 붙인다(`apps/AGENTS.md` 8항). `next.config.ts`는 바꾸지 않는다(`cacheLife` 인라인 객체만 사용).
3. 도착 시각은 **클릭 시점의 `performance.now()`를 기준으로, 각 영역을 감싼 클라이언트 마커가 마운트된 시각**을 기록한다. 렌더 ID 때와 같이 가짜 값이 아니라 실제 DOM 반영 시각이다.
4. 검증 패널(3단)의 `isMatched`는 **측정으로 안정적임을 확인한 관계**만으로 계산한다. 먼저 측정하고 기준을 정한다. 흔들리는 값(절대 ms)은 판정에서 제외하고 표시만 한다. 기존 3개 판정(런타임 셸 1건, prefetch 링크, `prefetch={false}` 0건)은 유지한다.
5. 4단 레이아웃과 파일당 250줄 제한, `page.tsx` 조립·`components/`·`lib/` 분리를 지킨다. 새 의존성은 없다.
6. 개념 정리에는 ①~⑥ 개념(영역 종류, App Shell, `stale` 5분 조건, 정적 셸과 App Shell의 차이)을 데모 결과와 연결해 쓰고, **측정하지 못한 항목**(세션 데이터의 App Shell 포함, PPR 런타임 요청 원인)은 미확인으로 구분 표기한다.
7. 브라우저 확인은 production 빌드에서만 의미가 있다(dev는 prefetch 없음). dev에서는 모드별 기대값(prefetch 0건)으로 판정한다.

## Acceptance criteria

- production에서 링크를 클릭하면 영역별 도착 시각이 표로 기록되고, 같은 조작을 반복해도 판정 관계가 유지된다.
- 가설과 측정이 다른 항목은 가이드·개념 정리에 실측 기준으로 서술되어 있다.
- 검증 패널이 조작 전 대기, 정상 시 검증 완료, 어긋날 때 불일치를 정확히 반영한다.
- 기존 `app-shell` 판정 3종과 다른 데모(`done`)의 동작이 달라지지 않는다.
- 두 zone 타입 검사, `@study/demos` lint·`test:manifest`, cache zone production 빌드가 통과한다.
- 배포 환경(커밋·push 후)에서 같은 관찰을 한 번 이상 수행한 기록을 plan에 남긴다. push는 사용자가 요청할 때 한다.

## Affected users and systems

- 사용자: Cache Components의 prefetch와 App Shell을 학습하는 학습자
- 시스템: `app-shell` 데모 디렉토리, `intent/README.md` 인덱스. `demos.yaml`의 `status`는 `done` 유지, 제목 변경 여부는 아래 Open questions

## Constraints

- 반드시 지킬 것: Next.js 16.3.2 번들 문서 기준. 공식 문서와 측정이 다르면 측정을 우선하고 차이를 기록한다.
- 반드시 지킬 것: 이번 작업은 `main` 브랜치에서 하고, 커밋·push는 사용자가 요청할 때만 한다.
- 범위 밖: 전역 `partialPrefetching` 활성화, `next.config.ts` 변경, 세션(`cookies()`) 영역, `hover-shell` 코드 변경, 다른 데모 수정, 질문 1·4·5 관련 데모.

## Open questions

- `hover-shell`의 제목("링크 호버 시 정적 셸 표시 (Partial Prefetching 예시)")이 실제 내용과 어긋난다. 이번 범위에서는 바꾸지 않는다. 바꾸면 매니페스트·검색 문구가 함께 바뀌므로 별도 결정이 필요하다.
- 영역 B2의 가설(셸에서 제외)이 production에서 관찰되지 않으면, 그 사실을 기록하고 B2의 설명을 정정한다.
- 기본 링크의 PPR 런타임 요청 원인은 이번 측정에서 단서가 나오면 기록하고, 나오지 않으면 미확인으로 남긴다.
