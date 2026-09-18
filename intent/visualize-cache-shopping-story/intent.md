Intent: 쇼핑몰 스토리텔링으로 감싼 Cache Components 시각화 페이지
Author: Claude
Status: approved
Approval: 사용자 승인 (2026-09-18 대화, Open questions 기본값으로 진행 지시)

## Problem

`/visualize`의 Cache Components 데모 4종(`cache-shell`, `cache-keys`, `cache-lifetime`, `cache-tags`)은 각각 하나의 메커니즘(셸 경계, 캐시 키, 수명, 태그)만 독립적으로 보여준다. 네 데모의 `description`은 전부 개념 설명이며, "실제 서비스의 어떤 화면에서 왜 이 설정을 쓰는가"라는 맥락이 빠져 있다. 그 결과 학습자가 개념은 봐도 실무 상황과 연결 짓기 어렵다.
근거: `nextjs-app/packages/ui/src/reference-visualize/toolkit/examples/showcase-cache-demos.tsx`의 4개 `DemoMeta.description`.

## Proposed outcome

쇼핑몰 시나리오(방문자 "유준", 운영자 "서아")를 4장으로 구성한 내러티브 래퍼 페이지를 추가한다. 각 장은 기존 4개 데모와 1:1로 대응하며, 새 캔버스 로직을 만들지 않고 기존 데모의 컴포넌트·캔버스 페인트 함수를 그대로 재사용한다. 래퍼는 장 진입 시 짧은 내레이션, 역할 배지(유준/서아, 순차 전환), 4단 장 네비게이션만 얹는다.

- 1장 홈 화면 (`cache-shell`): 유준이 접속 — 정적 셸(헤더·카테고리·베스트셀러 요약)과 요청 시 스트리밍(추천 배너)이 한 화면에 공존. 기존 데모가 보여주는 **단일 타임라인**(빌드→요청→스트리밍→완료) 그대로 자막만 입힌다. "첫 방문/재방문" 같은 이 데모에 없는 가짜 분기는 만들지 않는다.
- 2장 상품 상세 (`cache-keys`): 유준이 운동화→백팩→운동화 순으로 클릭 — 상품 ID별 캐시 키, MISS/HIT, 경계 안에서 쿠키를 읽을 때의 `next-request-in-use-cache` 에러 보너스.
- 3장 카테고리 목록 (`cache-lifetime`): 유준이 "베스트셀러"(짧은 수명 프로필) vs "브랜드 스토리"(긴 수명 프로필) 전환 — 기존 시간축 스크러버의 시작 위치만 프리셋.
- 4장 가격 변경 (`cache-tags`, 역할 자동 전환 → 서아): 서아가 가격을 즉시 변경(`updateTag`) 또는 서서히 변경(`revalidateTag`) — 용어는 "지운다/삭제"가 아닌 "즉시 변경/서서히 변경"으로 통일. 태그로 묶인 상품 목록·상세·장바구니 배지 영향 범위를 하단 텍스트 리스트로 표시.

학습자는 시나리오로 "왜 필요한지"를 먼저 이해한 뒤, 기존 개별 데모 4종에서 메커니즘 세부를 파고들 수 있다.

## Requirements

- 필수:
  - 기존 4개 데모(`CacheShellDemo`, `CacheKeysDemo`, `CacheLifetimeDemo`, `CacheTagsDemo`)의 캔버스 페인트 로직과 컴포넌트는 수정 없이 그대로 재사용한다.
  - 4장 각각 위 "Proposed outcome"에 적은 내레이션·인터랙션 매핑을 따른다.
  - 역할 배지는 순차 전환(1~3장 유준, 4장 서아)만 지원한다. 두 역할 동시 표시는 이번 범위에 포함하지 않는다.
  - 1장은 기존 `CacheShellDemo`가 실제로 재생하는 단일 시퀀스(`SHELL_STEPS`)만 자막으로 서술한다. 이 데모에 없는 분기(예: 방문 유형 토글)를 인터랙션으로 추가하지 않는다.
  - 기존 4개 개별 데모 카드(`/visualize/cache-shell` 등)는 그대로 유지한다. 내러티브 페이지는 대체가 아니라 추가다.
- 선택:
  - 4장 "영향받는 화면" 미니 리스트(상품 목록/상세/장바구니 배지)를 캔버스 안에 애니메이션으로 그릴지, 캔버스 밖 텍스트 리스트로 최소 구현할지는 plan 단계에서 결정한다.

## Non-goals

- 새로운 캔버스 엔진·모듈 제작 (`toolkit/modules`, `toolkit/core` 확장 없음)
- 기존 4개 데모의 캔버스 로직·시퀀스 자체 변경
- 두 역할(유준/서아) 동시 표시 UI
- 쇼핑몰 실제 상품 데이터·백엔드 연동 (전부 프런트엔드 연출)

## Affected users and systems

- 사용자: `/visualize`를 통해 Next.js 16 Cache Components를 학습하는 학습자
- 시스템:
  - `nextjs-app/packages/ui/src/reference-visualize/toolkit/examples/{CacheShellDemo,CacheKeysDemo,CacheLifetimeDemo,CacheTagsDemo}.tsx` — 재사용(수정 없음 원칙)
  - `nextjs-app/packages/ui/src/reference-visualize/toolkit/examples/showcase-cache-demos.tsx`, `showcase-types.ts` — 신규 `DemoMeta` 항목 등록 필요
  - `nextjs-app/apps/shell/src/app/visualize/`, `nextjs-app/apps/shell/src/app/visualize/[slug]/page.tsx`, `nextjs-app/apps/shell/src/components/visualize/VisualizeDetailViewer.tsx` 등 — 신규 래퍼 컴포넌트(내레이션/역할 배지/장 네비게이션) 추가 지점
  - `nextjs-app/apps/shell/src/lib/seo/` — 신규 페이지 메타데이터(필요 시)

## Design

- 래퍼 컴포넌트는 기존 데모를 감싸는 얇은 클라이언트 컴포넌트로, 장(1~4) 상태만 로컬로 관리한다. 캔버스 내부 상태(재생/속도/시퀀스)는 각 데모가 이미 갖고 있는 훅(`useCacheSequence` 등)을 그대로 쓴다.
- 장 전환 시: 역할 배지 갱신 → 내레이션 오버레이 노출(수 초 후 자동 소멸 또는 닫기 버튼) → 기존 데모 컴포넌트 렌더.
- `showcase-cache-demos.tsx`에 다섯 번째 `DemoMeta`(`key: 'cache-shopping-story'`, `group: 'cache-components'`)로 등록해 `/visualize` 갤러리와 `/visualize/[slug]` 상세 라우팅을 그대로 재사용한다(신규 라우트 불필요).
- 파일 분리: `page.tsx` 성격의 조립 컴포넌트, 장별 내레이션 카피 데이터(`scenes.ts` 등), 역할 배지/스텝바 UI 컴포넌트로 나눠 250줄 제한을 지킨다.

## Acceptance criteria

- [ ] `/visualize`에 새 항목(내러티브 래퍼)이 노출되고, 4장을 순서대로 또는 스텝바 클릭으로 이동할 수 있다.
- [ ] 각 장에서 기존 데모의 캔버스가 그대로 재생되며, 페인트 로직 자체는 수정되지 않았다(diff로 확인).
- [ ] 1장은 가짜 분기 없이 기존 `SHELL_STEPS` 단일 시퀀스만 자막으로 노출한다.
- [ ] 4장은 "즉시 변경/서서히 변경" 용어로 `updateTag`/`revalidateTag` 결과가 구분되어 표시된다.
- [ ] 기존 4개 개별 데모 카드(`cache-shell`/`cache-keys`/`cache-lifetime`/`cache-tags`)는 이전과 동일하게 접근 가능하다.
- [ ] `pnpm typecheck`, `pnpm build`(영향받는 워크스페이스) 통과.

## Constraints

- 반드시 지킬 것: `nextjs-app/AGENTS.md`의 단일 파일 250줄 제한·모듈 분리, `nextjs-docs`와의 캐시 개념 서술 일치(문서 근거: `cacheLife.md`, `cacheTag.md` 등과 모순되는 설명 금지). 기존 4개 데모 파일은 이번 작업에서 수정하지 않는다(재사용만).
- 범위 밖: Non-goals 항목 전부.

## Open questions

모두 해결됨 (2026-09-18 대화, 사용자 지시로 기본값 채택):

- 노출 방식: `/visualize` 갤러리에 `cache-components` 그룹의 5번째 `DemoMeta` 카드로 노출한다. 별도 배너 UI는 만들지 않는다 — 기존 갤러리·상세 라우팅(`/visualize/[slug]`)을 그대로 재사용하기 위함.
- 슬러그: `cache-shopping-story` (`DemoKey`에 추가, 다른 `cache-*` 키와 명명 일관성 유지).
- 4장 "영향받는 화면" 리스트: 캔버스 애니메이션이 아닌 캔버스 밖 텍스트 리스트로 최소 구현한다 (Non-goals의 "새 캔버스 애니메이션 제작 범위 밖"과 일관).
