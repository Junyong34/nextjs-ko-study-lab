Intent: 상품 상세 인터셉트 라우팅 실습 — "목록 요약 즉시 렌더(모달)" vs "정식 페이지 메타데이터 + 스트리밍"
Author: Claude (초안)
Status: done
Approval: 2026-10-05 대화 승인(PR 없음). 사용자가 계획 검토 후 지연 2초로 조정을 요청하고 용어 원칙 반영 제안에 "그대로 진행 해줘"로 구현을 지시했다. 이 승인은 용어 원칙(요구사항 5항)과 지연 2초를 포함한 이 버전에 한한다. 커밋 여부는 구현·검증 후 사용자에게 확인한다.

## Problem

기존 Intercepting Routes 실습은 "같은 URL이 진입 방식에 따라 다르게 렌더된다"까지만 보여준다(2026-10-05 점검, 코드 읽기 기준).

- `intercepting-routes`(`@modal/(.)photos/[id]`): 기본 모달 인터셉트.
- `intercepting-routes/direct-vs-modal`(`@modal/(.)target/[id]`): 소프트 내비게이션은 모달, 새 탭·새로고침은 전체 페이지. 진입 방식은 `performance.getEntriesByType('navigation')`으로 실측한다.

두 실습 모두 상세 데이터를 `getTargetItem(id)` 정적 함수로 동기 조회하고, `generateMetadata`·`Suspense`가 한 곳도 없다. 그래서 실제 서비스에서 이 기능을 쓰는 이유를 직접 확인할 수 없다.

- 모달 쪽은 서버 조회를 기다리지 않고 **목록에서 이미 가진 요약으로 즉시 열고, 부족한 부분만 채운다**.
- 정식 페이지 쪽은 **`generateMetadata`로 `<title>`·OG를 만들고, `Suspense` 안에서 상세를 스트리밍한다**(검색 봇은 완성된 HTML을 받는다).

## Proposed outcome

학습자가 상품 목록 → 상세 흐름 하나에서 아래 네 가지를 **실제 관찰값**으로 확인한다.

1. 목록에서 카드를 누르면(소프트 내비게이션) `@modal/(.)products/[id]`가 가로채 **제목·카테고리·가격이 즉시** 뜨고, 설명·사양 같은 본문은 스켈레톤을 거쳐 뒤늦게 채워진다.
2. 같은 모달을 연 채 새로고침하면 같은 URL이 `products/[id]/page.tsx` 전체 페이지로 렌더되고, **`<title>`이 상품명으로 바뀐다**(`generateMetadata`). 모달일 때 `<title>`은 목록 화면 그대로다.
3. 정식 페이지에서는 상세 본문이 `Suspense` fallback 뒤에 **스트리밍**되어 나타난다.
4. 목록이 요약을 갖고 있지 않은 상품(요약 없음)을 소프트 내비게이션으로 열면 전체 스켈레톤으로 시작하는 분기가 보인다.

예시 글의 코드는 쓰지 않는다. 구조는 학습하기 쉽도록 새로 구성한다(아래 요구사항 2·3).

## Requirements

1. **신규 데모 1개**: baseline zone `file-conventions/intercepting-routes/product-detail`(문서 `3-api-reference/3.1-file-conventions/intercepting-routes.md`). 기존 `intercepting-routes`·`direct-vs-modal` 코드는 수정하지 않는다.
2. **실제 파일 컨벤션 사용**(No-Simulation, `nextjs-app/apps/AGENTS.md` 10항): `@modal` 병렬 슬롯 + `(.)products/[id]` 인터셉트 + `products/[id]` 정식 페이지 + `default.tsx`를 만든다. 모달/전체 페이지 구분은 `useState` 토글이 아니라 어느 파일이 렌더됐는지로 결정한다.
3. **학습용 단순 구조**:
   - 목록은 **Server Component 페이지가 상품 요약 배열을 렌더**하고, 카드 링크는 `<Link>`다.
   - 요약 전달은 외부 상태 라이브러리 없이 **React Context 하나**(`ProductSeedProvider`)로 한다. 카드를 클릭하는 순간 그 요약을 Context에 담고, 모달이 같은 `id`의 요약이 있으면 즉시 그린다. 없으면 전체 스켈레톤으로 시작한다.
   - 모달의 본문 로딩은 **Server Action `fetchProductDetail(id)`** 를 클라이언트에서 호출한다(학습용 지연 포함, 지연은 학습용 sleep임을 화면에 명시).
   - 정식 페이지는 Server Component: `generateMetadata` + `<Suspense fallback>` 안의 async 상세 로더.
4. **상품 데이터**: 기존 `direct-vs-modal`의 상품 3종(트레일 GTX 하이킹화, 스톰 쉘 자켓, 얼티라이트 다운 베스트)을 쓰되 이 데모 안에 새로 정의한다. `요약`(id·이름·카테고리·가격·색)과 `상세`(설명·사양·재고)를 **타입으로 분리**해 "요약만으로 그릴 수 있는 것 / 서버에서 받아야 하는 것"이 코드로 보이게 한다. "요약 없음" 대조용으로 요약을 Context에 담지 않는 4번째 링크를 둔다.
5. **4단 레이아웃**(`DemoGuideCard` → 실습 → `ExpectedActualPanel` → `DemoDeepDiveCard`). 모달 안/전체 페이지 안 모두에 검증 패널을 둔다(`direct-vs-modal`과 같은 방식).
   - **용어 원칙**: 화면·가이드 문구는 쉬운 말을 앞에 두고 공식 용어를 괄호로 붙인다 — "앱 안에서 이동(소프트 내비게이션)", "주소로 직접 진입·새로고침(하드 내비게이션)". 인터셉트는 처음 한 번 "가로채기(Intercepting Route)"로 풀어 소개한 뒤 `(.)products` 폴더와 연결해 쓴다. 판정 문구는 조건과 결과를 한 줄로 잇는다(예: "소프트 내비게이션 → 가로채짐 / 하드 내비게이션 → 정식 페이지").
6. **검증 패널의 "실제" 값은 관측값만**:
   - 진입 방식: Navigation Timing(`navigate`/`reload`, 문서 최초 경로 = 현재 경로 여부).
   - `document.title`(모달: 목록 제목 유지 / 직접: 상품명 포함).
   - 시각 측정: 렌더 시작 → 요약 표시 → 상세 도착의 `performance.now()` 순서와 간격(모달), 스켈레톤 표시 → 본문 표시(정식 페이지는 클라이언트 마커의 마운트 순서).
   - 측정 전은 `isMatched = undefined`(대기)로 둔다. 고정 성공 문구를 쓰지 않는다.
7. 파일당 250줄 이하, `page.tsx`는 조립만 하고 `components/`·`hooks/`·`actions.ts`·`types.ts`·`data.ts`로 분리한다. 새 의존성은 추가하지 않는다. 전역 설정(`next.config.ts` 등)은 바꾸지 않는다.
8. `demos.yaml`에 `stub`으로 등록 → 구현·검증 후 `done`으로 전환한다. `done` 전환은 사용자 승인 뒤에 한다.

## Acceptance criteria

- 목록 카드 클릭 → 모달에서 요약(이름·카테고리·가격)이 상세 도착 시각보다 먼저 표시됨이 측정되고, 패널이 `일치`로 판정된다.
- 요약 없음 링크 → 모달이 전체 스켈레톤으로 시작함이 확인되고, 상세 도착 후 전체가 채워진다.
- 모달 상태에서 새로고침 → 같은 URL이 전체 페이지로 렌더되고 `document.title`이 상품명을 포함한다. 모달일 때는 포함하지 않는다.
- 정식 페이지에서 스켈레톤(fallback)이 본문보다 먼저 보이고, 본문이 뒤늦게 교체된다.
- 새 탭 직접 진입(`<a target="_blank">`)과 새로고침이 모두 정식 페이지로 렌더된다.
- 닫기(`router.back()`)로 목록으로 돌아오고, 뒤로/앞으로 이동에서도 깨지지 않는다.
- TypeScript·ESLint·`pnpm --filter @study/demos lint`·`build`(매니페스트 재생성)·`pnpm test:manifest`·baseline production 빌드가 통과한다. 기존 `intercepting-routes` 두 실습의 동작은 달라지지 않는다.

## Affected users and systems

- 사용자: Intercepting Routes를 "왜 쓰는가"까지 학습하려는 학습자.
- 시스템: `nextjs-app/apps/demo-baseline/src/app/zone/baseline/file-conventions/intercepting-routes/product-detail/`(신규), `nextjs-app/packages/demos/demos.yaml`과 생성 `demos-manifest.json`, `nextjs-app/docs/09-demo-status-and-stepwise-release-guide.md`(등록 합계), `intent/README.md` 작업 인덱스.

## Constraints

- 반드시 지킬 것: Next.js 16.3.2 기준. 구현 전 `next-devtools` MCP(`nextjs_docs`)와 번들 공식 문서로 인터셉트 레벨 규칙(`(.)`는 라우트 세그먼트 기준, 슬롯 폴더는 레벨에 포함되지 않음), `generateMetadata`와 `Suspense` 스트리밍 동작을 교차 검증한다(`nextjs-app/AGENTS.md` 5항).
- 반드시 지킬 것: zone 이동은 상대 경로, 데모 앱에 `public/` 두지 않기, 쿠키·스토리지 키를 쓴다면 baseline 접두사 사용.
- 반드시 지킬 것: 승인 전에는 읽기 전용 조사만 한다. 구현은 plan 승인 후 시작한다.
- 범위 밖: 외부 상태 라이브러리 도입, DB·외부 API 연동, 기존 두 인터셉트 실습 수정, 시각화(`/visualize`) 추가, 배포·Preview 검증, OG 이미지 실제 생성(메타 태그 값 확인까지만).

## Open questions

- 구현 단계에서 실측으로 확정: 모달에서 Server Action 호출이 목록 스크롤·모달 닫기와 겹칠 때(언마운트 후 도착) 상태 갱신 경고가 없는지.
- 구현 단계에서 실측으로 확정: iframe(셸) 안에서 `document.title`이 모달/직접 진입 때 각각 기대대로 보이는지(셸이 제목을 가로채지 않는지).
- 구현 후 사용자에게 확인: 커밋 여부(이전 작업은 "커밋 보류"였음). 확인 전에는 커밋하지 않는다.
