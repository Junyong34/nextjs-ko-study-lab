# 15. M2 진행 보고서 — file-conventions · components · directives

[13. 데모 가이드 섹션 최신화 계획](./13-demo-guide-section-modernization-plan.md)의 M2 구간(`3-api-reference`의 `file-conventions` 43건, `components` 10건, `directives` 8건 = 61건) 실행 기록이다.

---

## 1. 결론

61건 중 **15건의 가이드를 재작성했고, 46건은 보류했다.** 보류 사유는 문구 품질이 아니라 **실습 화면에 적을 실행 절차가 존재하지 않는다**는 것이다.

| 구분 | 건수 | 처리 |
|---|---:|---|
| 실제 라우트·API·Server Action 보유 | 15 | 가이드 재작성 완료 |
| 제네릭 "실습 콘솔" 복제 | 12 | 보류 — 실습 보강 선행 필요 |
| 정적 화면 | 34 | 보류 — 실습 보강 선행 필요 |

재작성한 15건은 `guide-consistency` 검증 GC01~GC07을 **15/15 통과**한다.

---

## 2. 재작성한 15건

각 데모의 실습 코드·서브 라우트·API 핸들러를 판독해 실제 조작 순서로 다시 썼다. 스텝 제목은 화면에 실존하는 버튼·링크 라벨을 `[대괄호]`로 인용하고, 마지막 스텝에는 `observe`/`observeAt`로 관찰 대상을 명시했다.

| 데모 | 실습 실체 | 스텝 |
|---|---|---:|
| `file-conventions/parallel-routes` | `@analytics`·`@team` 슬롯이 `layout.tsx`에 props 주입 | 3 |
| `file-conventions/parallel-routes/conditional-slot` | `@admin`·`@user` 슬롯 병렬 렌더 | 2 |
| `file-conventions/intercepting-routes` | `@modal/(.)photos/[id]` 인터셉트 | 3 |
| `file-conventions/loading/skeleton-boundary` | `slow-catalog/loading.tsx` + 1200ms 지연 | 3 |
| `file-conventions/not-found/missing-product-404` | `items/[id]`에서 실제 `notFound()` 호출 | 3 |
| `file-conventions/error/payment-error-boundary` | `checkout/error.tsx` + `reset()` | 3 |
| `file-conventions/template/remount-lifecycle` | `template.tsx`/`layout.tsx` + `tab-a`·`tab-b` | 3 |
| `file-conventions/route/rest-api-orders` | `api/route.ts` GET 200 / POST 201 / 400 | 3 |
| `file-conventions/route/webhook-signature` | HMAC-SHA256 서명 검증, 200 vs 401 | 2 |
| `file-conventions/route/sse-stock-stream` | `ReadableStream` + `text/event-stream` | 3 |
| `file-conventions/route-groups/group-url-isolation` | `(shop)`·`(marketing)` 그룹 URL 격리 | 3 |
| `file-conventions/dynamic-segments/single-param` | `items/[id]` + `await params` | 3 |
| `file-conventions/dynamic-segments/catch-all-slug` | `shop/[...slug]` 깊이 1~3 | 3 |
| `file-conventions/dynamic-segments/optional-catch-all` | `docs/[[...slug]]` 루트 인덱스 겸용 | 3 |
| `directives/use-server/file-level-action` | `actions.ts` 파일 레벨 `'use server'`, 400ms | 3 |

스텝 수가 2~3으로 갈리는 것은 실제 조작 단계 수를 따랐기 때문이다(G3). 조작이 없는 관찰형 데모(`conditional-slot`)는 2스텝이다.

---

## 3. 검증기 결함 3건 수정

M2 작업 중 `guide-consistency-validator`가 **작성한 가이드를 오판하는** 결함이 드러나 함께 고쳤다. 셋 다 검증기 문제였고 가이드 문제가 아니었다.

### 3-1. 중첩 데모 소유권 (GC02 오탐)

`file-conventions/parallel-routes` 디렉토리 안에 별도 데모인 `parallel-routes/conditional-slot`이 들어 있다. 검증기가 부모 데모를 스캔하며 자식 데모의 `page.tsx`를 집어, 부모가 자식의 가이드를 자기 것으로 인식했다. 그 결과 두 데모의 스텝 제목이 같다고 판정되어 GC02(중복 금지) 위반이 났다.

manifest에서 `other.url.startsWith(demo.url + '/')`인 데모의 디렉토리를 계산해 파일 수집과 라벨 추출에서 배제하도록 고쳤다.

### 3-2. `layout.tsx` 진입 파일 미탐색

Parallel Routes 데모는 슬롯을 props로 받는 `layout.tsx`가 진입 파일이며 가이드도 거기 있다. 검증기는 `page.tsx`만 우선 탐색한 뒤 나머지를 순회해서, 하위 파일의 가이드를 먼저 집었다. 최상위 진입 파일 탐색을 `page.tsx` → `layout.tsx` 순으로 명시했다.

### 3-3. JSX 여는 태그 조기 종료 (GC03 대량 오탐)

가장 영향이 큰 결함이다. 라벨 추출이 `<button[^>]*>`로 여는 태그를 잡았는데, 속성값에 화살표 함수가 있으면 **`=>`의 `>`에서 태그가 끝난 것으로 오인**한다.

```jsx
<button onClick={() => sendWebhook(false)} className="...">
  <span>1. 정상 서명 웹훅 전송 (200 OK 기대)</span>
```

이 경우 추출된 "내용"이 `sendWebhook(false)} disabled= className="w-full rounded…"` 245자가 되어 40자 제한에 걸려 버려진다. 화살표 함수를 쓰는 모든 버튼의 라벨이 소실됐다.

중괄호 깊이와 따옴표 상태를 추적해 태그 밖의 `>`만 인정하는 파서(`findJsxElements`)로 교체했다. 아울러 `cleanHtml`이 `{isPending ? '검증 중...' : '쿠폰 적용'}` 같은 표현식을 통째로 지우던 것을, 안쪽 문자열 리터럴은 실제 화면 텍스트이므로 살리도록 고쳤다.

수정 효과 (`webhook-signature`):

| | 수정 전 | 수정 후 |
|---|---|---|
| 추출 라벨 | 0개 | `1. 정상 서명 웹훅 전송 (200 OK 기대) VALID` 외 1건 |

전체 GC03 위반은 164건 → 156건으로 줄었다. 나머지 감소분은 M3~M4에서 해당 데모를 작성할 때 반영된다.

---

## 4. 보류한 46건

### 4-1. 보류 사유

두 부류다.

**제네릭 "실습 콘솔" 12건** — 서로 다른 12개 데모가 사실상 같은 실습 화면을 쓴다. 상품 선택 버튼 2개, 수량 `+`/`-`, 동작 실행 버튼, 로그 패널로 구성되며 **해당 데모의 Next.js 기능과 아무 관련이 없다.**

`file-conventions/not-found/programmatic-not-found`가 대표 사례다. 이 데모의 실습 컴포넌트에는 `notFound()` 호출도, `not-found.tsx`도, 라우팅도 없다. `useState`로 상품과 수량을 바꾸고 로그를 쌓을 뿐이다. 이 상태에서 정직한 가이드를 쓰면 이렇게 된다.

```text
1. [러닝화 (#001)] 클릭 — 상품을 선택합니다
2. 수량 [+] 클릭       — 주문 수량을 조정합니다
3. 로그 패널 관찰       — 우측에 동작 로그가 쌓입니다
```

`notFound()`는 한 번도 등장하지 않는다. 이 템플릿은 전체 241건 중 **65건**이 공유한다.

**정적 화면 34건** — 조작 요소가 0~3개이며 대부분 읽기 전용 텍스트 박스다. `components/link/prefetch-options`의 실습은 `prefetch={null}` / `{true}` / `{false}`를 설명하는 정적 카드 3개로, 클릭할 수 있는 것이 없다.

둘 다 [`AGENTS.md`](../AGENTS.md) 규칙 24(가짜 시뮬레이션 금지) 위반에 해당한다.

### 4-2. 보류 목록

| 데모 | 유형 | 실습 LOC | 조작 요소 |
|---|---|---:|---:|
| `file-conventions/layout/dynamic-category-layout` | 제네릭 실습 콘솔 | 142 | 5 |
| `file-conventions/page/react-19-use-params` | 제네릭 실습 콘솔 | 142 | 5 |
| `file-conventions/not-found/programmatic-not-found` | 제네릭 실습 콘솔 | 142 | 5 |
| `file-conventions/default/hard-reload-restore` | 제네릭 실습 콘솔 | 142 | 5 |
| `file-conventions/mdx-components/global-mdx-theme` | 제네릭 실습 콘솔 | 142 | 5 |
| `file-conventions/instrumentation/server-boot-log` | 제네릭 실습 콘솔 | 142 | 5 |
| `file-conventions/proxy/gateway-router` | 제네릭 실습 콘솔 | 142 | 5 |
| `file-conventions/unauthorized/anonymous-401` | 제네릭 실습 콘솔 | 142 | 5 |
| `file-conventions/route-segment-config/dynamic-params-toggle` | 제네릭 실습 콘솔 | 142 | 5 |
| `file-conventions/route-segment-config/instant-prefetch` | 제네릭 실습 콘솔 | 142 | 5 |
| `file-conventions/route-segment-config/max-duration-timeout` | 제네릭 실습 콘솔 | 142 | 5 |
| `components/image/priority-lcp-preload` | 제네릭 실습 콘솔 | 170 | 2 |
| `file-conventions/template/input-reset-animation` | 정적 화면 | 52 | 1 |
| `components/link/prefetch-options` | 정적 화면 | 52 | 3 |
| `file-conventions/layout/state-preservation` | 정적 화면 | 53 | 1 |
| `file-conventions/loading/nested-segment-loading` | 정적 화면 | 53 | 0 |
| `file-conventions/instrumentation/client-timing-metrics` | 정적 화면 | 53 | 0 |
| `file-conventions/error/reset-recovery` | 정적 화면 | 54 | 1 |
| `components/link/soft-navigation-scroll` | 정적 화면 | 54 | 4 |
| `directives/use-cache/private-profile-cache` | 정적 화면 | 54 | 0 |
| `file-conventions/parallel-routes/independent-tabs` | 정적 화면 | 55 | 0 |
| `file-conventions/page/static-and-dynamic` | 정적 화면 | 57 | 0 |
| `file-conventions/route-groups/shop-vs-admin-roots` | 정적 화면 | 57 | 0 |
| `file-conventions/intercepting-routes/direct-vs-modal` | 정적 화면 | 57 | 0 |
| `file-conventions/route-segment-config/runtime-nodejs-edge` | 정적 화면 | 57 | 0 |
| `components/image/blur-placeholder` | 정적 화면 | 57 | 1 |
| `components/image/responsive-sizes` | 정적 화면 | 63 | 2 |
| `file-conventions/layout/root-and-nested` | 정적 화면 | 65 | 1 |
| `directives/use-client/boundary-declaration` | 정적 화면 | 88 | 0 |
| `file-conventions/default/parallel-fallback` | 정적 화면 | 94 | 2 |
| `components/form-component` | 정적 화면 | 102 | 2 |
| `file-conventions/metadata-manifest/dynamic-pwa-manifest` | 정적 화면 | 106 | 0 |
| `file-conventions/metadata-robots/dynamic-crawler-rules` | 정적 화면 | 107 | 0 |
| `directives/use-server/inline-action-closure` | 정적 화면 | 107 | 2 |
| `file-conventions/forbidden/admin-role-403` | 정적 화면 | 111 | 3 |
| `components/script/loading-strategies` | 정적 화면 | 113 | 1 |
| `directives/use-client/window-storage-access` | 정적 화면 | 123 | 2 |
| `file-conventions/metadata-sitemap/split-index-sitemaps` | 정적 화면 | 151 | 0 |
| `components/font/local-font-face` | 정적 화면 | 151 | 2 |
| `file-conventions/metadata-app-icons/dynamic-favicon` | 정적 화면 | 154 | 0 |
| `file-conventions/metadata-og/discount-banner-og` | 정적 화면 | 156 | 0 |
| `components/font/google-variable-tokens` | 정적 화면 | 169 | 3 |
| `components/script/pg-sdk-onload` | 정적 화면 | 177 | 2 |
| `directives/use-cache/remote-redis-cache` | 정적 화면 | 181 | 2 |
| `directives/use-cache/component-jsx-cache` | 정적 화면 | 182 | 2 |
| `directives/use-cache/function-cache` | 정적 화면 | 183 | 2 |


*실습 LOC는 `VerificationFooter`를 제외한 값이다. 조작 요소는 `button`·`Link`·`input`·`select`·`textarea` 수를 합산했다.*

---

## 5. 다음 단계

1. **M3** (`functions` 49건, `config` 22건, `edge` 2건) 착수 — 같은 방식으로 실습 실체를 먼저 분류한 뒤 진짜 실습부터 재작성한다.
2. **보류 46건의 처리 방향 결정** — 실습 보강 없이는 가이드가 성립하지 않는다. 계획서 3-2의 T2-b에 해당하며, 사실상 데모 본체 재구축이다.
3. **GC03 오류 승격 시점 재검토** — 3-3 수정으로 라벨 추출 정확도가 올라갔으므로, 계획서가 정한 M2 종료 시점 승격을 M4 이후로 미룬다. 아직 위반 156건이 남아 있어 지금 오류로 올리면 전체 테스트가 실패한다.
