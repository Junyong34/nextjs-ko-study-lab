---
title: Demo Index Discovery UX - Plan
type: feat
date: 2026-08-22
artifact_contract: ce-unified-plan/v1
artifact_readiness: implementation-ready
product_contract_source: ce-plan-bootstrap
execution: code
---

# Demo Index Discovery UX - Plan

## Goal Capsule

- **Objective:** 학습자가 241개 데모 중 원하는 항목을 빠르게 찾고, 상세 페이지에서 이전 목록의 탐색 맥락으로 안전하게 돌아올 수 있다.
- **Means:** 셸의 데모 색인을 검색·대분류 필터·24개 단위 페이지네이션·반응형 압축 카드로 재구성하고, 검색 상태는 URL에, 스크롤 복원 정보는 브라우저 상태와 `sessionStorage`에 둔다.
- **Authority:** 저장소 루트와 `nextjs-app/`의 `AGENTS.md`가 우선하며, 이 문서의 Product Contract가 Planning Contract와 Implementation Units보다 우선한다.
- **Execution profile:** 기존 `@study/demos`, `@study/ui`, `apps/shell` 경계를 확장하는 코드 작업이다. 새 서버 API나 외부 의존성은 추가하지 않는다.
- **Stop conditions:** 검색·페이지 URL과 상세 복귀 상태를 함께 복원할 수 없거나, 직접 상세 진입 시 안전한 `/demo` fallback을 제공할 수 없으면 구현을 중단하고 범위를 재검토한다.
- **Tail ownership:** 이 계획은 셸의 `/demo` 색인과 상세 헤더의 복귀 UX까지 다룬다. 데모 원본 데이터, zone 라우팅, 개별 데모 화면은 변경하지 않는다.

---

## Product Contract

### Summary

`/demo`를 학습 순서형 목록이 아니라 탐색 중심 색인으로 개선한다. 사용자는 제목·URL·관련 문서명으로 검색하고 기존 문서 대분류로 결과를 좁힌다. 결과는 압축형 반응형 카드와 페이지네이션으로 표시하며, 상세 페이지에서 뒤로가기를 사용하면 이전 목록의 검색·페이지·스크롤 맥락을 복원한다.

### Problem Frame

현재 `/demo`는 `getDemos()`가 반환한 전체 데모를 한 열의 큰 카드로 렌더링한다. 241개를 훑으려면 긴 스크롤이 필요하고, 모바일에서는 한 화면에 적은 수의 카드만 보인다. 현재 카드 링크와 상세 헤더의 목록 링크는 서로 다른 목적의 이동을 구분하지 않아, 사용자가 원래 목록의 위치와 필터를 잃기 쉽다.

현재 설계 문서에는 3열 카드와 상단 대분류 필터가 정의되어 있지만 실제 구현은 한 열이며 필터가 없다. 이 계획은 문서의 기존 방향을 현재 241개 데모와 URL·복귀 요구에 맞게 구체화한다.

### Key Decisions

- **탐색 우선 색인으로 만든다.** (session-settled: user-directed — chosen over learning-order-first browsing: 데모에 아직 학습 순서가 없다) Governs R1, R2.
- **검색·대분류·페이지 상태는 URL에 둔다.** (session-settled: user-approved — chosen over client-only state: 새로고침·공유·브라우저 history 복원을 유지해야 한다) Governs R3, R4, R5.
- **페이지당 24개를 모든 viewport에서 유지한다.** (session-settled: user-approved — chosen over viewport-dependent page sizes: 같은 `page` URL이 화면 크기에 따라 다른 내용을 가리키지 않아야 한다) Governs R6, R7.
- **상세의 back-style 목록 버튼은 history 복귀로 동작한다.** (session-settled: user-approved — chosen over a reset link: 버튼의 화살표와 “돌아가기” 의미가 이전 탐색 맥락과 일치해야 한다) Governs R9, R10.
- **별도의 초기화 목록 링크는 만들지 않는다.** (session-settled: user-directed — chosen over adding a separate reset CTA: 사용자는 back-style 버튼 하나로 상세에서 복귀한다) Governs R10.

### Requirements

**Discovery and query state**

- R1. `/demo`는 제목·학습자 URL·관련 문서명을 기준으로 데모를 검색한다.
- R2. 기존 문서 메뉴의 대분류를 `전체`, `시작하기`, `가이드`, `API`, `아키텍처` 필터로 사용하고 검색어와 함께 적용한다.
- R3. 검색어는 입력 중 200~300ms debounce 후 결과를 갱신하고 URL 변경은 `replace`로 처리한다.
- R4. 대분류와 페이지 이동은 URL history에 새 항목을 추가하고, 검색·대분류 변경은 페이지를 1로 되돌린다.
- R5. 기본 목록은 `demos.yaml` 원본 순서를 유지하고, 검색 결과는 제목·URL의 정확 일치와 접두 일치를 우선한다.

**Density and pagination**

- R6. 데모 카드는 데스크톱 3열, 태블릿 2열, 모바일 1열로 배치한다.
- R7. 모든 viewport에서 한 페이지에 24개 데모를 표시한다.
- R8. 데스크톱은 페이지 번호를 제공하고 모바일은 `이전 / 현재 페이지 / 다음` 조작을 제공한다.
- R9. 카드 전체를 데모 열기 영역으로 만들되 관련 문서 링크는 독립된 클릭 영역으로 유지한다.

**Navigation and restoration**

- R10. 상세 페이지의 `목록으로 돌아가기`는 전역 색인과 문서별 데모 허브를 포함한 유효한 내부 목록 context에서 브라우저 history를 사용해 직전 URL·페이지·스크롤 맥락으로 돌아간다.
- R11. 상세 URL로 직접 진입했거나 목록 복원 맥락이 없으면 `목록으로 돌아가기`는 기본 `/demo` 목록으로 fallback한다.
- R12. 목록 진입 시 canonical list URL, 클릭한 데모 URL, 스크롤 위치를 `study_*` 접두사의 `sessionStorage` 항목에 저장하고, 복귀 후 렌더링이 끝나면 해당 카드와 위치를 복원한다.
- R13. 새 검색·대분류·페이지로 이동하면 이전 복원 데이터를 사용하지 않고 최상단에서 시작한다.

**Feedback and boundaries**

- R14. 현재 결과 수, 현재 페이지, 전체 페이지 수를 학습자가 인지할 수 있게 표시하고 검색 결과가 없을 때 빈 상태와 검색 초기화 방법을 제공한다.
- R15. 검색 입력, 필터, 페이지네이션, 카드 링크는 키보드로 사용할 수 있고 결과 수 변경은 보조 기술에 전달한다.
- R16. `zone`은 화면·학습자 URL·검색 결과에 노출하지 않고 데모 원본과 zone 라우팅은 변경하지 않는다.

### Actors

- A1. **학습자:** 데모를 검색·필터·페이지 이동하고 상세 화면을 열거나 목록으로 돌아간다.
- A2. **브라우저 및 Next.js App Router:** URL history, client navigation, route rendering, scroll behavior를 제공한다.
- A3. **셸 데이터 계층:** `demos.yaml`과 `docs-manifest`를 결합해 데모 색인에 필요한 표시 데이터를 제공한다.

### Key Flows

- F1. **초기 색인 탐색**
    - **Trigger:** 학습자가 `/demo`를 연다.
    - **Actors:** A1, A2, A3.
    - **Steps:** 표시 데이터 로드, 기본 query 해석, 원본 순서 유지, 첫 24개 카드 렌더링 순서로 진행한다.
    - **Outcome:** 첫 화면에서 기존보다 많은 데모를 훑고 현재 결과 수를 확인한다.
    - **Covered by:** R1, R6-R8, R14.
- F2. **검색과 대분류 필터**
    - **Trigger:** 학습자가 검색어를 입력하거나 대분류를 선택한다.
    - **Actors:** A1, A2.
    - **Steps:** debounce, URL query 갱신, 결과 필터링, 페이지 1 이동, 최상단 이동 순서로 진행한다.
    - **Outcome:** 검색·대분류 상태가 주소에 남고 결과와 페이지 표시가 일치한다.
    - **Covered by:** R1-R5, R13-R15.
- F3. **페이지 이동**
    - **Trigger:** 학습자가 페이지 번호 또는 모바일 이전·다음 버튼을 누른다.
    - **Actors:** A1, A2.
    - **Steps:** 유효한 page query 생성, 24개 결과 계산, 새 페이지 렌더링, 목록 상단 이동 순서로 진행한다.
    - **Outcome:** 페이지 URL과 카드 집합이 일치하고 모바일 조작 영역이 과도하게 넓어지지 않는다.
    - **Covered by:** R4, R7, R8, R14.
- F4. **상세 열람 후 복귀**
    - **Trigger:** 학습자가 목록의 카드에서 상세 데모를 연다.
    - **Actors:** A1, A2.
    - **Steps:** 전역 색인 또는 문서별 허브의 목록 context 저장, 상세 route 이동, 브라우저 뒤로가기 또는 back-style 버튼 실행, 목록 렌더링, 카드·스크롤 복원 순서로 진행한다.
    - **Outcome:** 이전 query, page, 클릭한 카드 주변 위치가 복원된다.
    - **Covered by:** R10-R13.
- F5. **직접 상세 진입**
    - **Trigger:** 학습자가 상세 URL을 새 탭이나 외부 링크에서 직접 연다.
    - **Actors:** A1, A2.
    - **Steps:** 복원 context 부재 확인, 상세 화면 렌더링, 목록 버튼 fallback 실행 순서로 진행한다.
    - **Outcome:** 외부 history로 이탈하지 않고 기본 `/demo`로 이동한다.
    - **Covered by:** R10, R11.

### Acceptance Examples

- AE1. **초기 24개 카드**
    - **Covers:** R6-R8, R14.
    - **Given:** `/demo`에 241개 데모가 있다.
    - **When:** 학습자가 기본 목록을 연다.
    - **Then:** 첫 페이지에 24개가 보이고 데스크톱·태블릿·모바일 열 수가 각각 3·2·1로 적용된다.
- AE2. **제목과 관련 문서 검색**
    - **Covers:** R1, R3, R5.
    - **Given:** 검색 입력이 비어 있다.
    - **When:** 학습자가 데모 제목, URL 일부, 또는 관련 문서명을 입력한다.
    - **Then:** debounce 뒤 일치 결과만 남고 query가 URL에 반영되며 검색 입력마다 history 항목이 늘지 않는다.
- AE3. **대분류와 검색 결합**
    - **Covers:** R2, R4.
    - **Given:** 검색 결과가 여러 대분류에 걸쳐 있다.
    - **When:** 학습자가 대분류를 선택한다.
    - **Then:** 두 조건을 동시에 만족하는 결과만 남고 page가 1로 초기화된다.
- AE4. **모바일 페이지네이션**
    - **Covers:** R7, R8.
    - **Given:** 모바일 viewport에서 결과가 두 페이지 이상이다.
    - **When:** 학습자가 다음 또는 이전 버튼을 누른다.
    - **Then:** 현재 page URL과 표시 카드가 함께 바뀌고 숫자 페이지 목록이 화면을 차지하지 않는다.
- AE5. **필터된 목록에서 상세 복귀**
    - **Covers:** R10, R12, R13.
    - **Given:** `q`, `category`, `page`가 있는 목록에서 특정 카드를 열었다.
    - **When:** 학습자가 브라우저 뒤로가기 또는 `목록으로 돌아가기`를 사용한다.
    - **Then:** 이전 query와 page가 유지되고 클릭한 카드가 보이는 위치로 복원된다.
- AE6. **직접 상세 진입과 fallback**
    - **Covers:** R10, R11.
    - **Given:** 목록을 거치지 않고 상세 URL을 직접 연다.
    - **When:** 상세 화면의 `목록으로 돌아가기`를 누른다.
    - **Then:** 외부 페이지로 이탈하지 않고 기본 `/demo`로 이동한다.
- AE7. **빈 결과와 잘못된 page**
    - **Covers:** R4, R14.
    - **Given:** 검색 결과가 없거나 page가 유효 범위를 벗어났다.
    - **When:** 학습자가 결과를 확인한다.
    - **Then:** 빈 상태를 표시하고, 잘못된 page는 안전한 유효 page로 정규화한다.

### Success Criteria

- 학습자가 검색어 또는 대분류 하나로 241개 전체를 직접 훑지 않고 목표 데모를 좁힐 수 있다.
- 데스크톱·태블릿·모바일에서 카드 밀도가 개선되고 모바일 페이지네이션이 한 줄의 단순한 조작으로 유지된다.
- URL을 새로고침하거나 공유해도 검색·대분류·페이지 결과가 재현된다.
- 상세 페이지에서 두 복귀 경로가 동일한 목록 context를 복원하고, 직접 진입은 기본 목록으로 안전하게 fallback한다.
- 관련 문서 링크와 데모 열기 동작이 서로 충돌하지 않는다.
- 기존 zone 경계와 데모 원본 데이터가 변경되지 않는다.

### Scope Boundaries

#### In Scope

- `/demo`의 검색, 기존 문서 대분류 필터, relevance 우선 검색 결과, 24개 페이지네이션.
- 데스크톱·태블릿·모바일 카드 밀도와 모바일 페이지네이션 UI.
- `q`, `category`, `page` URL 동기화.
- 브라우저 뒤로가기와 상세 header 목록 버튼의 context 복원.
- `sessionStorage` 기반 클릭 카드·스크롤 보조 복원.
- 관련 문서 링크와 카드 전체 클릭 영역의 접근성.
- 현재 화면 설계 문서의 `/demo` 계약 정합성 업데이트.

#### Deferred to Follow-Up Work

- 데모별 학습 순서와 커리큘럼 기반 정렬.
- 새 metadata 필드나 기술 태그를 추가한 다중 필터.
- 무한 스크롤, virtualization, 검색 인덱스 라이브러리 도입.
- 별도의 `전체 데모 보기` reset 링크.
- 사용량 analytics, 추천 데모, 개인화 목록.

#### Outside This Plan

- `nextjs-app/packages/demos/demos.yaml`의 데모 추가·삭제·상태 변경.
- `zone` 앱의 라우팅, iframe, 개별 데모 화면.
- 전역 문서 트리의 정보 구조와 헤더의 다른 메뉴.
- `DocTree`를 데모 색인 전용 navigation으로 재구성하는 작업.
- 외부 API, 데이터베이스, 서버 검색 endpoint.

---

## Planning Contract

### Key Technical Decisions

- KTD1. **서버는 query를 해석한 표시용 데모 view model을 만들고 클라이언트는 입력·transition·복원 상태만 소유한다.** `getDemos()`와 `getManifest()`의 서버 데이터 접근을 유지하고 Page의 `searchParams`를 순수 helper에 전달한다. 이는 직접 query URL을 열었을 때도 첫 응답부터 올바른 결과를 만들고 클라이언트 payload를 24개 결과로 제한한다.
- KTD2. **URL query는 의미 있는 목록 상태만 저장하고 pixel scroll은 저장하지 않는다.** (session-settled: user-approved — chosen over storing all list state in session storage: 검색·대분류·페이지는 공유와 새로고침에 필요하고 스크롤은 화면 복원 보조값이다) R3-R5, R10-R13을 구현한다.
- KTD3. **검색은 `replace`, 대분류와 page는 `push`를 사용한다.** (session-settled: user-approved — chosen over pushing every keystroke or replacing every interaction: 입력 history를 오염시키지 않으면서 필터·페이지 이동은 뒤로갈 수 있어야 한다) R3-R5를 구현한다.
- KTD4. **24개 고정 페이지와 viewport별 조작 표현을 사용한다.** (session-settled: user-approved — chosen over responsive page sizes and numbered mobile controls: URL page 의미를 고정하고 모바일 조작 영역을 줄인다) R6-R8을 구현한다.
- KTD5. **목록 복귀는 history-aware client control과 안전한 기본 fallback으로 분리한다.** (session-settled: user-approved — chosen over a static reset link: back-style 버튼의 의미를 이전 위치 복귀로 유지하면서 직접 진입도 처리한다) R10, R11을 구현한다.
- KTD6. **카드 surface는 별도 click target으로 만들고 문서 링크는 sibling target으로 둔다.** (session-settled: user-approved — chosen over button-only cards and nested anchors: 카드 전체의 탐색성을 높이면서 invalid nested link와 문서 링크 충돌을 피한다) R9, R15를 구현한다.
- KTD7. **복원 데이터는 canonical list context를 포함한 `study_*` namespace로 관리하고 성공적인 복원 뒤 stale entry를 정리한다.** `sessionStorage`가 없거나 읽기·쓰기에 실패해도 목록 탐색은 계속되도록 복원은 보조 기능으로 취급한다. R12, R13을 구현한다.
- KTD8. **기존 Node test suite와 실제 브라우저 QA를 함께 사용한다.** 순수 검색·정렬·페이지 계산은 Node 테스트로 고정하고, history·scroll·responsive layout은 실행 중인 `/demo`에서 viewport별로 확인한다.

### High-Level Technical Design

~~~mermaid
sequenceDiagram
    participant L as Learner
    participant P as Shell /demo page
    participant C as Demo index client
    participant U as Browser URL history
    participant S as sessionStorage
    participant D as Demo detail route

    L->>P: Open or navigate to /demo?q=...&category=...&page=...
    P->>P: Read searchParams, filter, rank, paginate 24 items
    P->>C: Provide sanitized page view model
    L->>C: Search, filter, or paginate
    C->>U: replace search or push filter/page
    L->>C: Open a demo card
    C->>S: Save list URL, demo URL, and scroll position
    C->>D: Navigate to detail
    L->>D: Browser back or 목록으로 돌아가기
    D->>U: Return through browser history
    U->>C: Recreate previous list state
    C->>S: Restore anchor and scroll position, then clear stale entry
~~~

The Page reads query parameters on the server and sends only the current 24-item view model plus pagination metadata to the client controller. The view model contains the visible URL, title, document name, document URL, status, and category; it does not need the internal zone field. The client controller owns input debounce, router transitions, card navigation provenance, and restoration.

### Assumptions and Deferred Implementation Notes

- `demos.yaml` remains the single source of truth and currently contains 241 `done` demos.
- An unknown category resolves to `전체`, a non-positive or non-numeric page resolves to page 1, and a page beyond the last page resolves to the last available page. Canonical corrections use `replace`; page 1 and an empty query omit unnecessary query keys.
- The exact client component and hook names may change if the existing package boundary offers a better seam, but the server/client split and the `study_*` storage namespace are fixed.
- If the saved anchor no longer exists after a query or viewport change, the implementation should use the saved pixel position only when it is safe and otherwise start at the list top.
- The exact card padding, truncation, and focus styling are execution-time visual tuning items. They must preserve the grid, hit-area, link separation, and accessibility requirements.

### System-Wide Impact

- **Shell rendering:** `/demo` remains a server page that reads query parameters and owns `getDemos()` and `getManifest()`. A small client interaction island owns input, transitions, and restoration.
- **Navigation contract:** The detail page's existing static `backUrl` behavior must be replaced or wrapped by history-aware behavior without changing learner-facing `/demo/*` URLs. The document-specific `?run` hub flow remains compatible with its existing sibling-demo navigation.
- **Storage policy:** Any browser storage key must use the shell's `study_*` prefix. The payload is tab-scoped and must not become a source of truth for query results.
- **Performance:** The DOM contains at most 24 cards per page. Virtualization is not part of this plan.
- **Zone boundary:** Zone names remain server-resolved implementation data. They are not added to the client view model, card UI, search index, or learner URL.

### Risks and Dependencies

| Risk or dependency | Mitigation |
|---|---|
| Direct query navigation renders a different result from client navigation | Parse the same canonical query model on the server for initial and subsequent navigations and keep filter, ranking, and pagination pure. |
| Scroll restoration runs before the 24-card grid has its final height | Restore after the list has committed, prefer the saved card anchor, and use a bounded retry or fallback-to-top path. |
| `sessionStorage` contains a stale entry after a failed navigation or a different query | Key entries by the canonical list context, consume only after a successful restore, and discard entries that do not match the current context. |
| `router.back()` has no useful in-app history on a directly opened detail URL | Record whether a valid list context exists and use `/demo` as the safe fallback. |
| Full-card click handling creates nested anchors | Keep the card surface and document link as separate interactive targets and test keyboard activation for both. |
| Mobile cards remain visually tall even after pagination | Treat compact card height and 390px/430px viewport QA as a release gate; adjust spacing before considering a smaller page size. |

### Sources and Research

- `nextjs-app/AGENTS.md` — shell/client boundary, URL, storage namespace, zone hiding, UI package rules.
- `nextjs-app/docs/06-ui-and-screen-design.md` — existing 3-column and top-chip design intent for the demo index.
- `nextjs-app/apps/shell/src/app/demo/page.tsx` — current server list composition and single-column rendering.
- `nextjs-app/packages/ui/src/demo/DemoIndexCard.tsx` — current card fields, links, and action structure.
- `nextjs-app/apps/shell/src/app/demo/[...slug]/page.tsx` — current direct-detail and document-hub routing branches.
- `nextjs-app/packages/ui/src/demo/DemoPageHeader.tsx` — current static back link and detail navigation surface.
- `nextjs-app/packages/test-suite/src/tier1-feature-coverage/07-intercepting-routes.test.ts` — existing feed scroll and `router.back()` contract pattern.
- `nextjs-app/packages/test-suite/src/tier1-feature-coverage/10-nextjs-apis.test.ts` — existing `router.push`, `router.replace`, and `router.back()` test pattern.
- `nextjs-app/apps/shell/node_modules/next/dist/docs/01-app/03-api-reference/02-components/link.md` — installed Next.js 16.3.1 `Link` scroll behavior.
- `nextjs-app/apps/shell/node_modules/next/dist/docs/01-app/03-api-reference/04-functions/use-router.md` — installed Next.js 16.3.1 history and scroll options.

---

## Implementation Units

### U1. Demo index view model and pure state rules

**Goal:** 서버의 데모·문서 데이터를 검색·대분류·관련도·페이지 계산에 사용할 표시 모델로 변환한다.

**Requirements:** R1-R5, R7, R14, R16. KTD1, KTD2, KTD3.

**Dependencies:** None.

**Files:**

- `nextjs-app/apps/shell/src/lib/demo-index.ts` — create pure view-model, query parsing, ranking, filtering, and pagination helpers.
- `nextjs-app/apps/shell/src/lib/docs.ts` — modify only if document-category/title joining needs a narrow shell data seam.
- `nextjs-app/packages/test-suite/src/tier1-feature-coverage/13-demo-index-state.test.ts` — create pure-state and URL-contract tests.

**Approach:**

1. Join each demo to its document entry and derive the display category from the existing manifest tree root title.
2. Normalize query whitespace and case for title, URL, and document-name matching.
3. Rank exact and prefix matches before contains matches without changing source order for equal scores.
4. Clamp invalid page values to a valid page and expose result count and total pages to the UI.
5. Return only learner-visible fields to the client controller; keep `zone` server-side.

**Patterns to follow:** `getDemos()`, `findDocForDemo()`, `getManifest()`, `@study/demos` schema types, and the existing Node `node:test` suite.

**Test scenarios:**

- An empty query returns all 241 source-ordered demos and a 24-item first page.
- A title fragment, URL fragment, and related document-name fragment each return the expected demo.
- Exact and prefix matches rank before contains-only matches while equal-ranked items retain source order.
- A selected category combined with a query returns only entries satisfying both conditions.
- Page 1, the last page, zero, negative, non-numeric, and out-of-range page values resolve to safe page values and correct slices.
- A view model does not expose the internal `zone` field.

**Verification:** The helper behavior is deterministic and the test suite covers the state contract without requiring a browser runtime.

### U2. Compact card, toolbar, empty state, and pagination UI

**Goal:** 데모 색인을 3/2/1 반응형 압축 카드와 검색·필터·페이지네이션 컨트롤로 표현한다.

**Requirements:** R2, R6-R9, R14-R15. KTD4, KTD6.

**Dependencies:** U1.

**Files:**

- `nextjs-app/packages/ui/src/demo/DemoIndexCard.tsx` — modify card density, full-card activation, visible metadata, and document-link separation.
- `nextjs-app/packages/ui/src/demo/DemoIndexToolbar.tsx` — create search input, category filter, result summary, and pending state.
- `nextjs-app/packages/ui/src/demo/DemoPagination.tsx` — create responsive desktop/mobile pagination controls.
- `nextjs-app/packages/ui/src/demo/DemoEmptyState.tsx` — modify only if the existing empty-state contract cannot express no-result guidance.
- `nextjs-app/packages/ui/src/demo/index.ts` — export new reusable UI pieces.
- `nextjs-app/packages/test-suite/src/tier1-feature-coverage/14-demo-index-ui-contract.test.ts` — create structural and accessibility contract tests.

**Approach:**

1. Use an index-only compact card density and a responsive grid with three, two, and one columns at the established breakpoints; do not shrink the shared document-hub card density globally.
2. Make the card surface keyboard-activatable without nesting the related-document anchor inside another anchor.
3. Keep status and URL as secondary metadata and omit zone and hosting implementation details from the learner-facing surface.
4. Render desktop previous/number/next controls and mobile previous/current/next controls from the same page model; hide the control when only one page exists.
5. Announce result count and empty-result changes through accessible labels or a polite live region.

**Patterns to follow:** `cardClass()`, existing `DemoStatusBadge`, `Input`, `Button`, `Badge`, `DocDemoHub`, and the existing shadcn-inspired `@study/ui` source pattern.

**Test scenarios:**

- The card presents title, document link, status, and demo navigation without nested anchors.
- Activating the card with a pointer or keyboard opens the demo; activating the document link opens only the document.
- Desktop, tablet, and mobile render the intended 3/2/1 grid shape.
- Desktop pagination exposes valid page choices; mobile exposes only previous/current/next semantics and disables unavailable directions.
- An empty result announces the result state and provides a way to clear the active search or category without adding a separate reset link.
- Search input, category controls, pagination controls, and card/document links expose accessible names and keyboard focus.

**Verification:** The UI contract tests pass, and manual browser review confirms that the compact card does not become a visually dense or ambiguous control.

### U3. URL-driven list controller and server/client composition

**Goal:** `/demo`의 서버 데이터와 클라이언트 상호작용을 결합하고 query 변경 규칙을 적용한다.

**Requirements:** R1-R8, R13-R15. KTD1-KTD4.

**Dependencies:** U1, U2.

**Files:**

- `nextjs-app/apps/shell/src/app/demo/page.tsx` — pass the server-derived view model into the client controller and preserve metadata/statistics composition.
- `nextjs-app/apps/shell/src/components/demo/DemoIndexClient.tsx` — create the client boundary for URL parsing, debounce, transitions, filtering, pagination, and restoration hooks.
- `nextjs-app/packages/test-suite/src/tier1-feature-coverage/15-demo-index-url-state.test.ts` — create URL transition and route-contract tests.

**Approach:**

1. Read `q`, `category`, and `page` from the Page `searchParams` and pass the canonical view model to the client controller.
2. Use a debounced `replace` transition for search text and `push` transitions for category and page changes.
3. Reset page and scroll state when search or category changes.
4. Keep the client controller focused on input state, pending transitions, and navigation provenance rather than duplicating server filtering.
5. Pass the filtered page to the UI components without changing `demos.yaml` or the detail route contract.

**Patterns to follow:** the current detail page's async `searchParams` contract, existing debounce/transition explanations, `router.push`/`router.replace` conventions, and the server data access surface in `apps/shell/src/lib/docs.ts`.

**Test scenarios:**

- `/demo` with no query renders page 1 and omits unnecessary default query values.
- Typing a query updates the visible result after debounce and uses replacement semantics instead of one history entry per keystroke.
- Selecting a category pushes a new history entry and resets page to 1.
- Moving to another page pushes a new history entry while preserving active query and category.
- A refresh at a copied `q`, `category`, and `page` URL recreates the same result set.
- Opening a copied query URL directly on the server produces the same result count and card order as reaching it through client navigation.

**Verification:** Type checking and the focused test-suite contract pass; the URL is the single reproducible source for semantic list state.

### U4. History-aware detail return and scroll restoration

**Goal:** 상세 페이지의 복귀 버튼과 목록의 복원 보조 상태가 동일한 navigation context를 사용하도록 만든다.

**Requirements:** R9-R13, R15-R16. KTD2, KTD5, KTD7.

**Dependencies:** U3.

**Files:**

- `nextjs-app/apps/shell/src/app/demo/[...slug]/page.tsx` — provide the detail header with a history-aware back control and direct-entry fallback context.
- `nextjs-app/packages/ui/src/demo/DemoPageHeader.tsx` — accept the shell-owned back control while preserving the current header layout and sibling-demo navigation.
- `nextjs-app/apps/shell/src/components/demo/DemoBackButton.tsx` — create the client button that uses browser history and falls back to `/demo`.
- `nextjs-app/apps/shell/src/components/demo/useDemoListRestoration.ts` — create storage, restore timing, anchor matching, and stale-entry cleanup logic.
- `nextjs-app/packages/test-suite/src/tier1-feature-coverage/16-demo-index-navigation.test.ts` — create history, fallback, storage, and stale-entry contract tests.

**Approach:**

1. Save the canonical list context, clicked demo URL, and current scroll position before opening a detail route.
2. Use the same history semantics for browser back and the back-style `목록으로 돌아가기` button.
3. Detect a valid in-app list context before using history; otherwise navigate to the base `/demo` list. Preserve the existing document-hub `?run` navigation and sibling-demo behavior.
4. Restore the saved card anchor after the list has committed, use the saved scroll position as a compatible fallback, and clear the entry only after successful consumption.
5. Ignore stored context after a new query, category, or page transition.

**Patterns to follow:** the existing `DemoPageHeader` link surface, `router.back()` contract tests in `packages/test-suite`, `study_*` browser-storage namespace rules, and existing scroll measurement patterns in `@study/ui`.

**Test scenarios:**

- Opening a card from a filtered page and returning with browser back restores the prior URL, page, card anchor, and scroll position.
- Activating `목록으로 돌아가기` from the same context produces the same restoration as browser back.
- Opening a demo from a document-specific hub preserves that hub's existing history and sibling-demo behavior.
- Directly opening a detail URL without a stored list context falls back to `/demo` instead of an external history entry.
- A stale stored anchor or missing card does not block navigation and falls back to a safe scroll position.
- A new search, category, or page transition does not reuse an old restoration entry.
- Storage read/write failures do not break card navigation or detail rendering.
- A successfully consumed restoration entry is cleared so a later unrelated visit does not jump to an old position.

**Verification:** Focused navigation tests pass, and browser QA confirms history behavior in both same-tab navigation and direct-detail entry.

### U5. Design contract alignment and browser QA

**Goal:** 기존 화면 설계 문서와 구현 계획을 일치시키고 실제 viewport·navigation 흐름을 검증한다.

**Requirements:** R6-R16. KTD4-KTD8.

**Dependencies:** U1-U4.

**Files:**

- `nextjs-app/docs/06-ui-and-screen-design.md` — update the `/demo` index contract with current 241-demo scope, search-first behavior, 24-item pagination, mobile controls, and history restoration.
- `nextjs-app/packages/test-suite/src/tier1-feature-coverage/17-demo-index-contract.test.ts` — create checks for the documented `/demo` contract and learner-facing route boundaries.

**Approach:**

1. Replace the stale demo-index mock count and one-screen assumptions with the agreed behavior.
2. Document that category filters reuse the existing document menu taxonomy and that zone remains hidden.
3. Record the distinction between semantic URL state and non-URL scroll restoration.
4. Run the browser verification matrix after automated checks pass.

**Patterns to follow:** `nextjs-app/docs/06-ui-and-screen-design.md`, `nextjs-app/docs/03-composition-architecture.md`, and the repository's Node test suite organization.

**Test scenarios:**

- The documentation names the same filter categories, page size, responsive columns, and restoration semantics as the implementation contract.
- Learner-facing links remain under `/demo/*` and do not expose `/zone/*`.
- Browser QA covers 1440px desktop, 1024px tablet, 390px mobile, and 430px mobile.
- Browser QA covers initial load, query search, category filter, page navigation, no-results state, detail open, browser back, header back button, refresh, and direct-detail fallback.

**Verification:** Documentation and test contracts match the implementation, and the manual matrix passes without modifying unrelated dirty-worktree files.

---

## Verification Contract

### Automated checks

| Check | Scope | Done signal |
|---|---|---|
| `pnpm --filter @study/shell check-types` | Shell route, client controller, query and restoration types | No TypeScript errors in the shell. |
| `pnpm --filter @study/ui check-types` | Card, toolbar, pagination, and detail-header components | No TypeScript errors in the shared UI package. |
| `pnpm --filter @study/test-suite test:tier1` | Pure state, UI contract, URL, and navigation contract tests | Existing Tier 1 tests and the new demo-index tests pass. |
| `pnpm check-types` | Workspace-level type integration | All affected workspace packages type-check together. |

### Browser verification

- At 1440px, 1024px, 390px, and 430px widths, verify the 3/2/1 grid, card density, readable titles, and control wrapping.
- Verify that search updates after debounce, does not create a history entry per keystroke, and preserves a shareable URL.
- Verify that category and page changes update the URL, reset page when required, and move the list to the top.
- Verify that mobile pagination uses previous/current/next controls and does not expose an unusable horizontal page-number strip.
- Verify that related-document links do not open the demo route.
- Verify that browser back and `목록으로 돌아가기` restore the same filtered page and clicked-card position.
- Verify that refresh at a copied list URL recreates the semantic state and that direct detail entry falls back to `/demo`.
- Verify no-result, invalid-page, missing-storage, stale-storage, and slow-layout restoration states.

### Verification boundaries

The implementation must not require a new API, database, search service, or package dependency.

---

## Definition of Done

- R1-R16 are implemented without changing the `demos.yaml` source-of-truth contract or zone routes.
- The list renders 24 compact cards per page with the agreed 3/2/1 responsive layout.
- Search, category, and page state are reproducible from the URL with the agreed replace/push behavior.
- Browser back and the detail back-style button restore the prior list context; direct detail entry has a safe `/demo` fallback.
- Scroll restoration uses the `study_*` storage namespace as a non-authoritative enhancement and cleans stale entries.
- The full card and related-document link have separate, accessible interactions.
- Automated type and test checks pass, and the browser verification matrix passes at all four target widths.
- `nextjs-app/docs/06-ui-and-screen-design.md` describes the implemented `/demo` behavior.
- No unrelated user changes, including dirty demo files and staged deletions, are modified.
