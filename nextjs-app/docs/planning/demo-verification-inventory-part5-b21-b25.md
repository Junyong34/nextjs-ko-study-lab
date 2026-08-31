# 데모 검증 인벤토리 — B21–B25 (데모 201–241)

[전체 인덱스](./demo-verification-inventory.md)로 돌아가기. 이 문서는 데모 201-241번(B21-B25)의 상세 기록만 담는다. 전체 집계와 데모 목록 요약표는 인덱스 문서를 참고한다.

## 데모별 상세 기록

### functions/taint-unique-value/block-secret — experimental_taintUniqueValue 원시 시크릿 유출 차단

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | 3-api-reference/3.5-config/3.5.1-next-config-js/taint.md |
| 진입점 | apps/demo-baseline/src/app/zone/baseline/functions/taint-unique-value/block-secret/page.tsx |
| 대표 검증 유형 후보 | 산출물·설정 확인 |
| 실행 결과 | mismatch |
| 초기화 방법 | 새 URL 진입 (영구 상태 없음) |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | [러닝화]/[윈드브레이커] 선택 | 버튼 클릭, 로그에 "상품 선택" 텍스트 반영 | 실습 영역 | 예 | 상품 선택 자체는 동작 |
| 2 | [+] 수량 조절 후 [동작 실행] 클릭 | 수량 변경, "동작 실행" 클릭 시 로그에 "Next.js API 트리거…동기화 성공" 문구 추가 | 실습 영역 | 예 | `experimental_taintUniqueValue` 호출과 무관한 로컬 로그 문자열일 뿐 |
| 3 | React Taint 런타임 에러 차단 및 보안 로그 관찰(관찰 위치: verification) | 검증 패널 확인 | 검증 패널 | 아니오 | 3단계에서 지시한 "보안 로그"가 검증 패널 어디에도 나타나지 않음 |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | `experimental_taintUniqueValue` 호출 여부 | 서버 결제 초기화 시 시크릿을 taint 처리 | 컴포넌트 소스 전체(`TaintUniqueValueDemo.tsx`, `page.tsx`)에 `taint` 문자열이 전혀 없음. `'use client'` 훅 기반 상품 선택/수량/로그 UI만 존재 | 산출물·설정 확인 | 소스 코드 | `components/TaintUniqueValueDemo.tsx` 1–101행 | 예 | fail |
| 2 | `next.config.ts`의 `experimental.taint` 활성화(DeepDive가 "활성화 필요"라고 명시) | `experimental.taint: true` 설정 존재 | `apps/demo-baseline/next.config.ts`에 `experimental` 필드는 `serverActions`만 있고 `taint`는 없음 | 산출물·설정 확인 | 소스 코드 | `apps/demo-baseline/next.config.ts` | 예 | fail |
| 3 | 버튼 클릭 후 [검증] 패널 상태 변화 | 정상 동작 시 "검증 완료" 배지로 전환 | 클릭 전/후 모두 "불일치" 배지, 실제값은 "인터랙션 대기 중" 고정 | 값 비교 | agent-browser 실행 캡처 | `evidence-claude/201-taint-unique-value-mismatch.png` | 예 | fail |

- 검증 불가 사유: 해당 없음(위 3개 항목 모두 확정적 fail 증거 확보)
- 필요한 도구·환경: 해당 없음
- 허용 가능한 간접 증거: 없음 — 직접 소스 대조로 충분
- 데모 재설계 필요 여부: 예
- 기대 문구 축소 필요 여부: 예

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | high | G01 | "React Taint 런타임 에러 차단 및 보안 로그 관찰"을 실제로 관찰 가능한 절차로 교체하거나, 데모 예제를 먼저 실제 API 연동으로 고친 뒤 절차를 재작성 |
| 데모 예제 | 예 | high | D02 | 서버 컴포넌트에서 `experimental_taintUniqueValue`를 실제로 호출하고, 클라이언트로 값을 전달 시도했을 때 런타임 에러가 발생하는 것을 실증해야 함(현재는 상품 선택 이커머스 UI로 전면 대체됨) |
| 검증 | 예 | high | V01, V02 | `<VerificationFooter />`가 props 없이 렌더링되어 실제 상호작용과 무관하게 고정 "불일치" 배지를 표시함(공통 결함, 아래 참고) |
| 개념 정리 | 예 | high | C01, C02 | "본 데모에서는 …taintUniqueValue를 등록한 후…" 서술이 실제로 데모가 하지 않는 동작을 단정적으로 설명함 |

#### 증거 파일

- 스크린샷: `nextjs-app/docs/planning/evidence-claude/201-taint-unique-value-mismatch.png`
- Network·콘솔·서버 로그: agent-browser 콘솔에 에러 없음(React DevTools 안내 로그만 존재). Server Action/POST 요청 없음(정적 클라이언트 상태만 사용).
- 빌드·설정 산출물: `apps/demo-baseline/next.config.ts` 전문 확인 — `experimental.taint` 없음.

#### 종합 메모

- 최종 유형 검토 사항: taint API는 런타임 에러(예외) 발생 여부로만 검증 가능하므로 "산출물·설정 확인 + 외부 도구·환경 확인(서버 콘솔 에러 로그)" 조합형 골든 샘플 후보.
- 다른 데모와 공통화할 수 있는 부분: [검증] 패널 props 연결 구조는 21개 데모 공통 수정 대상.
- 개별 구현이 필요한 부분: 서버 컴포넌트 + `experimental_taintUniqueValue` 실제 호출 코드 전면 재작성.

### functions/server-runtime/edge-vs-nodejs — Server Component runtime 분기 제어

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | 3-api-reference/3.1-file-conventions/3.1.22-route-segment-config/runtime.md |
| 진입점 | apps/demo-baseline/src/app/zone/baseline/functions/server-runtime/edge-vs-nodejs/page.tsx |
| 대표 검증 유형 후보 | 산출물·설정 확인 |
| 실행 결과 | mismatch |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | [Edge API 테스트] 클릭 후 Web 표준 API 호환성 점검 | 탭 전환, API 호환성 매트릭스 표시 전환 | 실습 영역 | 예 | 실제 `crypto.subtle` 등을 호출하지 않고 하드코딩된 표(`API_CHECKS` 배열)만 렌더링 |
| 2 | [Node.js API 테스트] 클릭 후 네이티브 모듈 지원 점검 | 탭 전환 | 실습 영역 | 예 | 상동 |
| 3 | 런타임 분기별 성능/API 지원 격리 관찰(관찰 위치: playground) | 탭별 PASS/BAILOUT 배지 색상 변화 확인 | 실습 영역 | 예 | 색상은 바뀌지만 실제 `export const runtime` 세그먼트 분기는 이 페이지 어디에도 없음 |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | `export const runtime = 'edge' \| 'nodejs'` 선언 여부 | 라우트 세그먼트에 runtime 분기 선언 존재 | `page.tsx`, `ServerRuntimeEdgeNodeDemo.tsx` 어디에도 `export const runtime` 없음. 컴포넌트는 `'use client'`이며 정적 배열 `API_CHECKS`를 탭에 따라 필터링만 함 | 산출물·설정 확인 | 소스 코드 | `components/ServerRuntimeEdgeNodeDemo.tsx` 13–19행 | 예 | fail |
| 2 | Edge/Node 버튼 클릭 후 [검증] 패널 반영 | 실제 런타임 분기 결과가 검증 패널에 반영 | 클릭 전/후 모두 "불일치", 실제값 "인터랙션 대기 중" 고정 | 값 비교 | agent-browser 실행 캡처 | `get text body` 출력(본 세션) | 예 | fail |

- 검증 불가 사유: 해당 없음
- 필요한 도구·환경: 해당 없음(정적 소스 대조로 충분)
- 허용 가능한 간접 증거: 없음
- 데모 재설계 필요 여부: 예
- 기대 문구 축소 필요 여부: 예

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | high | G01 | "next.config.ts turbopack 규칙 및 로더 설정 확인" 등 실제로 확인할 지점이 없는 절차 제거, 실제 두 개의 라우트(edge/nodejs)로 분리 이동하는 절차로 재작성 |
| 데모 예제 | 예 | high | D02 | 실제로 `runtime = 'edge'`와 `runtime = 'nodejs'`를 각각 선언한 두 개의 서버 컴포넌트/라우트를 만들어 API 호출 성공/실패(Bailout 빌드 에러)를 실증해야 함 |
| 검증 | 예 | high | V01, V02 | 공통 결함(아래 참고) |
| 개념 정리 | 예 | high | C01 | "0ms 콜드스타트"는 측정 근거 없는 정량 주장(playbook 5절 규칙 위반) |

#### 증거 파일

- 스크린샷: 별도 저장 없음(패턴이 201과 동일해 대표 스크린샷으로 대체).
- Network·콘솔·서버 로그: 콘솔 에러 없음. 네트워크 요청 없음(완전 클라이언트 상태).
- 빌드·설정 산출물: `apps/demo-baseline/next.config.ts`, 대상 디렉터리 전체 파일 목록에 `runtime` 세그먼트 선언 없음.

#### 종합 메모

- 최종 유형 검토 사항: 실제로는 두 개의 실제 라우트(예: `/edge`, `/nodejs` 서브 세그먼트)를 만들고 `node:fs` 등을 edge에서 호출했을 때 발생하는 빌드/런타임 에러를 "외부 도구·환경 확인(서버 로그)"으로 캡처하는 편이 정직하다.
- 다른 데모와 공통화할 수 있는 부분: [검증] 패널 공통 결함.
- 개별 구현이 필요한 부분: 실제 runtime 세그먼트 분기 라우트 신설.

### functions/use-report-web-vitals/telemetry — useReportWebVitals() 클라이언트 웹 바이탈 측정

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | 3-api-reference/3.3-functions/use-report-web-vitals.md |
| 진입점 | apps/demo-baseline/src/app/zone/baseline/functions/use-report-web-vitals/telemetry/page.tsx |
| 대표 검증 유형 후보 | 값 비교 |
| 실행 결과 | mismatch |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | `useReportWebVitals` 훅 등록 점검 및 LCP/CLS/FID 이벤트 감지 | 페이지 진입 후 관찰만 가능(조작 요소 없음) | 실습 영역 | 아니오 | 데모 예제 컴포넌트에 버튼/입력 등 상호작용 요소가 전혀 없음 |
| 2 | 수집된 텔레메트리 데이터 및 성능 지표 관찰 | "LCP: 540ms", "TTFB: 85ms" 텍스트 확인 | 실습 영역 | 아니오(조작 불가, 열람만 가능) | 두 수치는 하드코딩된 JSX 텍스트로, 실제 `PerformanceObserver`/`useReportWebVitals` 콜백 값이 아님 |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | `useReportWebVitals` 훅 사용 여부 | 컴포넌트가 훅을 등록하고 콜백으로 실측값을 받음 | `UseReportWebVitalsDemo.tsx` 전체 12행 중 `useReportWebVitals` 문자열 없음. `<div>LCP: 540ms</div>` 형태의 고정 JSX만 존재 | 값 비교 | 소스 코드 | `components/UseReportWebVitalsDemo.tsx` 1–12행 | 예 | fail |
| 2 | LCP/TTFB 수치가 실측값인지 여부 | 브라우저 렌더링에 따라 변동하는 실측값 | 새로고침·재방문을 반복해도 "540ms"/"85ms" 고정(하드코딩 문자열이므로 변할 수 없음) | 값 비교 | agent-browser 반복 접속 확인 | 본 세션 `get text body` 출력 | 예 | fail |

- 검증 불가 사유: 해당 없음
- 필요한 도구·환경: 해당 없음
- 허용 가능한 간접 증거: 없음
- 데모 재설계 필요 여부: 예
- 기대 문구 축소 필요 여부: 예

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | high | G02 | 조작 요소 자체가 없어 "훅 등록 점검"이라는 행위 지시가 실행 불가능함 — 최소한 상호작용(예: 인위적 레이아웃 이동 유발 버튼)을 추가하거나 관찰 전용 절차로 재작성 |
| 데모 예제 | 예 | high | D02 | 실제 `useReportWebVitals(metric => setMetrics(...))`를 루트 레이아웃 또는 해당 페이지에 등록해 실측값을 표시해야 함 |
| 검증 | 예 | high | V01, V02 | 공통 결함 + 하드코딩 수치를 실제값처럼 제시하는 이중 위반 |
| 개념 정리 | 예 | high | C01, C02 | "navigator.sendBeacon으로 전송하는 흐름을 검증합니다"라고 서술하지만 실제로 전송 코드가 전혀 없음 |

#### 증거 파일

- 스크린샷: 별도 저장 없음.
- Network·콘솔·서버 로그: 네트워크 요청 없음(sendBeacon 호출 없음 확인).
- 빌드·설정 산출물: 해당 없음.

#### 종합 메모

- 최종 유형 검토 사항: 실제 측정치 골든 샘플로 쓰려면 "값 비교"형이 적절하지만, 현재는 완전 고정값이라 유형 판정 자체가 무의미하다.
- 다른 데모와 공통화할 수 있는 부분: [검증] 패널 공통 결함.
- 개별 구현이 필요한 부분: 실제 훅 등록 및 실측 지표 렌더링.

### functions/use-server-inserted-html/head-style — useServerInsertedHTML SSR 인라인 스타일/스크립트 주입

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | 2-guides/css-in-js.md |
| 진입점 | apps/demo-baseline/src/app/zone/baseline/functions/use-server-inserted-html/head-style/page.tsx |
| 대표 검증 유형 후보 | 화면 관찰 |
| 실행 결과 | mismatch |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | 상품 선택 | 버튼 클릭 | 실습 영역 | 예 | 201/204가 완전히 동일한 이커머스 템플릿(`쇼핑몰 세션 초기화…` 로그 포함)을 재사용 |
| 2 | 수량 변경 | +/- 클릭 | 실습 영역 | 예 | 상동 |
| 3 | [동작 실행] 클릭으로 스타일 주입 서버 액션 실행 | 클릭 시 로그에 텍스트만 추가 | 실습 영역 | 예 | `'use server'` 선언이나 `useServerInsertedHTML` 호출이 전혀 없음 — "서버 액션"이라는 표현 자체가 틀림 |
| 4 | HTML head 내 동적 style 태그 주입 및 FOUC 방어 관찰 | `<head>` 요소 직접 확인 | HTML head | 아니오 | 실제 head에 동적 style 태그가 주입되는지 확인할 방법이 데모 화면에 없음 |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | `useServerInsertedHTML` 호출 여부 | 스타일 레지스트리에서 수집한 규칙을 head에 주입 | 컴포넌트/페이지 소스 전체에 `useServerInsertedHTML` 문자열 없음 | 화면 관찰 | 소스 코드 | `components/UseServerInsertedHtmlDemo.tsx` 1–101행 | 예 | fail |
| 2 | `<head>` 내 동적 `<style>` 태그 존재 | 클라이언트 하이드레이션 전 스타일 적용 | `curl`로 받은 초기 HTML의 `<head>`에 데모 관련 동적 style 태그 없음(Tailwind 빌드 CSS만 존재) | 산출물·설정 확인 | curl 응답 HTML | 본 세션 curl 결과 | 예 | fail |

- 검증 불가 사유: 해당 없음
- 필요한 도구·환경: 해당 없음
- 허용 가능한 간접 증거: 없음
- 데모 재설계 필요 여부: 예
- 기대 문구 축소 필요 여부: 예

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | high | G01 | "스타일 주입 서버 액션 실행"이라는 표현이 실제로 존재하지 않는 서버 액션을 지칭함 — 삭제 또는 재작성 |
| 데모 예제 | 예 | high | D02 | CSS-in-JS 라이브러리(styled-components 등)와 `useServerInsertedHTML`을 실제로 연동한 컴포넌트로 재작성 필요 |
| 검증 | 예 | high | V01, V02, V03 | 공통 결함 + head 주입이라는 화면-외부 증거가 필요한데도 화면 안에서 검증된 것처럼 표현(V03) |
| 개념 정리 | 예 | high | C01, C02 | "본 데모에서는 서버 렌더링 사이클에 맞춰…" 서술이 실제 미구현 동작을 단정 |

#### 증거 파일

- 스크린샷: 별도 저장 없음.
- Network·콘솔·서버 로그: 콘솔 에러 없음.
- 빌드·설정 산출물: curl로 받은 SSR HTML의 `<head>` 원본 대조.

#### 종합 메모

- 최종 유형 검토 사항: head 주입은 "화면 관찰"보다 "산출물·설정 확인(HTML 소스 보기)"에 더 가깝다 — 최종 유형 회의에서 재분류 검토 필요.
- 다른 데모와 공통화할 수 있는 부분: [검증] 패널 공통 결함.
- 개별 구현이 필요한 부분: 실제 CSS-in-JS 레지스트리 연동.

### directives/use-client/boundary-declaration — 'use client' 클라이언트 경계 선언 및 이벤트 바인딩

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | 3-api-reference/3.4-directives/use-client.md |
| 진입점 | apps/demo-baseline/src/app/zone/baseline/directives/use-client/boundary-declaration/page.tsx |
| 대표 검증 유형 후보 | 화면 관찰 |
| 실행 결과 | mismatch (검증 섹션만 원인, 데모 예제는 정상) |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | 'use client' 선언 위치 확인 및 클라이언트 훅 사용 점검 | 상품 카드에서 "담기"/"찜하기" 클릭 → 장바구니·찜 카운트 실시간 증가 | 실습 영역 | 예 | 실제 `'use client'` + `useState` + `onClick` 정상 동작(라벨 일치) |
| 2 | 서버/클라이언트 경계 번들 분리 검증(관찰 위치: verification) | 검증 패널에서 번들 분리 여부 확인 시도 | 검증 패널 | 아니오 | 번들 분리는 브라우저 devtools 네트워크 탭의 청크 목록에서만 간접 확인 가능하며, 데모 화면 자체에는 그 증거가 없음 |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | `'use client'` 파일 최상단 선언 및 `useState`/`onClick` 동작 | 클릭 시 상태가 즉시 갱신됨 | "장바구니: 0개"→"1개", "찜한 상품: 0개"→"1개"로 클릭 즉시 갱신 확인(agent-browser 스냅샷 대조) | 화면 관찰 | 데모 화면 | 실습 영역 카운터 | 예 | pass |
| 2 | 서버 전용 코드의 클라이언트 번들 격리 | 무거운 백엔드 모듈이 브라우저 번들에서 제외됨 | 데모 화면에서 확인할 방법 없음(코드에 애초에 서버 전용 모듈을 포함시키지도 않음) | 산출물·설정 확인 | — | — | 아니오 | unverifiable |
| 3 | [검증] 패널 반영 | 상호작용 후 "검증 완료"로 전환 | 클릭 전/후 모두 "불일치", 실제값 "인터랙션 대기 중" 고정 | 값 비교 | agent-browser | 본 세션 `get text body` | 예 | fail |

- 검증 불가 사유(#2): 데모가 실제로 번들 분리를 시각화하는 장치(예: 청크 크기 표시, 서버 전용 상수 미포함 증명)를 제공하지 않음
- 필요한 도구·환경: 프로덕션 빌드 후 `next build` 산출물의 청크 분석(webpack-bundle-analyzer 등)
- 허용 가능한 간접 증거: 빌드 매니페스트에서 해당 컴포넌트가 클라이언트 청크에 포함되고 서버 전용 코드가 없음을 확인하는 정도
- 데모 재설계 필요 여부: 아니오(예제 자체는 정상, 검증 항목만 보강 필요)
- 기대 문구 축소 필요 여부: 예(번들 격리 주장은 "관찰 불가" 명시로 축소)

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 아니오 | none | — | 1단계 절차는 실제 UI와 일치, 유지 |
| 데모 예제 | 아니오 | none | — | 실제 `'use client'` + `useState` + 이벤트 핸들러를 정상 사용 |
| 검증 | 예 | medium | V01, V02, V03 | 공통 결함 + 번들 분리 항목은 화면에서 검증 불가능하므로 별도 "산출물·설정 확인" 안내로 대체 |
| 개념 정리 | 예 | low | C01 | 번들 격리를 "검증했다"고 서술하지만 실제로 이 데모는 증명하지 않음 — 범위 명시 필요 |

#### 증거 파일

- 스크린샷: 별도 저장 없음(정상 동작이므로 보관 기준 미해당, [검증] 실패 근거는 텍스트 로그로 충분).
- Network·콘솔·서버 로그: 콘솔 에러 없음.
- 빌드·설정 산출물: 해당 없음(프로덕션 빌드 미실행).

#### 종합 메모

- 최종 유형 검토 사항: 이 데모는 [데모 예제]가 실제로 동작하는 몇 안 되는 B21 사례이며, [검증]만 고치면 되는 "저비용 수정" 우선순위 후보.
- 다른 데모와 공통화할 수 있는 부분: [검증] 패널 공통 결함 수정 시 최우선 반영 대상.
- 개별 구현이 필요한 부분: 없음(검증 패널 배선만 필요).

### directives/use-client/window-storage-access — 'use client' 내부 브라우저 window.localStorage 접근

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | 3-api-reference/3.4-directives/use-client.md |
| 진입점 | apps/demo-baseline/src/app/zone/baseline/directives/use-client/window-storage-access/page.tsx |
| 대표 검증 유형 후보 | 전후 변화 |
| 실행 결과 | mismatch (검증 섹션만 원인, 데모 예제는 정상) |
| 초기화 방법 | [기록 비우기] 버튼 클릭 또는 `localStorage.removeItem('demo_recent_products')` |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | 브라우저 window 스토리지 조회 확인 | 마운트 시 `useEffect`에서 `localStorage.getItem` 실행 확인 | 실습 영역 | 예 | 라벨 일치 |
| 2 | [기록 비우기] 클릭 | 클릭 시 목록이 즉시 빈 배열로 전환, `localStorage.removeItem` 호출 확인(agent-browser `eval`) | 실습 영역 | 예 | 라벨 정확히 일치("기록 비우기") |
| 3 | 수화 불일치 방지 검증(관찰 위치: verification) | 검증 패널 확인 | 검증 패널 | 아니오 | 패널 자체가 배선되지 않음 |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | 상품 클릭 → localStorage 저장 | 클릭한 상품이 `demo_recent_products` 키에 JSON으로 저장됨 | 키보드·트랙볼 클릭 후 `localStorage.getItem('demo_recent_products')`가 두 상품을 최신순으로 포함한 JSON 배열 반환 | 전후 변화 | agent-browser `eval` | 본 세션 실행 로그 | 예 | pass |
| 2 | 새로고침 후 값 유지 | 페이지 재방문 시 저장된 목록이 그대로 렌더링 | `navigate` 재진입 후 "저장된 최근 본 상품 목록" 섹션에 동일 2개 상품 표시 확인 | 전후 변화 | agent-browser | 본 세션 실행 로그 | 예 | pass |
| 3 | [검증] 패널 반영 | 상호작용 후 "검증 완료"로 전환 | 고정 "불일치" | 값 비교 | agent-browser | 본 세션 `get text body` | 예 | fail |

- 검증 불가 사유: 해당 없음
- 필요한 도구·환경: 해당 없음
- 허용 가능한 간접 증거: 없음(직접 증거로 충분)
- 데모 재설계 필요 여부: 아니오
- 기대 문구 축소 필요 여부: 아니오

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 아니오 | none | — | 라벨·절차 모두 실제 UI와 일치 |
| 데모 예제 | 아니오 | none | — | 실제 `localStorage` API를 안전하게(SSR 분기 처리) 사용, 아키텍처 규칙(rule 18) 관점에서 키 접두사가 `demo_{슬러그}_*`가 아닌 `demo_recent_products`인 점만 사소한 개선 여지 |
| 검증 | 예 | medium | V01, V02 | 공통 결함 |
| 개념 정리 | 아니오 | none | — | 서술이 데모 동작 범위를 넘지 않음 |

#### 증거 파일

- 스크린샷: 별도 저장 없음(정상 동작, 텍스트/eval 로그로 충분).
- Network·콘솔·서버 로그: 콘솔 에러 없음, 네트워크 요청 없음(클라이언트 전용 기능이므로 정상).
- 빌드·설정 산출물: 해당 없음.

#### 종합 메모

- 최종 유형 검토 사항: B21에서 가장 깨끗한 "전후 변화"형 골든 샘플 후보(로컬스토리지 전/후 값 대조가 직접적이고 재현 가능).
- 다른 데모와 공통화할 수 있는 부분: [검증] 패널 공통 결함.
- 개별 구현이 필요한 부분: 없음. 키 이름에 데모 슬러그 접두사를 붙이는 정도의 저비용 정리만 권장(현재는 저장소 내 다른 데모와 키 충돌은 없음을 확인함).

### directives/use-server/file-level-action — 파일 레벨 'use server' Server Action 모듈 분리

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | 3-api-reference/3.4-directives/use-server.md |
| 진입점 | apps/demo-baseline/src/app/zone/baseline/directives/use-server/file-level-action/page.tsx |
| 대표 검증 유형 후보 | 값 비교 |
| 실행 결과 | mismatch (검증 섹션만 원인, 데모 예제는 정상) |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | 쿠폰 코드 입력 | "WELCOME2026" 기본값 확인, 입력 필드 정상 | 실습 영역 | 예 | 라벨 일치 |
| 2 | [쿠폰 적용] 클릭 → `actions.ts`의 `applyCoupon()` 호출 | 클릭 시 `applyCouponAction()`(실제 export명) 호출, 결과 반영 | 실습 영역·Network | 예 | 가이드가 언급한 함수명 `applyCoupon()`이 실제 export명 `applyCouponAction`과 다름(경미) |
| 3 | 쿠폰 할인율 적용 및 보안 처리 확인 | 최종 결제 금액이 189,000원→170,100원(10% 할인 18,900원)으로 정확히 갱신 | 실습 영역 | 예 | 계산 정확 |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | 파일 레벨 `'use server'` Server Action 실제 호출 | 클라이언트 폼 제출 시 서버로 POST 요청 발생 | `agent-browser network requests`에서 `POST http://localhost:3001/zone/baseline/directives/use-server/file-level-action (Fetch) 200` 확인 | 외부 도구·환경 확인 | Network | agent-browser network 로그(본 세션) | 예 | pass |
| 2 | 서버 측 할인 계산 정확성 | 10% 쿠폰 적용 시 18,900원 할인 | 화면에 "할인액: 18,900원", "최종 결제 예정 금액: 170,100원" 정확히 표시(189,000 × 0.9 = 170,100 일치) | 값 비교 | 데모 화면 | 실습 영역 | 예 | pass |
| 3 | [검증] 패널 반영 | 상호작용 후 "검증 완료"로 전환 | 고정 "불일치" | 값 비교 | agent-browser | 본 세션 `get text body` | 예 | fail |

- 검증 불가 사유: 해당 없음
- 필요한 도구·환경: 해당 없음
- 허용 가능한 간접 증거: 없음
- 데모 재설계 필요 여부: 아니오
- 기대 문구 축소 필요 여부: 아니오

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | low | G01 | 가이드 본문의 함수명을 실제 export명 `applyCouponAction`으로 정정 |
| 데모 예제 | 아니오 | none | — | 실제 파일 레벨 `'use server'` + Server Action POST가 정상 작동 |
| 검증 | 예 | medium | V01, V02 | 공통 결함(단, 실제로는 POST 200이라는 훌륭한 자동 판정 재료가 이미 있으므로 배선만 하면 즉시 해결 가능) |
| 개념 정리 | 아니오 | none | — | 서술이 실제 동작과 일치 |

#### 증거 파일

- 스크린샷: 별도 저장 없음.
- Network·콘솔·서버 로그: `POST /zone/baseline/directives/use-server/file-level-action → 200`(agent-browser network 로그).
- 빌드·설정 산출물: 해당 없음.

#### 종합 메모

- 최종 유형 검토 사항: B21 중 가장 완성도 높은 "값 비교"형 골든 샘플 후보 — Network POST 200과 화면 계산값이 모두 실제 서버 응답에서 유래.
- 다른 데모와 공통화할 수 있는 부분: [검증] 패널에 `status`(POST 상태 코드)를 실제로 전달하기만 해도 정상 판정 가능한 구조.
- 개별 구현이 필요한 부분: 가이드 함수명 오타 수정.

### directives/use-server/inline-action-closure — 컴포넌트 내부 인라인 'use server' 클로저 액션

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | 3-api-reference/3.4-directives/use-server.md |
| 진입점 | apps/demo-baseline/src/app/zone/baseline/directives/use-server/inline-action-closure/page.tsx |
| 대표 검증 유형 후보 | 외부 도구·환경 확인 |
| 실행 결과 | mismatch |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | 상품 선택 | 클릭 시 선택 상품 카드 하이라이트 | 실습 영역 | 예 | 정상 |
| 2 | [원클릭 즉시 구매] 클릭 | 700ms 대기 후 "즉시 주문 성공" 메시지와 임의 주문번호 표시 | 실습 영역 | 예 | 라벨 일치하나 내부 동작이 가이드 설명과 다름 |
| 3 | 컴포넌트 인라인 'use server' 클로저 액션 실행 관찰 | 실제 서버 요청 발생 여부 확인 | Network | 아니오(요청 자체가 없음) | 가이드가 "Server Action"이라 부르지만 실제로는 클라이언트 `setTimeout` |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | 컴포넌트 내부 인라인 `'use server'` 클로저 선언 여부 | 함수 본문에 `'use server'` 지시어와 클로저 캡처 변수 사용 | `InlineActionClosureDemo.tsx`에 `'use server'` 문자열이 전혀 없고, `handleInstantBuy`는 `'use client'` 컴포넌트 내부의 순수 클라이언트 함수. 소스 주석에 `// Simulate inline server closure action`이라고 스스로 명시함 | 외부 도구·환경 확인 | 소스 코드 | `components/InlineActionClosureDemo.tsx` 10–17행 | 예 | fail |
| 2 | 구매 버튼 클릭 시 서버 요청 발생 여부 | Server Action 호출로 POST 요청 발생 | `agent-browser network requests` 결과 "No requests captured" — 어떤 네트워크 요청도 발생하지 않음 | 외부 도구·환경 확인 | Network | agent-browser network 로그(본 세션) | 예 | fail |

- 검증 불가 사유: 해당 없음(명확한 fail)
- 필요한 도구·환경: 해당 없음
- 허용 가능한 간접 증거: 없음(소스 주석 자체가 시뮬레이션임을 인정)
- 데모 재설계 필요 여부: 예
- 기대 문구 축소 필요 여부: 예

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | high | G01 | "컴포넌트 내부 인라인 'use server' 클로저 액션 실행"이라는 지시가 실제로 실행되지 않는 동작을 지칭 |
| 데모 예제 | 예 | high | D02 | 소스 주석이 스스로 "Simulate"라 밝힌 완전 로컬 상태 모사. 실제 컴포넌트 함수 본문에 `'use server'`를 선언하고 클로저 변수(상품 ID, 가격)를 캡처해 실제 Server Action으로 실행해야 함 |
| 검증 | 예 | high | V01, V02, V04 | 공통 결함 + 서버 요청조차 없는데 "성공" 문구를 표시(V04: 여러 독립 신호를 boolean 없이도 fabricated 문자열로 뭉뚱그림) |
| 개념 정리 | 예 | high | C01, C02 | "클로저로 캡처하여 즉시 구매를 실행합니다" 서술이 실제 미구현 서버 실행을 단정 |

#### 증거 파일

- 스크린샷: 별도 저장 없음.
- Network·콘솔·서버 로그: agent-browser network capture — 요청 0건("No requests captured").
- 빌드·설정 산출물: 해당 없음.

#### 종합 메모

- 최종 유형 검토 사항: B21에서 가장 명확한 반증 사례(소스 주석의 자기 고백 + Network 요청 0건이라는 이중 확증) — 향후 감사 절차의 "완전 시뮬레이션" 판정 기준 예시로 사용 가능.
- 다른 데모와 공통화할 수 있는 부분: [검증] 패널 공통 결함.
- 개별 구현이 필요한 부분: 실제 인라인 `'use server'` Server Action 전면 재작성(207과 대비되는 반면교사 사례로 병기 권장).

### directives/use-cache/function-cache — 'use cache' 지시어를 통한 비동기 함수 결과 캐싱

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | cache |
| 근거 문서 | 3-api-reference/3.4-directives/use-cache.md |
| 진입점 | apps/demo-cache-components/src/app/zone/cache/directives/use-cache/function-cache/page.tsx |
| 대표 검증 유형 후보 | 전후 변화 |
| 실행 결과 | mismatch |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | 캐시 대상 상품 ID 버튼 선택 | PROD-001(HIT)/002/003(MISS) 배지 확인, 클릭 시 지연 시뮬레이션 후 상품 정보 표시 | 실습 영역 | 예 | UI 라벨은 존재하나 실제 서버 캐시 함수 호출 없음 |
| 2 | 캐시 HIT(0ms) 응답 확인 | 동일 ID 재클릭 시 즉시 반환 | 실습 영역 | 예 | `performance.now()` 차이를 계산하는 것은 실제지만, 비교 대상 자체가 `MOCK_PRODUCTS` 로컬 배열 조회이지 서버 `'use cache'` 함수 호출이 아님 |
| 3 | [🔄 revalidateTag('product-detail') 실행] 클릭 | 클릭 시 `cachedIds`를 빈 Set으로 리셋 | 실습 영역·Network | 아니오(Network 요청 없음) | 실제 `revalidateTag()` Server Action 호출이 없어 순수 클라이언트 상태 리셋에 불과 |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | `'use cache'` 지시어가 선언된 비동기 함수 존재 여부 | `getProductDetails()` 등 서버 함수에 `'use cache'` 선언 | `DirectiveUseCacheFunctionDemo.tsx`에 `'use cache'` 문자열 없음. 전체가 `'use client'` 컴포넌트이며 소스 주석에 `// Simulated 'use cache' function invocation`이라 명시 | 외부 도구·환경 확인 | 소스 코드 | `components/DirectiveUseCacheFunctionDemo.tsx` 6–39행 | 예 | fail |
| 2 | 상품 조회/무효화 클릭 시 서버 요청 발생 여부 | 캐시 함수 호출이 서버 왕복을 유발 | 상품 클릭 및 revalidateTag 클릭 모두 `agent-browser network requests` 결과 요청 0건 | 외부 도구·환경 확인 | Network | agent-browser network 로그(본 세션) | 예 | fail |
| 3 | 응답 지연시간(latencyMs) 표시가 실제 캐시 성능을 반영하는지 | MISS는 네트워크/DB 지연, HIT는 캐시 조회 지연을 반영 | `latencyMs`는 `performance.now()` 차이이지만 비교 대상이 `setTimeout(450ms)`이라는 인위적 지연 상수와 로컬 배열 조회일 뿐, 실제 캐시 계층이 없음 | 전후 변화 | 소스 코드 | `components/DirectiveUseCacheFunctionDemo.tsx` 21–38행 | 예 | fail |

- 검증 불가 사유: 해당 없음
- 필요한 도구·환경: 해당 없음
- 허용 가능한 간접 증거: 없음(소스 주석이 스스로 시뮬레이션임을 인정)
- 데모 재설계 필요 여부: 예
- 기대 문구 축소 필요 여부: 예

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | high | G01 | "🔄 revalidateTag('product-detail') 실행" 버튼 라벨이 실제 `revalidateTag()` 호출을 암시하지만 실행되지 않음 |
| 데모 예제 | 예 | high | D02 | `caching/basic`(B01, 이미 검증됨 — 실제 캐시 ID와 `revalidateTag` 사용)과 동일한 zone인데도 이 데모만 완전 로컬 시뮬레이션. 실제 `'use cache'` 서버 함수 + `cacheTag` + `revalidateTag` 조합으로 재작성 필요 |
| 검증 | 예 | high | V01, V02 | 공통 결함 + latencyMs가 실측처럼 보이지만 실제로는 `setTimeout` 상수 기반 |
| 개념 정리 | 예 | high | C01, C02 | "DB 쿼리 부하를 0으로 줄입니다" 등 실제로 이 데모가 증명하지 않는 성능 효과를 단정 |

#### 증거 파일

- 스크린샷: `nextjs-app/docs/planning/evidence-claude/209-use-cache-function-fake.png`
- Network·콘솔·서버 로그: agent-browser network capture — 상품 클릭·태그 무효화 클릭 모두 요청 0건.
- 빌드·설정 산출물: `apps/demo-cache-components/next.config.ts`에는 `cacheComponents: true`만 있고 이 데모가 사용할 캐시 태그 관련 코드는 없음.

#### 종합 메모

- 최종 유형 검토 사항: 이 zone의 대표 PoC 데모(`caching/basic`, B01에서 verified)와 정면으로 대비되는 반례. cache zone 내에서도 실제 기능 사용 여부가 데모마다 크게 갈린다는 것을 보여주는 중요 샘플.
- 다른 데모와 공통화할 수 있는 부분: [검증] 패널 공통 결함.
- 개별 구현이 필요한 부분: 실제 `'use cache'` 함수 전면 재작성 — `caching/basic`의 구현 패턴을 참고 가능.

### directives/use-cache/component-jsx-cache — 'use cache' 컴포넌트 JSX 렌더링 결과 캐싱

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | cache |
| 근거 문서 | 3-api-reference/3.4-directives/use-cache.md |
| 진입점 | apps/demo-cache-components/src/app/zone/cache/directives/use-cache/component-jsx-cache/page.tsx |
| 대표 검증 유형 후보 | 전후 변화 |
| 실행 결과 | mismatch |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | 카테고리 탭 선택 및 컴포넌트 렌더링 | 탭 클릭 시 랭킹 카드 목록 전환 | 실습 영역 | 예 | 실제로는 클라이언트 `Array.sort()`/`filter()`로 로컬 정렬만 수행 |
| 2 | 동일 카테고리 재선택 시 캐시 재사용 확인 | 재선택해도 "JSX 렌더 타임스탬프" 텍스트가 최초 클릭 시각으로 고정 | 실습 영역 | 예 | 실제 서버 컴포넌트 재실행을 건너뛰는 것이 아니라, 애초에 서버 컴포넌트 호출 자체가 없음 |
| 3 | [🔄 컴포넌트 캐시 태그 무효화] 클릭 | 클릭 시 타임스탬프 텍스트를 현재 시각으로 갱신 | 실습 영역 | 예 | `new Date().toLocaleTimeString()`을 클라이언트에서 직접 호출할 뿐, 실제 캐시 태그 무효화 없음 |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | 비동기 서버 컴포넌트에 `'use cache'` 선언 여부 | `<BestSellerRankingHero />` 등 서버 컴포넌트가 `'use cache'`로 캐시됨 | `DirectiveUseCacheComponentDemo.tsx`는 `'use client'` 컴포넌트이며, `<BestSellerRankingHero />`라는 표시 텍스트는 실제 컴포넌트가 아니라 문자열 리터럴("`<`BestSellerRankingHero category="…" `/`>")일 뿐 | 외부 도구·환경 확인 | 소스 코드 | `components/DirectiveUseCacheComponentDemo.tsx` 1–141행 | 예 | fail |
| 2 | 캐시 무효화 클릭 시 서버 요청 발생 여부 | 컴포넌트 캐시 태그 무효화가 서버 왕복을 유발 | `agent-browser network requests` 요청 0건 | 외부 도구·환경 확인 | Network | agent-browser network 로그(본 세션) | 예 | fail |

- 검증 불가 사유: 해당 없음
- 필요한 도구·환경: 해당 없음
- 허용 가능한 간접 증거: 없음
- 데모 재설계 필요 여부: 예
- 기대 문구 축소 필요 여부: 예

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | high | G01 | "JSX 가상 DOM 캐시 재사용 확인" 절차가 실제로 검증 불가능한 UI 텍스트("JSX CACHE HIT" 배지는 상시 고정 표시)에 의존 |
| 데모 예제 | 예 | high | D02 | 실제 비동기 서버 컴포넌트에 `'use cache'`를 선언하고 클라이언트에서 재요청(예: `router.refresh()` 또는 서버 액션)으로 캐시 재사용/무효화를 실증해야 함 |
| 검증 | 예 | high | V01, V02 | 공통 결함 |
| 개념 정리 | 예 | high | C01, C02 | "서버 컴포넌트 실행을 건너뛰고 0ms 만에…" 등 이 데모가 증명하지 않는 성능 주장 |

#### 증거 파일

- 스크린샷: 별도 저장 없음(209와 동일 패턴이므로 대표 스크린샷으로 대체).
- Network·콘솔·서버 로그: agent-browser network capture — 요청 0건.
- 빌드·설정 산출물: 해당 없음.

#### 종합 메모

- 최종 유형 검토 사항: 209와 함께 cache zone 핵심 기능(`'use cache'`)이 오히려 가장 부실하게 구현된 두 사례 — 우선순위 최상위 재작성 대상으로 묶어 처리 권장.
- 다른 데모와 공통화할 수 있는 부분: [검증] 패널 공통 결함.
- 개별 구현이 필요한 부분: 실제 서버 컴포넌트 `'use cache'` 적용.

### directives/use-cache/private-profile-cache — 'use cache: private' 개인화 주문 내역 캐시 격리

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | cache |
| 근거 문서 | 3-api-reference/3.4-directives/use-cache-private.md |
| 진입점 | apps/demo-cache-components/src/app/zone/cache/directives/use-cache/private-profile-cache/page.tsx |
| 대표 검증 유형 후보 | 산출물·설정 확인 |
| 실행 결과 | `mismatch` |
| 초기화 방법 | 새 URL 진입. UI에 쿠키·세션 입력이나 서버 상태 초기화 조작이 없어 브라우저 저장소를 비웠고, 별도 서버 상태는 생성하지 않음 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | 개인 프로필 캐시 스코프 점검 및 개인화 캐시 0ms 즉시 응답 확인 | URL을 열어 코드 블록을 확인 | 실습 영역 | 아니오 | `DirectiveUseCachePrivateDemo`는 `'use cache: private'` 문자열만 렌더링하며 프로필 조회·반복 요청·쿠키 입력이 없음 |
| 2 | 사용자 간 캐시 오염 방지 검증 | 다른 세션 ID 요청을 시도할 조작 요소가 없어 실행하지 못함 | 검증 패널 | 아니오 | 가이드가 요구하는 세션 전환, 새 요청, 격리 결과 표시가 없음 |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | private 캐시 런타임 동작 | runtime API를 읽는 실제 캐시 함수와 개인화 결과 | 진입점의 실습 컴포넌트는 client component이며 코드 문자열과 `db.orders.findMany` 예시만 표시. `cookies()`, `headers()`, `cacheLife()` 호출·서버 함수 없음 | 산출물·설정 확인 | 소스 | `DirectiveUseCachePrivateDemo.tsx` | 예 | fail |
| 2 | 세션 간 캐시 격리 | 다른 세션의 주문·프로필이 노출되지 않음 | 세션 입력·쿠키 설정·서버 요청·사용자별 결과가 없어 비교 불가 | 외부 도구·환경 확인 | 브라우저·Network | 해당 UI와 요청 목록에 증거 없음 | 아니오 | unverifiable |
| 3 | 검증 패널의 실제값 | 실행 후 확인한 캐시 결과와 근거를 표시 | `VerificationFooter`를 props 없이 호출. Expected는 사양 문구, Actual은 고정 `인터랙션 대기 중`; 패널은 자동으로 `불일치` 표시 | 값 비교 | 소스·접근성 스냅샷 | `[검증]` Actual | 예 | fail |

- 검증 불가 사유: 다른 세션을 만들거나 private 캐시 결과를 요청할 기능과 서버 런타임 코드가 없다.
- 필요한 도구·환경: 쿠키·헤더를 가진 두 브라우저 세션, 실제 `use cache: private` 서버 함수와 요청 추적.
- 허용 가능한 간접 증거: 소스의 실제 private 함수와 브라우저 세션별 RSC/Network 결과. 고정 코드 블록은 동작 증거가 아님.
- 데모 재설계 필요 여부: 예. 실제 runtime API를 사용하는 서버 함수와 두 세션 비교 흐름이 필요함.
- 기대 문구 축소 필요 여부: 예. 측정하지 않은 0ms와 캐시 공유 방지 단정을 제거하고 브라우저 메모리 캐시 범위를 명시해야 함.

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | high | G02, G03 | 세션 초기화·전환 방법, 반복 요청과 확인할 쿠키·Network 위치를 단계에 명시하고 0ms 표현을 제거 |
| 데모 예제 | 예 | high | D02, D03 | 문자열 코드 블록을 실제 서버 함수·runtime API·세션별 주문 결과로 교체 |
| 검증 | 예 | high | V01, V02, V03, V05 | 고정 대기 문구 대신 세션 A/B와 캐시 결과를 별도 항목으로 표시하고 증거 위치를 노출 |
| 개념 정리 | 예 | high | C01, C02, C03 | private 캐시는 일반 `use cache`와 달리 runtime API 접근과 브라우저 메모리 캐시를 허용한다는 기준 버전 설명으로 정정 |

#### 증거 파일

- 스크린샷: 별도 저장 없음. 접근성 스냅샷 `.playwright-mcp/page-2026-08-28T13-14-23-581Z.yml`에서 실습이 코드 블록뿐이고 검증 Actual이 대기 문구임을 확인.
- Network·콘솔·서버 로그: 페이지 GET 200, 클릭 가능한 데모 조작 없음, 추가 요청 없음. 콘솔의 데모 오류 없음. cache dev 로그는 Cache Components 기동 정보만 기록.
- 빌드·설정 산출물: `apps/demo-cache-components/next.config.ts`에 `cacheComponents: true`는 있으나 `cacheHandlers`나 private 함수는 없음. Next DevTools `get_errors`와 `get_compilation_issues`는 오류 없음.

#### 종합 메모

- 최종 유형 검토 사항: 실행 산출물보다 실제 소스·런타임 경계를 확인해야 하는 산출물·설정 확인형. 현재는 기능이 존재하지 않아 mismatch.
- 다른 데모와 공통화할 수 있는 부분: cache directive 데모의 세션 초기화, 소스 증거, 브라우저 캐시 결과 필드.
- 개별 구현이 필요한 부분: private 캐시에서 `cookies()` 또는 `headers()`를 읽고 세션별 결과를 비교하는 서버 함수.

### directives/use-cache/remote-redis-cache — 'use cache: remote' 분산 원격 캐시 계층 연동

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | cache |
| 근거 문서 | 3-api-reference/3.4-directives/use-cache-remote.md |
| 진입점 | apps/demo-cache-components/src/app/zone/cache/directives/use-cache/remote-redis-cache/page.tsx |
| 대표 검증 유형 후보 | 전후 변화 |
| 실행 결과 | `mismatch` |
| 초기화 방법 | 새 URL 진입 후 `재고 보충 (+25)` 클릭. 이번 실행은 첫 파드에서 `주문 구매 (재고 -1)`까지 수행하고 다음 데모 진입으로 상태를 초기화함 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | `[재고 보충 (+25)]` 클릭 | 버튼 클릭 후 글로벌 재고 25개 표시 | 실습 영역 | 예 | 라벨은 일치하지만 server/Redis 요청은 발생하지 않음 |
| 2 | `[주문 구매 (재고 -1)]` 버튼 클릭 | Instance-Seoul-1 버튼 클릭, 세 카드가 24개로 변경 | 실습 영역 | 예 | `useState` 하나를 공유한 화면 변화임 |
| 3 | 다중 리전 인스턴스 간 원격 캐시 동기화 확인 | Seoul-1, Seoul-2, Tokyo-1 모두 24개 표시 | 실습 영역·Network | 예 | 원격 동기화가 아니라 동일 client state의 재렌더링이며 Redis 증거 없음 |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | 구매 전후 재고 | 25개에서 24개로 감소 | 재고 보충 후 구매 시 글로벌 잔여 재고와 세 파드 카드가 25개에서 24개로 변경 | 전후 변화 | 접근성 스냅샷·화면 | 재고 카드와 파드 카드 | 예 | pass |
| 2 | 원격 Redis HSET와 인스턴스 공유 | Seoul-1 변경이 원격 Redis에 기록되고 다른 서버 인스턴스가 조회 | 컴포넌트가 `useState(remoteStock)`와 `setRemoteStock`만 사용. 구매·보충 뒤 non-static Network 요청 0건, 서버 로그에 Action·Redis 기록 없음 | 외부 도구·환경 확인 | 소스·Network·서버 로그 | `DirectiveUseCacheRemoteDemo.tsx`, 요청 목록 | 예 | fail |
| 3 | 검증 패널 | 원격 캐시 hit/miss와 동기화 근거 표시 | `VerificationFooter` Actual은 조작 후에도 고정 대기 문구이며 패널 상태는 `불일치` | 전후 변화 | 접근성 스냅샷·소스 | `[검증]` Actual | 예 | fail |

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | high | G03 | Redis 연결·초기화, 파드별 요청, Network/서버 로그의 HSET 확인 조건을 명시 |
| 데모 예제 | 예 | high | D02, D03, D04 | client `useState` 재고 모사를 실제 `'use cache: remote'` 함수와 cache handler 또는 명시적 환경 제한으로 교체 |
| 검증 | 예 | high | V01, V02, V03, V05 | 화면 24개 표시와 원격 저장 증거를 분리하고 Redis 요청·서버 로그를 실제값으로 표시 |
| 개념 정리 | 예 | high | C01, C02, C03 | HSET·다중 인스턴스 공유·콜드스타트 제거를 실행 증거 범위 안에서만 설명하고 연결된 handler와 배포 조건을 명시 |

#### 증거 파일

- 스크린샷: 별도 저장 없음. Playwright 접근성 스냅샷에서 `재고 보충 (+25)`, 세 개의 `주문 구매 (재고 -1)`, 24개 화면을 확인.
- Network·콘솔·서버 로그: 페이지 GET 200. 보충·구매 후 non-static Network 요청 없음; 콘솔·page error 없음. cache dev 로그에 Redis 또는 구매 요청 없음.
- 빌드·설정 산출물: `next.config.ts`는 `cacheComponents: true`와 assetPrefix만 포함하고 `cacheHandlers`가 없음. 컴포넌트의 소스는 `useState`와 `useTransition`뿐임.

#### 종합 메모

- 최종 유형 검토 사항: 재고 숫자 전후 변화는 pass지만 원격 계층 동작은 fail인 전후 변화형.
- 다른 데모와 공통화할 수 있는 부분: 조작 전후 값과 독립 Network·서버 증거를 별도 행으로 기록하는 검증 계약.
- 개별 구현이 필요한 부분: 실제 Redis handler와 다중 인스턴스 조회 또는 재현 불가능 시 기대 범위 축소.

### config/base-path/subpath-routing — basePath: '/shop' 설정에 따른 전체 서브패스 라우팅

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | 3-api-reference/3.5-config/3.5.1-next-config-js/basePath.md |
| 진입점 | apps/demo-baseline/src/app/zone/baseline/config/base-path/subpath-routing/page.tsx |
| 대표 검증 유형 후보 | 산출물·설정 확인 |
| 실행 결과 | `mismatch` |
| 초기화 방법 | 새 URL 진입. 상태 조작과 저장소 사용 없음 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | `next.config.ts`의 `basePath: '/shop'`와 자동 프리픽싱 Link 확인 | 페이지와 설정 소스를 확인 | 소스·실습 영역 | 아니오 | 화면에 Link가 없고 config에도 basePath가 없음 |
| 2 | 서브패스 정적 에셋·라우팅 관찰 | Network와 URL을 확인 | Network·브라우저 URL | 아니오 | 실제 자산은 `/demo-static/baseline/_next/...`, `/shop` 경로는 사용되지 않음 |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | `basePath` 설정 | config에 `/shop` 선언 | `apps/demo-baseline/next.config.ts`에 `assetPrefix`, images, serverActions만 있고 `basePath` 없음. `.next/routes-manifest.json`의 `basePath`는 빈 문자열 | 산출물·설정 확인 | 소스·빌드 산출물 | `next.config.ts`, `routes-manifest.json` | 예 | fail |
| 2 | `/shop` 라우팅과 Link | Link 클릭이 `/shop/products`로 이동 | 실습 component는 정적 `<div>`이고 Link 없음. 현재 데모 URL은 `/zone/baseline/...`; `/shop/shoes/101` 요청은 404 | 값 비교 | 소스·URL·Network | 브라우저 URL과 curl 응답 | 예 | fail |
| 3 | 정적 자산 prefix | `_next` 자산 요청에 `/shop` prefix | Playwright Network는 `/demo-static/baseline/_next/static/...`를 요청하고 `/shop/_next` 요청 없음 | 값 비교 | Network | 자산 요청 목록 | 예 | fail |
| 4 | 검증 패널 | 실제 경로·에셋 요청을 표시 | 패널 Actual은 고정 `인터랙션 대기 중`, 상태 `불일치` | 값 비교 | 접근성 스냅샷·소스 | `[검증]` Actual | 예 | fail |

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | high | G01, G02, G03 | 실제 Link/라우트가 있는 단계로 바꾸고 config·URL·Network 확인 위치와 초기화 조건을 명시 |
| 데모 예제 | 예 | high | D03 | 실제 `basePath`를 가진 독립 설정 또는 현재 zone에서 확인 가능한 설정 검증으로 재설계 |
| 검증 | 예 | high | V01, V02, V03, V05 | `/shop` URL, manifest, 자산 요청을 별도 실제값으로 표시하고 고정 대기값 제거 |
| 개념 정리 | 예 | high | C01, C02, C03 | 현재 config가 basePath를 활성화하지 않았음을 반영하고 측정하지 않은 SEO 권위도 단정을 제거 |

#### 증거 파일

- 스크린샷: 별도 저장 없음. 접근성 스냅샷에서 실습은 `next.config.ts: basePath = '/shop'`와 두 줄의 정적 텍스트뿐임을 확인.
- Network·콘솔·서버 로그: 페이지 GET 200. `/shop/shoes/101` GET 404. 일반 데모 페이지 응답에는 CSP/HSTS 등도 없으며 콘솔의 데모 오류 없음.
- 빌드·설정 산출물: `.next/routes-manifest.json`은 `basePath: ""`; `redirects`에는 trailing slash 제거 내부 규칙만 있고 config에 basePath 없음.

#### 종합 메모

- 최종 유형 검토 사항: 설정과 manifest, URL·자산을 비교하는 산출물·설정 확인형. 현재 표시는 기대 설정을 재진술할 뿐 실제 설정과 반대.
- 다른 데모와 공통화할 수 있는 부분: config 데모의 설정 파일·routes manifest·Network 자산 URL 대조.
- 개별 구현이 필요한 부분: 실제 `/shop` basePath를 적용한 별도 zone 또는 production 설정 증거.

### config/asset-prefix/cdn-distribution — assetPrefix: 'https://cdn.shop.com' CDN 자산 배포

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | 3-api-reference/3.5-config/3.5.1-next-config-js/assetPrefix.md |
| 진입점 | apps/demo-baseline/src/app/zone/baseline/config/asset-prefix/cdn-distribution/page.tsx |
| 대표 검증 유형 후보 | 외부 도구·환경 확인 |
| 실행 결과 | `mismatch` |
| 초기화 방법 | 새 URL 진입 후 러닝화 선택, `+`, `동작 실행`을 수행. 다음 데모 진입으로 client state 초기화 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | 러닝화 또는 윈드브레이커 선택 | `러닝화 (#001)` 클릭 | 실습 영역 | 예 | 라벨은 일치하나 선택은 local state 변경 |
| 2 | `+` 수량 조절 후 `동작 실행` | 두 버튼 클릭 | 실습 영역 | 예 | 실시간 도메인 로그가 추가되지만 asset 요청은 없음 |
| 3 | CDN URL prefix와 도메인 로그 관찰 | Network를 확인 | Network·검증 | 아니오 | `/demo-static/baseline/_next/...`만 있고 `cdn.shop.com` 없음; 검증 패널은 대기값 |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | assetPrefix 설정 | `https://cdn.shop.com` 선언 | `next.config.ts`의 실제 값은 `assetPrefix: '/demo-static/baseline'` | 산출물·설정 확인 | 소스 | `next.config.ts` | 예 | fail |
| 2 | 정적 자산 요청 | JS/CSS 요청 host가 CDN | Playwright Network 18개 자산 요청이 모두 `http://localhost:3001/demo-static/baseline/_next/...`이며 외부 CDN 요청 없음 | 값 비교 | Network | 자산 요청 목록 | 예 | fail |
| 3 | 가이드 조작과 증거 연결 | 동작 실행 후 CDN 요청 또는 로그 | 클릭 후 추가 HTTP 요청 없이 local `실시간 도메인 로그`만 `상품 선택`, `수량 증가`, `API 트리거`로 변경 | 전후 변화 | 화면·Network | 로그와 요청 목록 | 예 | fail |
| 4 | 검증 패널 | CDN host와 확인 위치 표시 | props 없는 `VerificationFooter`가 Actual 대기 문구와 `불일치` 배지를 표시 | 외부 도구·환경 확인 | 접근성 스냅샷·소스 | `[검증]` Actual | 예 | fail |

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | high | G02, G03 | CDN이 실행되는 환경과 Network 필터, 자산 요청 관찰 위치를 명시하고 local 로그를 CDN 증거로 표현하지 않기 |
| 데모 예제 | 예 | high | D02, D03 | 상품·수량 local mock을 제거하고 실제 assetPrefix 설정과 자산 로딩 경계를 제공 |
| 검증 | 예 | high | V01, V02, V03, V05 | 요청 URL, 응답 status, CDN host를 실제 Network 값으로 표시하고 고정 대기값 제거 |
| 개념 정리 | 예 | high | C01, C02, C03 | `cdn.example.com`과 `cdn.shop.com` 불일치를 통일하고 90% 절감 같은 미측정 수치를 삭제 |

#### 증거 파일

- 스크린샷: 별도 저장 없음. Playwright 접근성 스냅샷에서 상품·수량 버튼과 local 로그를 확인.
- Network·콘솔·서버 로그: 페이지 GET 200 및 클릭 후 추가 non-static 요청 없음. Network 자산은 `/demo-static/baseline/_next/...`로 200/304. 콘솔의 데모 오류 없음.
- 빌드·설정 산출물: `apps/demo-baseline/next.config.ts:4`가 CDN이 아닌 `/demo-static/baseline`을 사용. `assetPrefix` 설명과 실제 설정이 불일치.

#### 종합 메모

- 최종 유형 검토 사항: CDN 자산은 Network와 설정을 함께 확인해야 하는 외부 도구·환경 확인형. 현재 zone assetPrefix는 CDN이 아니라 셸 통합용 경로.
- 다른 데모와 공통화할 수 있는 부분: asset URL host/prefix와 응답 status를 실제값으로 수집하는 Network 검증 행.
- 개별 구현이 필요한 부분: 외부 CDN 또는 테스트 origin을 제공하는 production 환경과 CORS 조건.

### config/redirects/regex-pattern-matching — redirects() 정규식 패턴 및 와일드카드 리다이렉트

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | 3-api-reference/3.5-config/3.5.1-next-config-js/redirects.md |
| 진입점 | apps/demo-baseline/src/app/zone/baseline/config/redirects/regex-pattern-matching/page.tsx |
| 대표 검증 유형 후보 | 값 비교 |
| 실행 결과 | `mismatch` |
| 초기화 방법 | 새 URL 진입 후 러닝화 선택, `+`, `동작 실행`. local state는 다음 데모 진입으로 초기화 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | 러닝화 또는 윈드브레이커 선택 | `러닝화 (#001)` 클릭 | 실습 영역 | 예 | 선택 결과는 client state |
| 2 | `+` 수량 조절 후 `동작 실행` | 두 버튼 클릭 | 실습 영역 | 예 | redirects 요청은 발생하지 않고 local 로그만 변경 |
| 3 | 정규식 파라미터 치환과 308 관찰 | `/old-catalog/2024/101`을 직접 요청하고 Network 확인 | URL·Network | 아니오 | 응답 404, `Location` 없음. 관찰용 로그도 없음 |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | 정규식 redirects 규칙 | `/:year(\\d{4})/:id` 매칭 규칙 존재 | `next.config.ts`에 `redirects()`가 없고 routes manifest에는 기본 trailing slash 제거 규칙만 있음 | 산출물·설정 확인 | 소스·빌드 산출물 | `next.config.ts`, `routes-manifest.json` | 예 | fail |
| 2 | HTTP 308과 destination | `/old-catalog/2024/101`이 신규 URL로 308 이동 | curl GET 결과 `404 Not Found`, `Location` 헤더 없음 | 값 비교 | Network/HTTP | 응답 status·headers | 예 | fail |
| 3 | 상품 조작의 기능 연결 | 조작이 규칙 매칭 요청을 발생 | 클릭 후 `실시간 도메인 로그`의 local `API 트리거`만 추가되고 redirect 요청 없음 | 외부 도구·환경 확인 | 화면·Network | 실습 로그와 요청 목록 | 예 | fail |
| 4 | 검증 패널 | status/location을 실제 표시 | Actual 고정 대기 문구와 `불일치` 배지 | 값 비교 | 접근성 스냅샷·소스 | `[검증]` Actual | 예 | fail |

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | high | G02, G03 | 실제 source/destination 예시와 HTTP status·Location을 확인하는 외부 도구 절차를 추가 |
| 데모 예제 | 예 | high | D02, D03 | local 상품 조작 대신 실제 redirects 규칙으로 요청을 보내고 캡처 그룹 치환 결과를 노출 |
| 검증 | 예 | high | V01, V02, V03, V05 | status, Location, 원본 URL, 대상 URL을 독립 행으로 비교 |
| 개념 정리 | 예 | high | C01, C02, C03 | 현재 규칙 부재를 반영하고 308로 SEO 점수를 보존한다는 미측정 효과를 조건부 설명으로 축소 |

#### 증거 파일

- 스크린샷: 별도 저장 없음. 접근성 스냅샷에서 상품 버튼과 local 로그만 확인.
- Network·콘솔·서버 로그: 데모 GET 200, 가이드 조작 후 redirects 요청 없음. `/old-catalog/2024/101` GET 404, 콘솔의 데모 오류 없음.
- 빌드·설정 산출물: routes manifest의 custom redirects는 없고 내부 trailing slash 제거만 존재. `next.config.ts`에 redirects 키 없음.

#### 종합 메모

- 최종 유형 검토 사항: HTTP status와 Location을 직접 비교하는 값 비교형. 현재 404는 기대 308과 명확히 불일치.
- 다른 데모와 공통화할 수 있는 부분: config 규칙·manifest·HTTP 응답을 한 검증 항목으로 연결하는 패턴.
- 개별 구현이 필요한 부분: 정규식과 wildcard source/destination을 실제 next.config에 선언하는 route fixture.

### config/redirects/header-query-condition — redirects() 요청 헤더 및 쿼리 기반 조건부 리다이렉트

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | 3-api-reference/3.5-config/3.5.1-next-config-js/redirects.md |
| 진입점 | apps/demo-baseline/src/app/zone/baseline/config/redirects/header-query-condition/page.tsx |
| 대표 검증 유형 후보 | 값 비교 |
| 실행 결과 | `mismatch` |
| 초기화 방법 | 새 URL 진입. 실습은 정적 조건 예시만 표시하며 저장소 상태 없음 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | `has/missing` 조건과 `x-beta-tester` 요청 점검 | 페이지에 표시된 정적 `has` 문자열과 config 소스 확인 | 실습·소스 | 아니오 | config의 redirects 규칙이 없고 요청 헤더를 입력할 UI가 없음 |
| 2 | 조건부 307 분기 관찰 | `x-beta-tester: true` 헤더로 페이지를 요청 | URL·Network | 아니오 | 현재 데모 URL 응답은 200이며 `Location` 없음 |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | header/query redirects 규칙 | `x-beta-tester: true` 또는 쿼리 일치 시 307 | `next.config.ts`에 redirects/has/missing가 없고 실습은 문자열만 렌더링 | 산출물·설정 확인 | 소스 | `next.config.ts`, `ConfigRedirectsHeaderDemo.tsx` | 예 | fail |
| 2 | 조건부 HTTP 응답 | 조건 헤더 요청이 `/beta-checkout`으로 307 | `curl -H 'x-beta-tester: true'` 결과 현재 데모 URL 200, `Location` 헤더 없음 | 값 비교 | HTTP/Network | 응답 headers | 예 | fail |
| 3 | 검증 패널 | 조건, status, destination을 표시 | props 없는 Footer가 Actual 대기 문구와 `불일치` 표시 | 값 비교 | 접근성 스냅샷·소스 | `[검증]` Actual | 예 | fail |

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | high | G02, G03 | 실제 요청 헤더·쿼리 입력, 일반 요청과 조건 일치 요청의 status·Location 비교 절차를 명시 |
| 데모 예제 | 예 | high | D03 | 정적 `has` 코드 표시 대신 실제 redirects fixture와 조건 요청 결과를 제공 |
| 검증 | 예 | high | V01, V02, V03, V05 | 일반/조건부 요청을 별도 값 비교 행으로 두고 응답 헤더·증거 위치 표시 |
| 개념 정리 | 예 | high | C02, C03 | 가이드의 `x-beta-tester`와 DeepDive의 `x-legacy-client`·`?view=old` 규칙을 통일하고 현재 환경을 명시 |

#### 증거 파일

- 스크린샷: 별도 저장 없음. 정적 `has` 예시와 검증 패널을 접근성 스냅샷으로 확인.
- Network·콘솔·서버 로그: 페이지 GET 200. `x-beta-tester: true` 조건 요청도 200/Location 없음. 클릭 가능한 조작과 추가 요청 없음. 콘솔의 데모 오류 없음.
- 빌드·설정 산출물: baseline `routes-manifest.json`의 custom redirects 없음, `next.config.ts`에 headers/redirects 없음.

#### 종합 메모

- 최종 유형 검토 사항: 헤더·쿼리 조건과 HTTP status/location을 비교하는 값 비교형. 현재 fixture가 없으므로 307을 증명할 수 없음.
- 다른 데모와 공통화할 수 있는 부분: 조건별 요청을 Network 증거와 함께 나란히 보여주는 검증 표.
- 개별 구현이 필요한 부분: `has`와 `missing`을 포함한 실제 redirects 규칙 및 테스트 요청 harness.

### config/rewrites/cross-zone-proxy — rewrites() Zone 간 라우팅 및 외부 API 프록시

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | 3-api-reference/3.5-config/3.5.1-next-config-js/rewrites.md |
| 진입점 | apps/demo-baseline/src/app/zone/baseline/config/rewrites/cross-zone-proxy/page.tsx |
| 대표 검증 유형 후보 | 외부 도구·환경 확인 |
| 실행 결과 | `mismatch` |
| 초기화 방법 | 새 URL 진입 후 러닝화, `+`, `동작 실행`. 다음 URL 진입으로 local state 초기화 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | 러닝화 또는 윈드브레이커 선택 | `러닝화 (#001)` 클릭 | 실습 영역 | 예 | 상품 선택은 local state |
| 2 | `+` 후 `동작 실행`으로 프록시 호출 | 버튼 클릭 | 실습·Network | 예 | local 로그만 추가되고 proxy 요청 없음 |
| 3 | 주소 변경 없는 외부 응답 관찰 | `/legacy-api/products` 직접 요청과 Network 확인 | URL·Network | 아니오 | route 404, 외부 target/zone endpoint와 `ZONE_*_URL` 연결이 없음 |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | proxy 실행 | 클릭이 외부 backend로 전달되고 응답 수신 | `ConfigRewritesProxyDemo`는 `useState`와 local log만 사용. 클릭 후 non-static Network 요청 0건 | 외부 도구·환경 확인 | 소스·Network | 실습 component, 요청 목록 | 예 | fail |
| 2 | 내부 URL 유지와 외부 응답 | `/legacy-api/:path*`가 외부 zone/API로 rewrite | baseline `next.config.ts`와 routes manifest에 해당 rewrite 없음. `/legacy-api/products` GET 404 | 값 비교 | HTTP·빌드 산출물 | 응답 status와 manifest | 예 | fail |
| 3 | 외부 zone target | `checkout-zone.internal` 또는 외부 API가 실제 응답 | 외부 target 서버·환경변수·배포 환경이 없어 실행 불가 | 외부 도구·환경 확인 | 환경 | 외부 target | 아니오 | blocked-by-environment |
| 4 | 검증 패널 | proxy 응답·destination·증거 위치 표시 | Actual 고정 대기 문구, 상태 `불일치` | 외부 도구·환경 확인 | 접근성 스냅샷·소스 | `[검증]` Actual | 예 | fail |

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | high | G02, G03 | 외부 target, `ZONE_*_URL`, 요청·응답·주소창 관찰 방법과 환경 제약을 명시 |
| 데모 예제 | 예 | high | D02, D03, D04 | local 장바구니 로그를 제거하고 실제 cross-zone rewrite 또는 명시적인 blocked fixture로 바꿈 |
| 검증 | 예 | high | V01, V02, V03, V05 | client log와 proxy Network를 분리하고 target 응답이 없으면 blocked-by-environment로 표시 |
| 개념 정리 | 예 | high | C02, C03 | 가이드의 `/legacy-api`와 DeepDive의 `shop.com/checkout`·`checkout-zone.internal` 범위를 통일하고 외부 target 조건을 명시 |

#### 증거 파일

- 스크린샷: 별도 저장 없음. 접근성 스냅샷에서 상품·수량·동작 버튼과 local 로그를 확인.
- Network·콘솔·서버 로그: 데모 GET 200, 조작 후 추가 non-static 요청 없음. `/legacy-api/products` GET 404. 콘솔의 데모 오류 없음.
- 빌드·설정 산출물: baseline config에는 `rewrites()`와 `ZONE_*_URL`이 없으며 routes manifest fallback도 비어 있음. 외부 target은 환경 부재로 blocked.

#### 종합 메모

- 최종 유형 검토 사항: cross-zone은 외부 도구·환경 확인형이며 현재 환경에서 local state만 변하고 proxy 경계는 존재하지 않음.
- 다른 데모와 공통화할 수 있는 부분: proxy 요청 status, 주소창 pathname 유지, 외부 target 응답을 독립 증거로 기록.
- 개별 구현이 필요한 부분: 실제 zone target 또는 테스트 backend와 환경변수 격리.

### config/rewrites/query-param-rewrite — rewrites() 쿼리 파라미터 매핑 라우팅

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | 3-api-reference/3.5-config/3.5.1-next-config-js/rewrites.md |
| 진입점 | apps/demo-baseline/src/app/zone/baseline/config/rewrites/query-param-rewrite/page.tsx |
| 대표 검증 유형 후보 | 값 비교 |
| 실행 결과 | `mismatch` |
| 초기화 방법 | 새 URL 진입 후 러닝화, `+`, `동작 실행`; local state는 다음 URL에서 초기화 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | 상품 선택 | `러닝화 (#001)` 클릭 | 실습 영역 | 예 | 선택은 `useState` |
| 2 | `+` 후 `동작 실행` | 두 버튼 클릭 | 실습 영역·Network | 예 | local 로그만 변경 |
| 3 | REST 경로와 내부 query 매핑 관찰 | `/shop/shoes/101` 요청과 URL/Network 확인 | URL·Network | 아니오 | 요청 404, rewrite source/destination 없음 |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | path-to-query rewrite 규칙 | `/shop/shoes/101`이 `/catalog?category=shoes&id=101`로 매핑 | config에 rewrites가 없고 `/shop/shoes/101` GET 404 | 산출물·설정 확인 | 소스·HTTP | `next.config.ts`, 응답 status | 예 | fail |
| 2 | 브라우저 URL 유지 | 외부 URL은 REST path로 유지되고 서버 내부 query 해석 | 요청 자체가 404이며 내부 query 응답 증거 없음 | 값 비교 | HTTP·Network | 요청 URL과 응답 | 예 | fail |
| 3 | 조작 후 mapping 증거 | 실행이 rewrite 요청과 query 결과를 표시 | 버튼 후 `Next.js API 트리거` local log만 추가, 추가 요청 없음 | 전후 변화 | 화면·Network | 실습 로그와 요청 목록 | 예 | fail |
| 4 | 검증 패널 | path/query 실제값 표시 | 고정 대기 Actual과 `불일치` 배지 | 값 비교 | 접근성 스냅샷·소스 | `[검증]` Actual | 예 | fail |

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | high | G02, G03 | source/destination, 주소창 유지, 내부 query 확인 위치와 요청 URL을 구체화 |
| 데모 예제 | 예 | high | D02, D03 | local state 로그를 실제 rewrites route와 query 값을 읽는 서버 페이지로 교체 |
| 검증 | 예 | high | V01, V02, V03, V05 | 외부 path, 내부 query, response status를 독립 항목으로 표시 |
| 개념 정리 | 예 | high | C02, C03 | 가이드의 `/shop/shoes/101`과 DeepDive의 `/brand/:slug` 사례를 통일하고 config 범위를 명시 |

#### 증거 파일

- 스크린샷: 별도 저장 없음. 상품 버튼·local 로그·검증 대기값을 접근성 스냅샷으로 확인.
- Network·콘솔·서버 로그: 데모 GET 200, 조작 후 rewrite 요청 없음. `/shop/shoes/101` GET 404. 콘솔의 데모 오류 없음.
- 빌드·설정 산출물: `next.config.ts`에 rewrites 없음; routes manifest에 해당 source/destination 없음.

#### 종합 메모

- 최종 유형 검토 사항: 외부 URL과 내부 query를 값으로 비교하는 값 비교형. 현재는 rewrite가 없어 fail.
- 다른 데모와 공통화할 수 있는 부분: URL·내부 해석 결과·HTTP status를 하나의 증거 묶음으로 기록.
- 개별 구현이 필요한 부분: 실제 query mapping route와 서버에서 받은 query를 표시할 페이지.

### config/headers/global-security-headers — headers() 전역 보안 응답 헤더 일괄 주입 (CSP, HSTS)

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | 3-api-reference/3.5-config/3.5.1-next-config-js/headers.md |
| 진입점 | apps/demo-baseline/src/app/zone/baseline/config/headers/global-security-headers/page.tsx |
| 대표 검증 유형 후보 | 값 비교 |
| 실행 결과 | `mismatch` |
| 초기화 방법 | 새 URL 진입 후 러닝화, `+`, `동작 실행`; local state는 다음 URL 진입으로 초기화 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | 상품 선택 | `러닝화 (#001)` 클릭 | 실습 영역 | 예 | local state만 변경 |
| 2 | `+` 후 `동작 실행` | 두 버튼 클릭 | 실습 영역·Network | 예 | local 도메인 로그만 변경 |
| 3 | CSP/HSTS/XFO 로그 관찰 | Network 응답 헤더 확인 | Network·검증 패널 | 아니오 | 응답에는 해당 보안 헤더가 없고 검증 패널은 고정 대기값 |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | 보안 응답 헤더 | CSP, HSTS, X-Frame-Options가 응답에 존재 | `curl` 응답은 200이지만 `Content-Security-Policy`, `Strict-Transport-Security`, `X-Frame-Options`, `X-Content-Type-Options`가 없음 | 값 비교 | HTTP/Network | response headers | 예 | fail |
| 2 | 전역 headers 설정 | `source: '/:path*'`와 header 배열이 config에 존재 | `next.config.ts`에 `headers()` 없음; routes manifest `headers`는 빈 배열 | 산출물·설정 확인 | 소스·빌드 산출물 | config·manifest | 예 | fail |
| 3 | 조작 후 헤더 증거 | 호출이 보안 헤더 응답을 표시 | 클릭 후 local `실시간 도메인 로그`만 추가되고 HTTP 호출 없음 | 외부 도구·환경 확인 | 화면·Network | 실습 로그·요청 목록 | 예 | fail |
| 4 | 검증 패널 | 응답 헤더 key/value와 증거 위치 표시 | Actual 고정 대기 문구, 상태 `불일치` | 값 비교 | 접근성 스냅샷·소스 | `[검증]` Actual | 예 | fail |

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | high | G02, G03 | Network response headers에서 확인할 key와 기준 응답·초기화 조건을 명시 |
| 데모 예제 | 예 | high | D02, D03 | local 상품 로그를 제거하고 실제 headers config와 응답을 확인할 route를 제공 |
| 검증 | 예 | high | V01, V02, V03, V05 | 헤더별 존재·값을 직접 비교하고 없는 헤더도 fail로 표시 |
| 개념 정리 | 예 | high | C01, C02, C03 | config 부재를 반영하고 XSS/컴플라이언스 효과를 보장 문구가 아닌 정책 범위로 축소 |

#### 증거 파일

- 스크린샷: 별도 저장 없음. 접근성 스냅샷 `.playwright-mcp/page-2026-08-28T13-19-44-082Z.yml`에서 조작 후에도 검증 Actual이 대기 문구임을 확인.
- Network·콘솔·서버 로그: 페이지 GET 200. Network non-static 요청 없음; 응답 headers에 보안 헤더 없음. 콘솔의 데모 오류 없음.
- 빌드·설정 산출물: routes manifest `headers: []`; baseline `next.config.ts`는 assetPrefix/images/serverActions만 설정.

#### 종합 메모

- 최종 유형 검토 사항: 응답 헤더와 config를 직접 비교하는 값 비교형. 현재는 `X-Powered-By: Next.js`만 보이며 기대 보안 헤더는 없음.
- 다른 데모와 공통화할 수 있는 부분: header key별 expected/actual과 source·response evidence 위치를 함께 표시.
- 개별 구현이 필요한 부분: 실제 headers fixture, CSP 정책과 HTTPS 배포 여부를 분리한 검증.

### config/trailing-slash/url-normalization — trailingSlash: true URL 끝 슬래시 정규화

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | 3-api-reference/3.5-config/3.5.1-next-config-js/trailingSlash.md |
| 진입점 | apps/demo-baseline/src/app/zone/baseline/config/trailing-slash/url-normalization/page.tsx |
| 대표 검증 유형 후보 | 값 비교 |
| 실행 결과 | `mismatch` |
| 초기화 방법 | 새 URL 진입 후 러닝화, `+`, `동작 실행`; local state는 다음 URL 진입으로 초기화 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | 상품 선택 | `러닝화 (#001)` 클릭 | 실습 영역 | 예 | 실제 URL 이동 없음 |
| 2 | `+` 후 `동작 실행` | 두 버튼 클릭 | 실습 영역·Network | 예 | local 로그만 변경 |
| 3 | 끝 슬래시 자동 부착과 308 관찰 | 동일 route의 slash/no-slash를 HTTP로 비교 | URL·Network | 아니오 | 현재 config는 trailingSlash 미설정이며 기본 동작은 slash를 제거하는 308 |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | `trailingSlash` 설정 | config 값 `true` | config에 key 없음; routes manifest의 `trailingSlash`는 null | 산출물·설정 확인 | 소스·빌드 산출물 | config·manifest | 예 | fail |
| 2 | no-slash 요청 | `/.../`로 308 redirect | `/zone/baseline/config/base-path/subpath-routing/` 요청은 308 `Location: /zone/...`로 slash 제거. no-slash는 200 | 값 비교 | HTTP/Network | response status·Location | 예 | fail |
| 3 | 가이드 조작 연결 | 동작 실행이 URL 정규화 결과를 표시 | local `API 트리거` 로그만 추가, URL·Network 변화 없음 | 전후 변화 | 화면·Network | 실습 로그와 URL | 예 | fail |
| 4 | 검증 패널 | slash 정책과 실제 URL/status 표시 | Actual 고정 대기 문구, `불일치` | 값 비교 | 접근성 스냅샷·소스 | `[검증]` Actual | 예 | fail |

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | high | G02, G03 | slash/no-slash의 정확한 URL과 응답 status·Location 확인 절차를 추가 |
| 데모 예제 | 예 | high | D02, D03 | local 상품 조작을 제거하고 실제 trailingSlash 설정과 route 요청을 연결 |
| 검증 | 예 | high | V01, V02, V03, V05 | 설정값, 두 URL, redirect 방향을 별도 값 비교로 표시 |
| 개념 정리 | 예 | high | C01, C02, C03 | 현재 기본 정책이 slash 제거임을 반영하고 SEO 효과·정적 export 효과를 조건부로 설명 |

#### 증거 파일

- 스크린샷: 별도 저장 없음. 접근성 스냅샷에서 local 상품 콘솔과 고정 검증 패널을 확인.
- Network·콘솔·서버 로그: no-slash 페이지 GET 200, slash URL GET 308 with `Location` to no-slash. 조작 후 추가 요청 없음. 콘솔의 데모 오류 없음.
- 빌드·설정 산출물: `.next/routes-manifest.json` `trailingSlash: null`; 내부 기본 redirect는 `/:path+/` → `/:path+`.

#### 종합 메모

- 최종 유형 검토 사항: URL·status·Location을 직접 비교하는 값 비교형. 실제 redirect 방향이 가이드 기대와 반대.
- 다른 데모와 공통화할 수 있는 부분: config 값, manifest, slash/no-slash response를 하나의 증거 묶음으로 기록.
- 개별 구현이 필요한 부분: 실제 `trailingSlash: true` production/dev fixture와 cache 영향 분리.

### config/images/remote-patterns-security — images.remotePatterns 외부 이미지 도메인 허용 및 보안

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | 3-api-reference/3.5-config/3.5.1-next-config-js/images.md |
| 진입점 | apps/demo-baseline/src/app/zone/baseline/config/images/remote-patterns-security/page.tsx |
| 대표 검증 유형 후보 | 산출물·설정 확인 |
| 실행 결과 | mismatch |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | 상품 선택 | 버튼 클릭 | 실습 영역 | 예 | 이커머스 공용 템플릿(201/204/209와 동일 구조) |
| 2 | remotePatterns 화이트리스트 검증 이미지 요청 실행 | [동작 실행] 클릭 시 로그 텍스트만 추가 | 실습 영역 | 예 | 실제 `next/image` 호출이나 이미지 로딩 자체가 없음 |
| 3 | 도메인 보안 화이트리스트 검증 로그 관찰 | 검증 패널 확인 | 검증 패널 | 아니오 | 관련 로그 없음 |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | `next.config.ts`의 `images.remotePatterns` 설정 존재 여부 | 신뢰 CDN 호스트가 화이트리스트로 선언됨 | `apps/demo-baseline/next.config.ts`의 `images`는 `{ unoptimized: true }`뿐이며 `remotePatterns` 없음 | 산출물·설정 확인 | 소스 코드 | `apps/demo-baseline/next.config.ts` | 예 | fail |
| 2 | `next/image` 또는 외부 이미지 요청 사용 여부 | 데모가 실제 이미지 최적화 파이프라인을 통과 | curl로 받은 페이지 HTML에 `<img>` 태그 자체가 없음(제품 카드가 이미지 없이 텍스트/버튼으로만 구성) | 산출물·설정 확인 | curl HTML | 본 세션 curl 결과 | 예 | fail |

- 검증 불가 사유: 해당 없음
- 필요한 도구·환경: 해당 없음
- 허용 가능한 간접 증거: 없음
- 데모 재설계 필요 여부: 예
- 기대 문구 축소 필요 여부: 예

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | high | G01 | 실제 이미지 로딩이 없는데 "이미지 요청"을 지시 |
| 데모 예제 | 예 | high | D02 | `next/image`로 실제 외부 CDN 이미지를 렌더링하고 `next.config.ts`에 `remotePatterns`를 선언해 허용/차단 사례를 대비시켜야 함(AGENTS.md 9번 규칙상 `unoptimized: true`인 이 zone에서는 데모 취지상 모순 — cache zone이나 별도 설정 필요성 검토 권고) |
| 검증 | 예 | high | V01, V02 | 공통 결함 |
| 개념 정리 | 예 | high | C01, C02 | SSRF 방지 효과를 이 데모가 증명하지 않음 |

#### 증거 파일

- 스크린샷: 별도 저장 없음.
- Network·콘솔·서버 로그: 이미지 요청 자체 없음.
- 빌드·설정 산출물: `apps/demo-baseline/next.config.ts` 전문(위 공통 정보 절 참고).

#### 종합 메모

- 최종 유형 검토 사항: `images.unoptimized: true`가 이미 전역 설정돼 있어(AGENTS.md 9번 규칙, `public/` 미사용 zone 특성) 이 데모의 전제 자체가 현재 아키텍처와 상충한다 — 데모 재설계 시 이 제약을 먼저 팀과 확인 필요.
- 다른 데모와 공통화할 수 있는 부분: 이하 config/* 데모 다수가 동일한 "실제 config 필드 부재 + 이커머스 템플릿" 패턴(공통 발견 2번 참고).
- 개별 구현이 필요한 부분: 실제 이미지 최적화 파이프라인 구성 여부를 아키텍처 차원에서 먼저 결정.

### config/images/formats-avif-webp — images.formats: ['image/avif', 'image/webp'] 차세대 포맷

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | 3-api-reference/3.5-config/3.5.1-next-config-js/images.md |
| 진입점 | apps/demo-baseline/src/app/zone/baseline/config/images/formats-avif-webp/page.tsx |
| 대표 검증 유형 후보 | 산출물·설정 확인 |
| 실행 결과 | mismatch |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | 상품 선택 | 버튼 클릭 | 실습 영역 | 예 | 221과 동일 이커머스 템플릿 |
| 2 | AVIF/WebP 자동 변환 파이프라인 트리거 | [동작 실행] 클릭, 로그 텍스트만 추가 | 실습 영역 | 예 | 실제 이미지 변환 없음 |
| 3 | 압축률/용량 절감 관찰 | 검증 패널 확인 | 검증 패널 | 아니오 | 관련 수치 없음 |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | `next.config.ts`의 `images.formats` 설정 존재 여부 | `['image/avif', 'image/webp']` 선언 | `apps/demo-baseline/next.config.ts`의 `images`는 `{ unoptimized: true }`뿐, `formats` 없음 | 산출물·설정 확인 | 소스 코드 | `apps/demo-baseline/next.config.ts` | 예 | fail |
| 2 | 실제 이미지 포맷 변환 발생 여부 | `/_next/image` 요청의 응답 `Content-Type`이 avif/webp | 페이지에 `<img>` 태그 자체가 없어 `/_next/image` 요청이 발생하지 않음(curl HTML 확인) | 외부 도구·환경 확인 | curl HTML | 본 세션 curl 결과 | 예 | fail |

- 검증 불가 사유: 해당 없음
- 필요한 도구·환경: 해당 없음
- 허용 가능한 간접 증거: 없음
- 데모 재설계 필요 여부: 예
- 기대 문구 축소 필요 여부: 예

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | high | G01 | "포맷 변환" 트리거가 실제로 이미지 요청을 만들지 않음 |
| 데모 예제 | 예 | high | D02 | `next/image`로 실제 이미지를 렌더링하고 `images.formats` 설정에 따른 `Content-Type` 차이를 Network 탭에서 실증해야 함 |
| 검증 | 예 | high | V01, V02 | 공통 결함 |
| 개념 정리 | 예 | high | C01, C02 | "용량 최대 50% 절감"이 실측 근거 없는 정량 주장(playbook 5절 위반) |

#### 증거 파일

- 스크린샷: 별도 저장 없음.
- Network·콘솔·서버 로그: 이미지 요청 없음.
- 빌드·설정 산출물: `apps/demo-baseline/next.config.ts` 전문.

#### 종합 메모

- 최종 유형 검토 사항: 221과 동일 원인(이미지 파이프라인 자체 부재) — 두 데모를 묶어 함께 재설계하는 편이 효율적.
- 다른 데모와 공통화할 수 있는 부분: 공통 발견 2번.
- 개별 구현이 필요한 부분: 실제 이미지 렌더링 파이프라인.

### config/logging/fetches-full-url — logging.fetches.fullUrl: true 서버 fetch 콘솔 상세 로깅

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | 3-api-reference/3.5-config/3.5.1-next-config-js/logging.md |
| 진입점 | apps/demo-baseline/src/app/zone/baseline/config/logging/fetches-full-url/page.tsx |
| 대표 검증 유형 후보 | 외부 도구·환경 확인 |
| 실행 결과 | mismatch |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | 상품 선택 | 버튼 클릭 | 실습 영역 | 예 | 공용 템플릿 |
| 2 | 서버 컴포넌트 fetch 요청 실행 | [동작 실행] 클릭, 로그 텍스트만 추가 | 실습 영역 | 예 | 실제 `fetch()` 호출 없음 |
| 3 | 터미널 상세 로그 관찰 | 개발 서버 터미널 로그 확인 필요 | 서버 로그 | 아니오 | 애초에 서버 fetch가 없으므로 로그도 없음 |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | 컴포넌트 내 서버 `fetch()` 호출 여부 | 서버 컴포넌트가 외부 API를 `fetch`로 호출 | `config/logging/fetches-full-url` 디렉터리 전체에서 `fetch(` 패턴 검색 결과 0건(`VerificationFooter.tsx`의 서술 텍스트 제외) | 외부 도구·환경 확인 | 소스 코드 | `grep -rln "fetch(" .../fetches-full-url/` 결과 없음(본 세션) | 예 | fail |
| 2 | `next.config.ts`의 `logging.fetches.fullUrl` 설정 존재 여부 | `logging: { fetches: { fullUrl: true } }` 선언 | `apps/demo-baseline/next.config.ts`에 `logging` 필드 자체가 없음 | 산출물·설정 확인 | 소스 코드 | `apps/demo-baseline/next.config.ts` | 예 | fail |

- 검증 불가 사유: 해당 없음
- 필요한 도구·환경: 해당 없음(서버 로그 확인이 필요하다고 가이드가 말하지만, 애초에 fetch가 없어 로그 자체가 발생하지 않으므로 도구 문제가 아님)
- 허용 가능한 간접 증거: 없음
- 데모 재설계 필요 여부: 예
- 기대 문구 축소 필요 여부: 예

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | high | G03 | "터미널 상세 로그 관찰"을 지시하지만 데모 화면 밖에서 개발 서버 콘솔을 봐야 한다는 안내나 방법이 전혀 없음(외부 도구 사용 조건 누락) |
| 데모 예제 | 예 | high | D02, D03 | 실제 서버 컴포넌트에서 외부 API를 `fetch()`로 호출해야 하고, `next.config.ts`에 `logging.fetches.fullUrl: true`를 실제로 설정해야 함 |
| 검증 | 예 | high | V01, V02, V03 | 공통 결함 + 서버 콘솔 로그라는 외부 증거가 필요한데 화면 안에서 검증된 것처럼 표현 |
| 개념 정리 | 예 | high | C01, C02 | 실제 로깅 동작을 증명하지 않음 |

#### 증거 파일

- 스크린샷: 별도 저장 없음.
- Network·콘솔·서버 로그: 서버 fetch 없음(grep 결과 0건).
- 빌드·설정 산출물: `apps/demo-baseline/next.config.ts` 전문.

#### 종합 메모

- 최종 유형 검토 사항: 이 데모가 정직하게 구현되면 "외부 도구·환경 확인"의 좋은 예시(개발 서버 stdout 로그를 `get_logs` MCP 도구로 캡처)가 될 수 있다.
- 다른 데모와 공통화할 수 있는 부분: 공통 발견 2번.
- 개별 구현이 필요한 부분: 실제 서버 fetch + logging 설정.

### config/dev-indicators/render-badge — devIndicators 렌더링 상태 개발 뱃지 제어

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | 3-api-reference/3.5-config/3.5.1-next-config-js/devIndicators.md |
| 진입점 | apps/demo-baseline/src/app/zone/baseline/config/dev-indicators/render-badge/page.tsx |
| 대표 검증 유형 후보 | 화면 관찰 |
| 실행 결과 | mismatch |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | 상품 선택 | 버튼 클릭 | 실습 영역 | 예 | 공용 템플릿 |
| 2 | 뱃지 표시 설정 연동 동작 실행 | [동작 실행] 클릭, 로그 텍스트만 추가 | 실습 영역 | 예 | 실제 `devIndicators` 상태를 바꾸지 않음 |
| 3 | 화면 렌더링 인디케이터 상태 관찰 | 우측 하단 실제 Next.js Dev Tools 인디케이터 확인 | 화면 우측 하단 | 예(단, 데모와 무관하게 항상 존재) | "Open Next.js Dev Tools" 버튼은 모든 페이지에 기본 표시되는 실제 Next.js 개발 인디케이터이며, 이 데모의 조작과 무관하게 항상 같은 위치에 나타남 |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | `next.config.ts`의 `devIndicators` 설정 존재 여부 | 위치/활성화 여부가 커스터마이즈됨 | `apps/demo-baseline/next.config.ts`에 `devIndicators` 필드 없음(기본값 그대로) | 산출물·설정 확인 | 소스 코드 | `apps/demo-baseline/next.config.ts` | 예 | fail |
| 2 | 데모 조작이 실제 인디케이터에 영향을 주는지 | "동작 실행" 클릭 후 인디케이터 위치/표시 변화 | 클릭 전/후 "Open Next.js Dev Tools" 버튼 위치·표시 상태 동일(agent-browser snapshot 비교) | 화면 관찰 | 데모 화면 | 본 세션 스냅샷 비교 | 예 | fail |

- 검증 불가 사유: 해당 없음
- 필요한 도구·환경: 해당 없음
- 허용 가능한 간접 증거: 없음
- 데모 재설계 필요 여부: 예
- 기대 문구 축소 필요 여부: 예

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | high | G02 | "관찰 위치"가 실제 인디케이터인지, 데모 내부 UI인지 불명확 |
| 데모 예제 | 예 | high | D02 | `next.config.ts`에 실제 `devIndicators: { position: ... }` 등을 설정하고, 전후 스크린샷/문서 안내로 실제 인디케이터 변화를 보여야 함(런타임에서 동적으로 바꾸는 것은 Next.js API상 불가능하므로, 설정값을 정적으로 보여주는 "산출물·설정 확인"형으로 재설계 필요) |
| 검증 | 예 | high | V01, V02, V03 | 공통 결함 + devIndicators는 근본적으로 런타임 토글이 불가능한 빌드 타임 설정이므로 현재의 "동작 실행 버튼" UX 자체가 개념과 모순 |
| 개념 정리 | 예 | high | C01, C02 | 실시간 제어가 가능한 것처럼 서술하지만 실제로는 next.config 재시작이 필요한 설정 |

#### 증거 파일

- 스크린샷: 별도 저장 없음.
- Network·콘솔·서버 로그: 해당 없음.
- 빌드·설정 산출물: `apps/demo-baseline/next.config.ts` 전문.

#### 종합 메모

- 최종 유형 검토 사항: `devIndicators`는 정의상 런타임 조작이 불가능한 빌드/설정 타임 옵션이므로, "동작 실행" 같은 인터랙션형 UI 자체가 이 API의 성격과 맞지 않는다 — 유형 재설계 시 "산출물·설정 확인" 전용 템플릿 신설을 권고.
- 다른 데모와 공통화할 수 있는 부분: 공통 발견 2번, 3번.
- 개별 구현이 필요한 부분: `next.config.ts`에 실제 설정 반영 + 정적 설명형 UI로 전환.

### config/env/build-time-injection — env 필드를 통한 빌드 타임 환경변수 주입

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | 3-api-reference/3.5-config/3.5.1-next-config-js/env.md |
| 진입점 | apps/demo-baseline/src/app/zone/baseline/config/env/build-time-injection/page.tsx |
| 대표 검증 유형 후보 | 산출물·설정 확인 |
| 실행 결과 | mismatch |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | 상품 선택 | 버튼 클릭 | 실습 영역 | 예 | 공용 템플릿 |
| 2 | env 필드 인라인 치환 상수 호출 | [동작 실행] 클릭, 로그 텍스트만 추가 | 실습 영역 | 예 | 실제 `process.env` 참조 없음 |
| 3 | 빌드 타임 인라인 주입 결과 관찰 | 검증 패널 확인 | 검증 패널 | 아니오 | 관련 값 없음 |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | `next.config.ts`의 `env` 필드 존재 여부 | `env: { NEXT_PUBLIC_SHOP_API_HOST: 'https://api.shop.com' }` 등 선언 | `apps/demo-baseline/next.config.ts`에 `env` 필드 없음 | 산출물·설정 확인 | 소스 코드 | `apps/demo-baseline/next.config.ts` | 예 | fail |
| 2 | 컴포넌트 내 `process.env.*` 참조 여부 | 컴포넌트가 인라인 치환된 상수를 실제로 사용 | `config/env/build-time-injection` 디렉터리 전체에서 `process.env` 패턴이 `VerificationFooter.tsx`의 서술 텍스트(`<code>` 블록)에만 존재하고 실제 컴포넌트 로직에는 없음 | 산출물·설정 확인 | 소스 코드 | `components/ConfigEnvInjectionDemo.tsx` (grep 결과 없음, 본 세션) | 예 | fail |

- 검증 불가 사유: 해당 없음
- 필요한 도구·환경: 해당 없음
- 허용 가능한 간접 증거: 없음
- 데모 재설계 필요 여부: 예
- 기대 문구 축소 필요 여부: 예

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | high | G01 | "환경변수 호출" 절차가 실제 참조 코드 없이 진행 |
| 데모 예제 | 예 | high | D02 | `next.config.ts`에 실제 `env` 필드를 선언하고 컴포넌트에서 `process.env.NEXT_PUBLIC_SHOP_API_HOST`를 참조해 렌더링해야 함 |
| 검증 | 예 | high | V01, V02 | 공통 결함 |
| 개념 정리 | 예 | medium | C01 | Docker 이미지 승격 제약 등 부가 설명은 정확하지만, 데모 자체가 이를 실증하지 않음 |

#### 증거 파일

- 스크린샷: 별도 저장 없음.
- Network·콘솔·서버 로그: 해당 없음.
- 빌드·설정 산출물: `apps/demo-baseline/next.config.ts` 전문.

#### 종합 메모

- 최종 유형 검토 사항: `env` 필드는 빌드 타임에 고정되므로 "산출물·설정 확인" 유형이 정직한 접근이다 — dev 서버 재시작 없이 실시간으로 바꾸는 것처럼 보이는 현재 UX는 API 성격과 맞지 않는다.
- 다른 데모와 공통화할 수 있는 부분: 공통 발견 2번, 3번(224와 유사한 "런타임 토글 불가능한 설정을 인터랙티브 UI로 오인시키는" 패턴).
- 개별 구현이 필요한 부분: 실제 `env` 필드 선언 및 참조 코드.

### config/cross-origin/anonymous-mode — crossOrigin: 'anonymous' 서드파티 스크립트 속성

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | 3-api-reference/3.5-config/3.5.1-next-config-js/crossOrigin.md |
| 진입점 | apps/demo-baseline/src/app/zone/baseline/config/cross-origin/anonymous-mode/page.tsx |
| 대표 검증 유형 후보 | 외부 도구·환경 확인 |
| 실행 결과 | mismatch |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | 상품 선택 | 버튼 클릭 | 실습 영역 | 예 | 공용 템플릿 |
| 2 | crossOrigin 속성 부여된 스크립트 로딩 파이프라인 호출 | [동작 실행] 클릭, 로그 텍스트만 추가 | 실습 영역 | 예 | 실제 스크립트 로딩 트리거 없음 |
| 3 | HTML script 태그 crossorigin 속성 주입 관찰 | 페이지 HTML `<script>` 태그 직접 확인 | HTML 소스 | 예(데모 밖에서) | curl로 확인한 결과 어떤 `<script>` 태그에도 `crossorigin` 속성 없음 |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | `next.config.ts`의 `crossOrigin: 'anonymous'` 설정 존재 여부 | 설정이 선언되어 있음 | `apps/demo-baseline/next.config.ts`에 `crossOrigin` 필드 없음 | 산출물·설정 확인 | 소스 코드 | `apps/demo-baseline/next.config.ts` | 예 | fail |
| 2 | 실제 HTML `<script>` 태그의 `crossorigin` 속성 존재 여부 | 모든 Next.js 생성 `<script>` 태그에 `crossorigin="anonymous"` | `curl http://localhost:3001/zone/baseline/config/cross-origin/anonymous-mode`로 받은 HTML의 모든 `<script src="...">` 태그를 확인한 결과 `crossorigin` 속성이 하나도 없음(async만 존재) | 외부 도구·환경 확인 | curl HTML | 본 세션 curl 결과(`<script src="/demo-static/baseline/_next/static/chunks/..." async="">`) | 예 | fail |

- 검증 불가 사유: 해당 없음
- 필요한 도구·환경: 해당 없음
- 허용 가능한 간접 증거: 없음(직접 HTML 증거로 충분)
- 데모 재설계 필요 여부: 예
- 기대 문구 축소 필요 여부: 예

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | high | G01 | "스크립트 로드" 절차가 실제로 아무 스크립트도 로드하지 않음 |
| 데모 예제 | 예 | high | D02 | `next.config.ts`에 실제 `crossOrigin: 'anonymous'`를 설정하고, HTML 소스 보기(view-source)로 `<script crossorigin="anonymous">`를 직접 확인시키는 절차로 재작성 |
| 검증 | 예 | high | V01, V02 | 공통 결함 + curl로 직접 반증 가능한 명확한 fail |
| 개념 정리 | 예 | high | C01, C02 | CORS 에러 로깅 지원 효과를 이 데모가 증명하지 않음 |

#### 증거 파일

- 스크린샷: 별도 저장 없음.
- Network·콘솔·서버 로그: `curl` HTML 원본에서 `<script>` 태그 속성 확인(위 검증 항목 #2 참고).
- 빌드·설정 산출물: `apps/demo-baseline/next.config.ts` 전문.

#### 종합 메모

- 최종 유형 검토 사항: `crossOrigin`은 HTML 소스를 직접 열람하는 것만으로 즉시 반증 가능한 가장 명확한 "산출물·설정 확인" 사례 — 골든 샘플(반례) 후보.
- 다른 데모와 공통화할 수 있는 부분: 공통 발견 2번.
- 개별 구현이 필요한 부분: 실제 `crossOrigin` 설정 반영.

### config/powered-by-header/hide-x-powered — poweredByHeader: false 서버 정보 은닉 보안

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | 3-api-reference/3.5-config/3.5.1-next-config-js/poweredByHeader.md |
| 진입점 | apps/demo-baseline/src/app/zone/baseline/config/powered-by-header/hide-x-powered/page.tsx |
| 대표 검증 유형 후보 | 외부 도구·환경 확인 |
| 실행 결과 | mismatch |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | 엔드포인트 선택 | 버튼 클릭 | 실습 영역 | 예 | 공용 템플릿 |
| 2 | poweredByHeader 비활성화 응답 요청 | [동작 실행] 클릭, 로그 텍스트만 추가 | 실습 영역 | 예 | 실제 HTTP 요청을 발생시키지 않음(클라이언트 상태만 갱신) |
| 3 | X-Powered-By 헤더 제거 관찰 | 실제 응답 헤더 확인 | HTTP 응답 헤더 | 예(데모 밖에서) | `curl -D -`로 직접 확인한 결과 헤더가 **제거되지 않고 그대로 존재** |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | `next.config.ts`의 `poweredByHeader: false` 설정 존재 여부 | 설정이 선언되어 있음 | `apps/demo-baseline/next.config.ts`에 `poweredByHeader` 필드 없음(기본값 `true`) | 산출물·설정 확인 | 소스 코드 | `apps/demo-baseline/next.config.ts` | 예 | fail |
| 2 | 실제 HTTP 응답에서 `X-Powered-By` 헤더 제거 여부 | 헤더가 응답에 없어야 함 | `curl -s -D - -o /dev/null http://localhost:3001/zone/baseline/config/powered-by-header/hide-x-powered` 결과 `X-Powered-By: Next.js` 헤더가 **그대로 존재**(본 세션 재현) | 외부 도구·환경 확인 | curl 응답 헤더 | 본 세션 curl 결과 | 예 | fail |

- 검증 불가 사유: 해당 없음
- 필요한 도구·환경: 해당 없음
- 허용 가능한 간접 증거: 없음(직접 반증)
- 데모 재설계 필요 여부: 예
- 기대 문구 축소 필요 여부: 예

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | high | G01 | "요청 실행" 절차가 실제 HTTP 요청과 무관 |
| 데모 예제 | 예 | high | D02 | `next.config.ts`에 실제 `poweredByHeader: false`를 설정하고, Network 탭에서 `X-Powered-By` 헤더 부재를 직접 확인시키는 절차로 재작성 |
| 검증 | 예 | high | V01, V02 | 공통 결함 + 이 항목은 실제로 학습자가 "차단되었다"고 오인할 위험이 가장 큼(보안 관련 오개념 유발 가능성) |
| 개념 정리 | 예 | high | C01, C02 | "서버 기술 스택 정보 노출을 차단합니다"라고 단정하지만 실제 응답은 여전히 노출 중 |

#### 증거 파일

- 스크린샷: `nextjs-app/docs/planning/evidence-claude/227-powered-by-fake-ui.png`
- Network·콘솔·서버 로그: `curl -D -` 응답 헤더 전문(본 세션, `X-Powered-By: Next.js` 확인됨).
- 빌드·설정 산출물: `apps/demo-baseline/next.config.ts` 전문.

#### 종합 메모

- 최종 유형 검토 사항: 이 데모는 **보안 관련 오개념을 유발할 수 있어 심각도가 특히 높다** — 학습자가 "설정을 켰다"고 착각한 채 실제로는 서버 정보가 계속 노출되는 상태로 넘어갈 수 있음. 최우선 수정 대상으로 별도 플래그 권고.
- 다른 데모와 공통화할 수 있는 부분: 공통 발견 2번.
- 개별 구현이 필요한 부분: 실제 `poweredByHeader: false` 설정 반영.

### config/cache-components/enable-flag — cacheComponents: true Next.js 16 플래그 활성화

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | cache |
| 근거 문서 | 3-api-reference/3.5-config/3.5.1-next-config-js/cacheComponents.md |
| 진입점 | apps/demo-cache-components/src/app/zone/cache/config/cache-components/enable-flag/page.tsx |
| 대표 검증 유형 후보 | 산출물·설정 확인 |
| 실행 결과 | mismatch |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | 상품 선택 | 버튼 클릭 | 실습 영역 | 예 | 공용 템플릿 |
| 2 | cacheComponents 활성화 기반 컴포넌트 렌더링 실행 | [동작 실행] 클릭, 로그 텍스트만 추가 | 실습 영역 | 예 | 실제 `'use cache'` 컴포넌트 렌더링과 무관 |
| 3 | 컴포넌트 레벨 캐시 적재 관찰 | 검증 패널 확인 | 검증 패널 | 아니오 | 관련 신호 없음 |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | `next.config.ts`의 `cacheComponents: true` 설정 존재 여부 | 플래그가 활성화되어 있음 | `apps/demo-cache-components/next.config.ts`에 `cacheComponents: true`가 **실제로 존재**(최상위 옵션, `// Next.js 16 최상위 옵션` 주석 포함) | 산출물·설정 확인 | 소스 코드 | `apps/demo-cache-components/next.config.ts` | 예 | pass |
| 2 | 데모 컴포넌트가 이 플래그의 효과(컴포넌트 단위 `'use cache'` 허용)를 실제로 시연하는지 | 인터랙티브 데모에서 실제 `'use cache'` 컴포넌트 렌더링 확인 | `ConfigCacheComponentsDemo.tsx`는 209/210과 동일한 완전 클라이언트 이커머스 템플릿이며 `'use cache'`나 서버 컴포넌트 호출이 없음 | 외부 도구·환경 확인 | 소스 코드 | `components/ConfigCacheComponentsDemo.tsx` 1–101행 | 예 | fail |

- 검증 불가 사유: 해당 없음
- 필요한 도구·환경: 해당 없음
- 허용 가능한 간접 증거: 없음
- 데모 재설계 필요 여부: 예(데모 예제만)
- 기대 문구 축소 필요 여부: 예

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | medium | G01 | "컴포넌트 렌더" 절차가 실제 캐시 컴포넌트와 무관한 이커머스 UI로 연결됨 |
| 데모 예제 | 예 | medium | D02 | 설정 자체는 실제로 켜져 있으므로(cache zone 전체가 이 플래그의 수혜자), 이 zone의 다른 정상 데모(예: B01의 `caching/basic`)를 가리키거나 실제 `'use cache'` 컴포넌트를 직접 시연해야 함 |
| 검증 | 예 | medium | V01, V02 | 공통 결함 |
| 개념 정리 | 아니오 | none | — | "next.config.ts에서 experimental.cacheComponents: true를 활성화하여…" 서술은 필드 위치(`experimental` 안이 아니라 최상위)만 다를 뿐, 전체적인 취지는 실제 설정과 부합. 단, "experimental." 표현은 실제 코드와 불일치하므로 아래 낮은 심각도로 별도 표기 |

- 개념 정리 표현 오류(참고): DeepDive가 "experimental.cacheComponents: true"라 서술하지만, 실제 `next.config.ts`에서는 `experimental` 객체가 아니라 최상위 `cacheComponents: true`로 선언돼 있다(Next.js 16 변경사항과 일치). 이 부분은 `C02`(사소, low)로 별도 기록.

#### 증거 파일

- 스크린샷: 별도 저장 없음.
- Network·콘솔·서버 로그: 해당 없음.
- 빌드·설정 산출물: `apps/demo-cache-components/next.config.ts` 전문 — `cacheComponents: true` 확인(본 세션).

#### 종합 메모

- 최종 유형 검토 사항: B21/B23/B25 중 유일하게 "설정 자체는 실제로 참"인 사례. 데모 예제만 정직하게 다시 연결하면 가장 적은 비용으로 살릴 수 있는 후보.
- 다른 데모와 공통화할 수 있는 부분: 공통 발견 2번(단, 설정 존재 여부는 예외).
- 개별 구현이 필요한 부분: 데모 예제를 실제 `'use cache'` 컴포넌트 시연으로 교체, DeepDive의 `experimental.` 표현 정정.

### config/cache-life/custom-presets — experimental.cacheLife 커스텀 수명 프리셋 전역 정의

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | cache |
| 근거 문서 | 3-api-reference/3.5-config/3.5.1-next-config-js/cacheLife.md |
| 진입점 | apps/demo-cache-components/src/app/zone/cache/config/cache-life/custom-presets/page.tsx |
| 대표 검증 유형 후보 | 산출물·설정 확인 |
| 실행 결과 | mismatch |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | 상품 선택 | 버튼 클릭 | 실습 영역 | 예 | 공용 템플릿 |
| 2 | 전역 cacheLife 프리셋 조회 | [동작 실행] 클릭, 로그 텍스트만 추가 | 실습 영역 | 예 | 실제 캐시 조회 없음 |
| 3 | 전역 cacheLife 프리셋 TTL 동작 관찰 | 검증 패널 확인 | 검증 패널 | 아니오 | 관련 신호 없음 |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | `next.config.ts`의 `experimental.cacheLife` 커스텀 프리셋 존재 여부 | 전역 프리셋 정의 존재 | `apps/demo-cache-components/next.config.ts`의 `experimental`은 `serverActions`만 있고 `cacheLife` 없음 | 산출물·설정 확인 | 소스 코드 | `apps/demo-cache-components/next.config.ts` | 예 | fail |
| 2 | 데모가 `cacheLife()` 함수를 실제로 사용하는지 | 서버 함수에서 `cacheLife('preset-name')` 호출 | `ConfigCacheLifePresetsDemo.tsx`에 `cacheLife` 문자열 없음(공용 이커머스 템플릿) | 외부 도구·환경 확인 | 소스 코드 | `components/ConfigCacheLifePresetsDemo.tsx` 1–101행 | 예 | fail |

- 검증 불가 사유: 해당 없음
- 필요한 도구·환경: 해당 없음
- 허용 가능한 간접 증거: 없음
- 데모 재설계 필요 여부: 예
- 기대 문구 축소 필요 여부: 예

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | high | G01 | "프리셋 조회" 절차가 실제 프리셋과 무관 |
| 데모 예제 | 예 | high | D02 | `next.config.ts`에 `experimental.cacheLife`로 전역 프리셋을 선언하고, 이 zone의 다른 데모(`functions/cache-life/*`)가 이미 구현한 실제 `cacheLife()` 사용 패턴을 참고해 재작성 |
| 검증 | 예 | high | V01, V02 | 공통 결함 |
| 개념 정리 | 예 | high | C01, C02 | "엔터프라이즈 전역에서 일관되게 재사용"이 이 데모에서 증명되지 않음 |

#### 증거 파일

- 스크린샷: 별도 저장 없음.
- Network·콘솔·서버 로그: 해당 없음.
- 빌드·설정 산출물: `apps/demo-cache-components/next.config.ts` 전문.

#### 종합 메모

- 최종 유형 검토 사항: 같은 zone에 이미 `functions/cache-life/preset-profiles`, `functions/cache-life/custom-profile` 등 함수 레벨 `cacheLife` 데모가 별도로 존재하므로(B25 범위 밖, 참고용), 이 config 데모는 "전역 설정" 차별점을 명확히 살리는 방향으로 재설계해야 중복을 피할 수 있음.
- 다른 데모와 공통화할 수 있는 부분: 공통 발견 2번.
- 개별 구현이 필요한 부분: `next.config.ts` 전역 프리셋 선언 + 실제 참조.

### config/cache-handlers/redis-kv — experimental.cacheHandlers 분산 Redis 캐시 핸들러 연동

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | cache |
| 근거 문서 | 3-api-reference/3.5-config/3.5.1-next-config-js/cacheHandlers.md |
| 진입점 | apps/demo-cache-components/src/app/zone/cache/config/cache-handlers/redis-kv/page.tsx |
| 대표 검증 유형 후보 | 산출물·설정 확인 |
| 실행 결과 | mismatch |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | 상품 선택 | 버튼 클릭 | 실습 영역 | 예 | 공용 템플릿 |
| 2 | 커스텀 CacheHandler get/set/revalidateTag 호출 | [동작 실행] 클릭, 로그 텍스트만 추가 | 실습 영역 | 예 | 실제 CacheHandler 인터페이스 호출 없음 |
| 3 | 분산 Redis 캐시 적재 및 동기화 관찰 | 검증 패널 확인 | 검증 패널 | 아니오 | 관련 신호 없음 |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | `next.config.ts`의 `experimental.cacheHandlers` 설정 존재 여부 | Redis/KV 어댑터가 등록됨 | `apps/demo-cache-components/next.config.ts`에 `cacheHandlers` 필드 없음 | 산출물·설정 확인 | 소스 코드 | `apps/demo-cache-components/next.config.ts` | 예 | fail |
| 2 | Redis 관련 의존성/연동 코드 존재 여부 | `redis`/`ioredis` 등 패키지와 연동 코드 존재 | `package.json`(루트, `demo-cache-components`)과 `src` 전체에서 `redis` 문자열 검색 결과 0건 | 산출물·설정 확인 | 소스 코드 | `grep -rn "redis" nextjs-app/apps/demo-cache-components` 결과 없음(본 세션) | 예 | fail |

- 검증 불가 사유: 해당 없음
- 필요한 도구·환경: 실제 Redis 인스턴스(로컬 개발 환경에는 없음을 확인)
- 허용 가능한 간접 증거: 없음(패키지 의존성 부재로 직접 반증 가능)
- 데모 재설계 필요 여부: 예
- 기대 문구 축소 필요 여부: 예

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | high | G03 | Redis 같은 외부 인프라가 필요한 데모인데 그런 환경 요구 사항이 전혀 안내되지 않음 |
| 데모 예제 | 예 | high | D02 | 실제 Redis 연동은 로컬 학습 환경에 배포 인프라를 요구하므로, 최소한 커스텀 `CacheHandler` 인터페이스 구현체(인메모리 Mock이라도 실제 Next.js `CacheHandler` API를 구현)로 재작성하거나, 개념 정리 전용(코드 스니펫 열람형)으로 재분류 |
| 검증 | 예 | high | V01, V02, V03 | 공통 결함 + 인프라 필요 항목을 화면 안에서 검증된 것처럼 표현 |
| 개념 정리 | 예 | high | C01, C02, C03 | 기준 환경(로컬 dev에는 Redis 없음)을 명시하지 않음 |

#### 증거 파일

- 스크린샷: 별도 저장 없음.
- Network·콘솔·서버 로그: 해당 없음.
- 빌드·설정 산출물: `apps/demo-cache-components/next.config.ts` 전문, `package.json` 의존성 목록(redis 계열 패키지 없음).

#### 종합 메모

- 최종 유형 검토 사항: Redis 등 외부 인프라 의존 데모는 로컬 학습 환경의 태생적 한계이므로, "blocked-by-environment"보다는 "실제 인프라 없이도 CacheHandler 인터페이스 구현을 코드로 보여주는" 산출물·설정 확인형으로 재설계하는 것이 더 정직하다.
- 다른 데모와 공통화할 수 있는 부분: 공통 발견 2번, 4번.
- 개별 구현이 필요한 부분: `CacheHandler` 인터페이스 실제 구현체(최소 인메모리) 또는 코드 스니펫 열람형 전환.

### config/expire-time/memory-isr-tuning — expireTime 메모리 ISR 캐시 보존 기간 튜닝

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | cache |
| 근거 문서 | 3-api-reference/3.5-config/3.5.1-next-config-js/expireTime.md |
| 진입점 | apps/demo-cache-components/src/app/zone/cache/config/expire-time/memory-isr-tuning/page.tsx |
| 대표 검증 유형 후보 | 산출물·설정 확인 |
| 실행 결과 | `mismatch` |
| 초기화 방법 | 새 URL 진입 후 러닝화, `+`, `동작 실행`; local log는 다음 URL에서 초기화 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | 상품 선택 | `러닝화 (#001)` 클릭 | 실습 영역 | 예 | local state와 log만 변경 |
| 2 | `+` 후 `동작 실행` | 두 버튼 클릭 | 실습 영역 | 예 | 실제 cache query 없음 |
| 3 | expireTime 초과와 GC 관찰 | 즉시 화면·로그 확인 | 서버 로그·검증 | 아니오 | 시간 경과·메모리·GC 지표가 없고 client log만 생성 |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | expireTime config | 캐시 만료 한계가 설정됨 | cache `next.config.ts`에 `expireTime` 없음 | 산출물·설정 확인 | 소스 | `next.config.ts` | 예 | fail |
| 2 | 캐시 GC 수명 | 300초 후 오래된 캐시가 제거됨 | dev 화면에 cache ID·메모리·GC 관찰값 없음. production/메모리 계측을 실행하지 않음 | 외부 도구·환경 확인 | 환경·서버 로그 | 캐시 runtime/로그 | 아니오 | blocked-by-environment |
| 3 | 가이드 조작 | query가 cache 정책을 거쳐 로그·응답을 생성 | `ConfigExpireTimeDemo`는 `useState`와 `new Date().toLocaleTimeString()` local log만 사용 | 전후 변화 | 소스·화면 | `actionLog` | 예 | fail |
| 4 | 검증 패널 | 실제 expireTime/GC 상태 표시 | Actual 고정 대기 문구, `불일치` | 산출물·설정 확인 | 접근성 스냅샷·소스 | `[검증]` Actual | 예 | fail |

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | high | G02, G03 | production build/runtime, 시간 조건, 메모리·GC 로그 확인 방법을 명시 |
| 데모 예제 | 예 | high | D02, D03 | local log를 실제 cacheLife/expireTime 데이터와 서버 계측으로 교체 |
| 검증 | 예 | high | V01, V02, V03, V05 | 설정값, 캐시 생성 시각, 만료·GC 증거를 독립 항목으로 표시 |
| 개념 정리 | 예 | high | C01, C02, C03 | 실제 config가 없음을 반영하고 `expireTime: 300`, OOM 방지 효과를 측정 범위와 함께 설명 |

#### 증거 파일

- 스크린샷: 별도 저장 없음. 상품·수량 local log와 고정 검증 패널을 Playwright 실행 결과로 확인.
- Network·콘솔·서버 로그: 페이지 GET 200, 조작 후 별도 cache query 요청 없음. cache dev 로그에 GC/expireTime 증거 없음.
- 빌드·설정 산출물: cache `next.config.ts`에는 `cacheComponents`, assetPrefix, images, serverActions만 있음. `expireTime` 없음.

#### 종합 메모

- 최종 유형 검토 사항: 설정·서버 메모리 산출물 확인형. 현재 dev UI는 캐시 수명과 무관한 local log.
- 다른 데모와 공통화할 수 있는 부분: config 값을 source/manifest와 함께 기록하고 runtime 지표 부재를 blocked로 표시.
- 개별 구현이 필요한 부분: 실제 캐시 생성과 만료를 관찰할 production/계측 harness.

### config/stale-times/router-cache-tuning — experimental.staleTimes 클라이언트 라우터 캐시 시간 제어

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | cache |
| 근거 문서 | 3-api-reference/3.5-config/3.5.1-next-config-js/staleTimes.md |
| 진입점 | apps/demo-cache-components/src/app/zone/cache/config/stale-times/router-cache-tuning/page.tsx |
| 대표 검증 유형 후보 | 전후 변화 |
| 실행 결과 | `mismatch` |
| 초기화 방법 | 새 URL 진입. 실습 component는 정적 텍스트만 렌더링하고 내비게이션·storage 상태를 사용하지 않음 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | dynamic/static 설정과 뒤로가기·앞으로가기 검증 | 페이지의 `staleTimes: { dynamic: 0, static: 300 }` 정적 텍스트 확인 | 실습·소스 | 아니오 | route/link/back-forward 조작 없음 |
| 2 | staleTime 만료 후 서버 재검증 관찰 | 대기·재방문 시도 | Network·검증 | 아니오 | 대상 route, 타이머, RSC 요청 비교 신호 없음 |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | `experimental.staleTimes` 설정 | dynamic/static 값이 config에 선언됨 | cache `next.config.ts`에 `experimental.staleTimes` 없음 | 산출물·설정 확인 | 소스 | `next.config.ts` | 예 | fail |
| 2 | back/forward Router Cache 전후 | stale window 내 RSC 요청 없음, 만료 후 재요청 | 실습에 이동 대상·Link·back/forward 조작이 없고 해당 요청을 비교할 수 없음 | 전후 변화 | Network·환경 | 브라우저 요청 목록 | 아니오 | unverifiable |
| 3 | 표시값 일관성 | 가이드·실습·개념의 설정값이 일치 | 가이드는 dynamic 0/static 300, DeepDive는 dynamic 30/static 180, 화면은 0/300 | 값 비교 | 소스·화면 | 가이드·실습·DeepDive | 예 | fail |
| 4 | 검증 패널 | 요청 전후와 stale 상태 표시 | Actual 고정 대기 문구, `불일치` | 전후 변화 | 접근성 스냅샷·소스 | `[검증]` Actual | 예 | fail |

- 검증 불가 사유: 캐시 설정과 이동 route가 없어서 stale window 전후 Network 비교를 수행할 대상이 없다.
- 필요한 도구·환경: 실제 `experimental.staleTimes` config, 두 route, 브라우저 back/forward와 RSC Network 기록.
- 허용 가능한 간접 증거: routes manifest/config와 동일 페이지의 전후 request count. 정적 설명 문구는 증거가 아님.
- 데모 재설계 필요 여부: 예. 실제 route transition과 stale 만료를 짧은 테스트 프로필로 구성해야 함.
- 기대 문구 축소 필요 여부: 예. 0ms와 30/180초 정량값은 실제 설정·측정값으로 통일해야 함.

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | high | G02, G03 | 이동 대상 route, back/forward 순서, Network 요청 비교와 만료 대기 조건을 추가 |
| 데모 예제 | 예 | high | D03 | 정적 텍스트를 실제 route transition·Router Cache 상태로 교체 |
| 검증 | 예 | high | V01, V02, V03, V05 | stale window 전후 요청 수와 실제 설정을 별도 비교하고 값 불일치를 제거 |
| 개념 정리 | 예 | high | C01, C02, C03 | 0/300과 30/180 불일치를 정정하고 버전·dev/production 범위를 명시 |

#### 증거 파일

- 스크린샷: 별도 저장 없음. 접근성 스냅샷에서 실습은 세 줄의 staleTimes 텍스트뿐이고 버튼은 없음.
- Network·콘솔·서버 로그: 페이지 GET 200, stale 이동·추가 RSC 요청을 발생시키는 조작 없음. 콘솔의 데모 오류 없음.
- 빌드·설정 산출물: cache `next.config.ts`에 `experimental.staleTimes` 없음. Next docs 기준 staleTimes는 experimental client cache 설정임.

#### 종합 메모

- 최종 유형 검토 사항: 조작 전후 Network를 비교하는 전후 변화형이지만 현재 대상 route와 config가 없음.
- 다른 데모와 공통화할 수 있는 부분: stale 설정값, 이동 전후 URL, RSC 요청 수와 결과를 함께 기록.
- 개별 구현이 필요한 부분: 실제 동적·정적 route와 짧은 stale 프로필을 갖춘 검증 fixture.

### config/output/standalone-container — output: 'standalone' 도커 경량 컨테이너 패키징

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | 3-api-reference/3.5-config/3.5.1-next-config-js/output.md |
| 진입점 | apps/demo-baseline/src/app/zone/baseline/config/output/standalone-container/page.tsx |
| 대표 검증 유형 후보 | 산출물·설정 확인 |
| 실행 결과 | `mismatch` |
| 초기화 방법 | 새 URL 진입 후 러닝화, `+`, `동작 실행`; local state는 다음 URL에서 초기화 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | 상품 모듈 선택 | `러닝화 (#001)` 클릭 | 실습 영역 | 예 | build 입력이 아닌 local state |
| 2 | `+` 후 `동작 실행` | 두 버튼 클릭 | 실습 영역 | 예 | standalone build가 실행되지 않음 |
| 3 | 산출물 크기·독립 구동 관찰 | `.next/standalone`와 server.js 확인 시도 | 파일·빌드 | 아니오 | 산출물 디렉터리 없음; dev 화면의 local log로 대체할 수 없음 |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | output 설정 | `output: 'standalone'` 선언 | baseline `next.config.ts`에 output 없음 | 산출물·설정 확인 | 소스 | `next.config.ts` | 예 | fail |
| 2 | standalone 산출물 | `.next/standalone/server.js`와 traced files 존재 | `.next/standalone` absent. 공유 dev 서버를 재시작하지 않고 config도 변경하지 않았으므로 production build 미실행 | 산출물·설정 확인 | 파일·환경 | `.next` | 아니오 | blocked-by-environment |
| 3 | 가이드 조작 연결 | build/runtime 결과를 로그로 표시 | `ConfigOutputStandaloneDemo`는 client `useState` local log만 변경 | 전후 변화 | 소스·화면 | `actionLog` | 예 | fail |
| 4 | 검증 패널 | 산출물 경로·크기·독립 실행 결과 표시 | Actual 고정 대기 문구와 `불일치` | 산출물·설정 확인 | 접근성 스냅샷·소스 | `[검증]` Actual | 예 | fail |

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | high | G02, G03 | production build 명령, 산출물 경로·server.js·크기 확인 방법과 build 격리 조건을 명시 |
| 데모 예제 | 예 | high | D02, D03 | 상품 local mock 대신 build 결과를 읽는 산출물 확인 workflow로 재설계 |
| 검증 | 예 | high | V01, V02, V03, V05 | config·파일 존재·크기·실행 status를 독립 행으로 표시 |
| 개념 정리 | 예 | high | C01, C02, C03 | 80% 절감·수십 MB를 측정값 없이 단정하지 않고 standalone의 tracing 범위를 기준 버전과 함께 설명 |

#### 증거 파일

- 스크린샷: 별도 저장 없음. local 상품 console과 검증 대기값을 Playwright 실행 결과로 확인.
- Network·콘솔·서버 로그: dev 페이지 GET 200, 조작 후 build/runtime 요청 없음. 콘솔의 데모 오류 없음.
- 빌드·설정 산출물: `.next/standalone`와 `out` 모두 absent. `next.config.ts`에 output 없음. production build는 공유 dev 서버 보호를 위해 실행하지 않아 blocked.

#### 종합 메모

- 최종 유형 검토 사항: production 산출물·설정 확인형. 현재 dev 렌더링은 standalone을 증명하지 않음.
- 다른 데모와 공통화할 수 있는 부분: config key와 `.next` 산출물 존재 여부를 함께 기록.
- 개별 구현이 필요한 부분: 격리된 build job, traced file 목록·server.js 실행과 이미지 크기 측정.

### config/output/export-static-spa — output: 'export' 순수 정적 SPA 산출물 생성

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | 3-api-reference/3.5-config/3.5.1-next-config-js/output.md |
| 진입점 | apps/demo-baseline/src/app/zone/baseline/config/output/export-static-spa/page.tsx |
| 대표 검증 유형 후보 | 산출물·설정 확인 |
| 실행 결과 | `mismatch` |
| 초기화 방법 | 새 URL 진입 후 러닝화, `+`, `동작 실행`; local state는 다음 URL에서 초기화 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | 상품 선택 | `러닝화 (#001)` 클릭 | 실습 영역 | 예 | 정적 HTML build 입력과 연결되지 않음 |
| 2 | `+` 후 `동작 실행` | 두 버튼 클릭 | 실습 영역 | 예 | output export build가 실행되지 않음 |
| 3 | 정적 HTML/JS 산출물과 배포 관찰 | `out` 확인 시도 | 파일·빌드 | 아니오 | `out` absent; local log는 산출물 증거가 아님 |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | output export 설정 | `output: 'export'` 선언 | baseline `next.config.ts`에 output 없음 | 산출물·설정 확인 | 소스 | `next.config.ts` | 예 | fail |
| 2 | static export 산출물 | `out` 아래 HTML/CSS/JS와 route 파일 생성 | `.next/out`·`out` absent; shared dev를 재시작하지 않고 production build 미실행 | 산출물·설정 확인 | 파일·환경 | app output directories | 아니오 | blocked-by-environment |
| 3 | 정적 호스팅 제약 | Node 서버 없이 결과 서빙 | 현재 페이지는 Next dev server에서 200으로 서빙되고 static host 실행 증거 없음 | 외부 도구·환경 확인 | 실행 환경 | dev server | 예 | fail |
| 4 | 검증 패널 | 산출물 경로와 실제 파일을 표시 | Actual 고정 대기 문구, `불일치` | 산출물·설정 확인 | 접근성 스냅샷·소스 | `[검증]` Actual | 예 | fail |

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | high | G02, G03 | isolated `next build`, `out` 파일 확인과 static host smoke 조건을 명시 |
| 데모 예제 | 예 | high | D02, D03 | local product console을 output 산출물·지원/비지원 기능 확인으로 교체 |
| 검증 | 예 | high | V01, V02, V03, V05 | config·파일 목록·정적 host 응답을 독립 증거로 표시 |
| 개념 정리 | 예 | high | C01, C02, C03 | 서버 비용·무한 확장 같은 효과를 보장 문구로 쓰지 않고 실제 build와 지원 범위를 명시 |

#### 증거 파일

- 스크린샷: 별도 저장 없음. local console과 검증 대기값을 Playwright 실행 결과로 확인.
- Network·콘솔·서버 로그: dev page GET 200; 조작 후 build 요청 없음. 콘솔의 데모 오류 없음.
- 빌드·설정 산출물: baseline `next.config.ts`에 output export 없음; `out` absent. production build/static host는 환경 보호를 위해 실행하지 않아 blocked.

#### 종합 메모

- 최종 유형 검토 사항: 정적 build 산출물·설정 확인형. dev server 200은 static export 증거가 아님.
- 다른 데모와 공통화할 수 있는 부분: output key, output directory, generated HTML/asset 목록을 함께 기록.
- 개별 구현이 필요한 부분: dynamic feature가 없는 전용 static-export build와 정적 host smoke test.

### edge/v8-lightweight/global-web-apis — Edge Runtime V8 글로벌 Web APIs 초고속 실행

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | 3-api-reference/edge.md |
| 진입점 | apps/demo-baseline/src/app/zone/baseline/edge/v8-lightweight/global-web-apis/page.tsx |
| 대표 검증 유형 후보 | 외부 도구·환경 확인 |
| 실행 결과 | `mismatch` |
| 초기화 방법 | 새 URL 진입. 입력 payload를 기본값으로 두고 `SHA-256 서명 생성 실행`; 다음 데모 진입으로 hash state 초기화 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | Edge 표준 Web APIs 명세 점검 | 가이드·DeepDive와 source 확인 | 소스·실습 | 아니오 | route에 `runtime = 'edge'`와 서버 Web API 실행이 없음 |
| 2 | SHA-256 서명 생성 실행 클릭 | 버튼 클릭, digest 결과 생성 | 실습 영역 | 예 | 브라우저 client의 `crypto.subtle` 실행 |
| 3 | 0ms 콜드스타트와 초저지연 관찰 | 해시·지연·바이트 표시 확인 | 실습·Network | 아니오 | 0.2ms 브라우저 연산은 Edge cold start 증거가 아님 |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | Edge runtime route | `export const runtime = 'edge'`에서 실행 | page와 component 모두 client component; `runtime` export 없음 | 산출물·설정 확인 | 소스·routes | 진입점·component | 예 | fail |
| 2 | Web Crypto digest | 표준 API로 256-bit hash 생성 | payload에 대해 브라우저 `crypto.subtle.digest('SHA-256')`가 hash `893889ebe2810fbb9c6b44027c467ea5c36ae404722d7ba92d6b187503b8c333`, 32 bytes, 0.2ms 표시 | 값 비교 | 브라우저 API·화면 | hash result | 예 | pass |
| 3 | Edge cold start/streaming | Edge 서버 실행의 cold start와 stream 증거 | browser client 단일 Promise 결과만 있고 Edge 요청·TransformStream·서버 로그 없음 | 외부 도구·환경 확인 | Network·서버 로그 | 요청 목록·dev log | 아니오 | blocked-by-environment |
| 4 | 검증 패널 | runtime·hash·latency의 실제값 표시 | hash 후에도 Footer Actual은 고정 대기 문구, 상태 `불일치` | 외부 도구·환경 확인 | 접근성 스냅샷·소스 | `[검증]` Actual | 예 | fail |

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | high | G02, G03 | Edge 배포/route runtime 확인과 browser Web Crypto를 구분하고 latency 측정 범위를 명시 |
| 데모 예제 | 예 | high | D02, D03 | 브라우저 client hash mock을 실제 Edge route/Route Handler와 request response로 교체 |
| 검증 | 예 | high | V01, V02, V03, V05 | 브라우저 hash pass와 Edge runtime blocked를 분리하고 cold start를 측정하지 않았으면 표시하지 않기 |
| 개념 정리 | 예 | high | C01, C02, C03 | 0ms·100% 호환·수 MB 비용 주장을 측정 근거 없이 단정하지 않고 Edge 배포 범위를 명시 |

#### 증거 파일

- 스크린샷: 별도 저장 없음. 접근성 스냅샷/Playwright 실행에서 SHA-256 버튼, hash, 32 bytes, 0.2ms를 확인.
- Network·콘솔·서버 로그: route GET 200, hash 클릭 후 server request 없음. 브라우저 콘솔의 데모 오류 없음.
- 빌드·설정 산출물: source에 `runtime = 'edge'` 없음. routes는 일반 App Router route이며 Next dev에서 compile issues 없음.

#### 종합 메모

- 최종 유형 검토 사항: runtime·배포 환경과 브라우저 API를 분리하는 외부 도구·환경 확인형. hash 계산 자체는 pass지만 Edge 주장은 mismatch.
- 다른 데모와 공통화할 수 있는 부분: 측정한 browser API 결과와 측정하지 못한 deployment claim을 별도 항목으로 표시.
- 개별 구현이 필요한 부분: Edge-compatible Route Handler, 실제 Edge 배포와 cold-start 측정.

### edge/v8-lightweight/nodejs-modules-bailout — Edge Runtime 내 Node.js 전용 모듈 접근 차단 제한점

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | 3-api-reference/edge.md |
| 진입점 | apps/demo-baseline/src/app/zone/baseline/edge/v8-lightweight/nodejs-modules-bailout/page.tsx |
| 대표 검증 유형 후보 | 외부 도구·환경 확인 |
| 실행 결과 | `mismatch` |
| 초기화 방법 | 새 URL 진입. 화면 local state 조작 없음 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | Edge에서 실행될 상품 선택 | `러닝화 (#001)` 클릭 시도 | 실습 영역 | 예 | Edge fixture와 무관한 local state |
| 2 | `+` 후 `동작 실행`으로 fs bailout 확인 | 버튼 클릭 시도 | 실습 영역·콘솔 | 아니오 | Node 모듈 import·호출·번들 에러 없음 |
| 3 | 차단 로그와 Edge 대안 확인 | 로그·source 확인 | 콘솔·검증 | 아니오 | local 세션 로그만 있고 bailout/대안 로그 없음 |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | Edge route와 unsupported module | `runtime = 'edge'`에서 fs/net/child_process 접근 | page/component에 runtime export와 Node module import 모두 없음 | 산출물·설정 확인 | 소스·routes | 진입점·component | 예 | fail |
| 2 | bailout 오류 | Node 전용 모듈 호출 시 compile/runtime 오류 | route GET 200, Next DevTools compilation issues 0, 콘솔/page error 없음 | 외부 도구·환경 확인 | Next MCP·브라우저 | errors/console | 예 | fail |
| 3 | 대안 API 안내 | 차단 후 HTTP/Web Fetch 대안 표시 | 실습은 러닝화·수량·local `API 트리거` 콘솔뿐이며 대안·차단 증거 없음 | 화면 관찰 | 화면·소스 | 실습 로그 | 아니오 | fail |
| 4 | 검증 패널 | module/error/runtime 상태를 표시 | Actual 고정 대기 문구, `불일치` | 외부 도구·환경 확인 | 접근성 스냅샷·소스 | `[검증]` Actual | 예 | fail |

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | high | G02, G03 | 실제 import 경로, build error·console 확인 위치와 Node/Edge 환경 조건을 명시 |
| 데모 예제 | 예 | high | D02, D03 | local 상품 console을 실제 Edge route와 의도된 unsupported import fixture로 교체 |
| 검증 | 예 | high | V01, V02, V03, V05 | compile issue, runtime error, 대안 API를 독립 증거로 표시 |
| 개념 정리 | 예 | high | C01, C02, C03 | 0ms·수 MB·보안 효과 단정을 측정 범위로 축소하고 실제 Edge 제약과 버전을 명시 |

#### 증거 파일

- 스크린샷: 별도 저장 없음. 접근성 스냅샷에서 오류·대안 대신 local 상품 console임을 확인.
- Network·콘솔·서버 로그: route GET 200, 조작 후 추가 요청 없음, compile/runtime error 없음. baseline dev log에 bailout 기록 없음.
- 빌드·설정 산출물: target source에 `runtime = 'edge'`, `fs`, `net`, `child_process`가 없음. `get_compilation_issues`는 빈 배열.

#### 종합 메모

- 최종 유형 검토 사항: unsupported API의 compile/runtime 증거를 확인하는 외부 도구·환경 확인형. 현재는 오류를 의도적으로 발생시키는 코드가 없음.
- 다른 데모와 공통화할 수 있는 부분: compile issue와 console error를 source fixture와 연결.
- 개별 구현이 필요한 부분: Edge route와 Node-only import의 격리된 실패 fixture, 대안 fetch 경로.

### architecture/accessibility/form-aria-support — 결제/주문 폼 WAI-ARIA 속성 및 스크린 리더 지원

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | 5-architecture/accessibility.md |
| 진입점 | apps/demo-baseline/src/app/zone/baseline/architecture/accessibility/form-aria-support/page.tsx |
| 대표 검증 유형 후보 | 화면 관찰 |
| 실행 결과 | `mismatch` |
| 초기화 방법 | 새 URL 진입. 카드 입력은 기본 빈 값으로 시작하며 별도 저장소 없음 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | 카드 번호 입력 필드 확인 | 접근성 snapshot에서 label, textbox, invalid 상태 확인 | 실습·접근성 snapshot | 예 | `신용카드 번호:` label과 invalid textbox 확인 |
| 2 | `aria-describedby="card-error"` 연결 점검 | DOM 속성·id를 evaluate로 확인 | DOM·실습 | 예 | `aria-describedby`와 `#card-error` 일치 |
| 3 | role alert 연동 관찰 | alert를 확인하고 16자리 값을 입력 | 실습·접근성 | 아니오 | 입력 후에도 `aria-invalid=true`, error alert가 그대로여서 실시간 validation 미구현 |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | ARIA 연결 초기 상태 | input invalid, describedby, alert 연결 | `#card-input` `aria-invalid="true"`, `aria-describedby="card-error"`; `#card-error` `role="alert"`와 문구 존재 | 화면 관찰 | DOM·접근성 snapshot | 실습 form | 예 | pass |
| 2 | 유효한 카드 입력 후 상태 | 16자리 입력 시 validation 결과와 invalid/error 상태가 갱신 | `4111111111111111` 입력 후에도 `aria-invalid="true"`, alert `카드 번호 16자리를 입력해주세요.` 유지. `useState(error)`는 초기값만 사용 | 전후 변화 | DOM·브라우저 | input/alert 전후 | 예 | fail |
| 3 | 검증 패널 | 실제 ARIA 속성과 전후 validation 결과 표시 | Footer props 없음. Actual 고정 대기 문구와 `불일치` | 화면 관찰 | 접근성 snapshot·소스 | `[검증]` Actual | 예 | fail |

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | medium | G03 | invalid 초기 상태와 유효 입력 후 기대 상태, reset 조건을 분리해 명시 |
| 데모 예제 | 예 | high | D01, D03 | 실제 onChange validation으로 error·aria-invalid를 갱신하고 `aria-live` 필요 여부를 정확히 구현 |
| 검증 | 예 | high | V01, V02, V03, V05 | 초기 ARIA 연결 pass와 입력 후 상태 fail을 별도 표시하고 실제 DOM을 연결 |
| 개념 정리 | 예 | high | C01, C02, C03 | aria-live·Lighthouse 100·WCAG 완벽 충족 단정을 제거하고 실제 `card-input` id와 설명을 일치 |

#### 증거 파일

- 스크린샷: 별도 저장 없음. 접근성 snapshot `.playwright-mcp/page-2026-08-28T13-28-06-825Z.yml`에서 label, invalid textbox, alert를 확인.
- Network·콘솔·서버 로그: page GET 200, 입력은 client DOM만 변경하며 추가 요청 없음. 콘솔의 데모 오류 없음.
- 빌드·설정 산출물: `ArchA11yFormDemo.tsx`의 `useState` error는 초기값만 사용하고 input에 onChange가 없음. `aria-live`, `aria-required`도 실제 DOM에 없음.

#### 종합 메모

- 최종 유형 검토 사항: 초기 접근성 semantics는 pass지만 동적 validation과 검증 패널은 fail인 화면 관찰형.
- 다른 데모와 공통화할 수 있는 부분: accessibility snapshot과 DOM attribute evaluate를 실제 증거로 기록.
- 개별 구현이 필요한 부분: 입력 상태별 validation, error message lifecycle, screen-reader announcement 테스트.

### architecture/accessibility/modal-focus-trap — 모달 다이얼로그 키보드 포커스 트랩(Focus Trap) 및 Esc 닫기

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | 5-architecture/accessibility.md |
| 진입점 | apps/demo-baseline/src/app/zone/baseline/architecture/accessibility/modal-focus-trap/page.tsx |
| 대표 검증 유형 후보 | 화면 관찰 |
| 실행 결과 | `mismatch` |
| 초기화 방법 | 새 URL 진입. 모달은 `open=false`로 시작하며 닫기 클릭 또는 새 URL로 초기화 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | `접근성 모달 열기 (Focus Trap)` 클릭 | 버튼 클릭, dialog 표시 | 실습·접근성 snapshot | 예 | `role=dialog`, `aria-modal=true`, `aria-labelledby` 존재 |
| 2 | Tab 포커스 순환 테스트 | Tab을 반복 4회 | DOM focus | 아니오 | open 직후 focus가 trigger에 남고 이후 닫기 버튼→NextJS portal→body로 이탈 |
| 3 | 닫기 버튼 또는 Esc, 포커스 복원 | Esc 입력과 dialog count·activeElement 확인 | DOM·실습 | 아니오 | Esc 후 dialog count 1; onKeyDown/Escape 처리가 없고 trigger 복원 없음 |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | dialog semantics | dialog와 aria-modal/label 연결 | snapshot에서 `dialog`, `aria-modal=true`, `aria-labelledby=modal-title` 확인 | 값 비교 | 접근성 snapshot·DOM | dialog node | 예 | pass |
| 2 | open 시 focus 이동·Tab trap | 첫 focusable element로 이동하고 배경으로 이탈하지 않음 | open 직후 activeElement는 trigger; focus cycle은 trigger→닫기 버튼→NextJS portal→body | 화면 관찰 | Playwright DOM | activeElement cycle | 아니오 | fail |
| 3 | Esc 닫기·focus restore | Esc로 dialog 제거 후 원래 trigger에 focus | Esc 후 dialog count 1, activeElement 복원 없음. 소스에는 `setOpen(false)` 버튼만 있고 Escape handler 없음 | 화면 관찰 | Playwright DOM·소스 | dialog/activeElement | 예 | fail |
| 4 | 검증 패널 | focus 전후와 닫힘 상태를 표시 | Footer Actual 고정 대기 문구, `불일치` | 화면 관찰 | 접근성 snapshot·소스 | `[검증]` Actual | 예 | fail |

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | high | G03 | focus cycle, Esc 키, trigger restore의 확인 절차와 초기 focus 조건을 구체화 |
| 데모 예제 | 예 | high | D01, D03 | 실제 focus management, Tab/Shift+Tab trap, Escape listener, trigger restore 구현 |
| 검증 | 예 | high | V01, V02, V03, V05 | semantics pass와 focus behavior fail을 분리하고 activeElement·dialog count를 표시 |
| 개념 정리 | 예 | high | C02, C03 | 실제 구현과 모순되는 “자동 이동·버그 제로·Esc 닫힘”을 제거하고 ARIA가 focus trap을 자동 제공하지 않음을 명시 |

#### 증거 파일

- 스크린샷: 별도 저장 없음. 접근성 snapshot에서 dialog와 두 버튼을 확인.
- Network·콘솔·서버 로그: page GET 200, 모달 조작은 local DOM만 변경하며 추가 요청 없음. 콘솔의 데모 오류 없음.
- 빌드·설정 산출물: `ArchA11yFocusTrapDemo.tsx`는 `useState(open)`과 click close만 있고 `useEffect`, `onKeyDown`, focus API가 없음. Next compile issues 0.

#### 종합 메모

- 최종 유형 검토 사항: `role=dialog` semantics는 pass이나 focus trap/Esc/restore 핵심은 fail인 화면 관찰형.
- 다른 데모와 공통화할 수 있는 부분: 접근성 snapshot과 activeElement cycle을 독립 증거로 기록.
- 개별 구현이 필요한 부분: focus trap hook 또는 dialog primitive, scroll lock과 restore lifecycle.

### architecture/compiler-optimization/react-compiler — React Compiler 자동 메모이제이션 최적화

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | 5-architecture/nextjs-compiler.md |
| 진입점 | apps/demo-baseline/src/app/zone/baseline/architecture/compiler-optimization/react-compiler/page.tsx |
| 대표 검증 유형 후보 | 산출물·설정 확인 |
| 실행 결과 | `mismatch` |
| 초기화 방법 | 새 URL 진입 후 러닝화, `+`, `동작 실행`; local log는 다음 URL 진입으로 초기화 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | 상품 선택 | `러닝화 (#001)` 클릭 | 실습 영역 | 예 | client state 변경 |
| 2 | `+`/`-` 수량 변경 | `+` 클릭 | 실습 영역 | 예 | 수량과 local log 변경 |
| 3 | `동작 실행` | 버튼 클릭 | 실습 영역 | 예 | local `API 트리거` 로그 추가 |
| 4 | 형제 UI 리렌더링 건너뜀 관찰 | 렌더 카운터·compiler output 확인 | 실습·빌드 | 아니오 | 카운터·memoized child·compiler 설정/산출물 없음 |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | React Compiler config | `reactCompiler` 또는 compiler 설정과 빌드 변환 | baseline `next.config.ts`에 `reactCompiler`와 `compiler` 없음; compile issues 0은 Compiler 활성화 증거가 아님 | 산출물·설정 확인 | 소스·Next MCP | config·compilation issues | 예 | fail |
| 2 | 리렌더링 최적화 | 수량 변경 시 안정된 child render count | component는 상품·수량·local log `useState`만 있고 child render counter/`React.memo`/측정값 없음 | 전후 변화 | 소스·화면 | 실습 component | 예 | fail |
| 3 | 동작 로그 | 자동 메모이제이션 handler가 실행 | `동작 실행`은 `addLog` local state 호출로 log만 추가 | 화면 관찰 | DOM·소스 | 실시간 도메인 로그 | 예 | fail |
| 4 | 검증 패널 | compiler 적용·render count 실제값 표시 | Actual 고정 대기 문구, `불일치` | 산출물·설정 확인 | 접근성 snapshot·소스 | `[검증]` Actual | 예 | fail |
| 5 | production transform | 빌드 산출물에서 compiler 변환 확인 | shared dev 서버에서 production build·bundle 분석을 수행하지 않음 | 외부 도구·환경 확인 | 빌드 환경 | production bundle | 아니오 | blocked-by-environment |

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | high | G02, G03 | compiler 활성화 config, render counter, production bundle 확인 위치와 build 조건을 명시 |
| 데모 예제 | 예 | high | D02, D03 | local state console을 실제 compiler fixture와 child render measurement로 교체 |
| 검증 | 예 | high | V01, V02, V03, V05 | config·render count·bundle evidence를 독립 행으로 표시 |
| 개념 정리 | 예 | high | C01, C02, C03 | 현재 데모가 Compiler를 증명하지 않음을 반영하고 0회·100% 제거, Next 16.3.2 기준을 명시 |

#### 증거 파일

- 스크린샷: 별도 저장 없음. 접근성 snapshot/Playwright에서 상품·수량·local log만 확인.
- Network·콘솔·서버 로그: page GET 200, 조작 후 추가 요청 없음. 콘솔의 데모 오류 없음.
- 빌드·설정 산출물: `next.config.ts`에 `reactCompiler`/`compiler` 없음; `get_compilation_issues`는 빈 배열. production bundle 검증은 blocked.

#### 종합 메모

- 최종 유형 검토 사항: compiler config·변환 산출물과 렌더 전후를 확인하는 산출물·설정 확인형. 현재 local state 변화만 pass 수준의 화면 변화.
- 다른 데모와 공통화할 수 있는 부분: 빌드 설정, bundle 증거, render counter를 분리한 검증 계약.
- 개별 구현이 필요한 부분: compiler-enabled isolated app와 memoization counter fixture.

### architecture/server-action-security/csrf-protection — Server Actions 자동 CSRF Origin 헤더 검증

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | 3-api-reference/3.5-config/3.5.1-next-config-js/serverActions.md |
| 진입점 | apps/demo-baseline/src/app/zone/baseline/architecture/server-action-security/csrf-protection/page.tsx |
| 대표 검증 유형 후보 | 외부 도구·환경 확인 |
| 실행 결과 | `mismatch` |
| 초기화 방법 | 새 URL 진입. Server Action form·서버 메모리 상태가 없어 별도 초기화 없음 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | Origin/Host 비교와 `allowedOrigins` 확인 | 화면의 정적 Origin 문구와 config 확인 | 소스·실습 | 아니오 | 실제 Server Action, POST form, request header가 없음 |
| 2 | 위조 Origin POST의 403 관찰 | malicious Origin POST endpoint를 찾음 | Network·서버 로그 | 아니오 | 호출할 Action endpoint와 악성 요청 harness가 없음 |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | Server Action POST | 정상 action 요청이 허용되고 request evidence가 표시 | `ArchServerActionCsrfDemo`는 정적 Origin/Host 문자열과 `200 OK Server Action RPC 실행` 문자열만 렌더링. button/form/action 없음 | 외부 도구·환경 확인 | 소스·접근성 snapshot | 실습 영역 | 예 | fail |
| 2 | 위조 Origin 차단 | 불일치 Origin 요청이 실행 전 403 | 실제 Action endpoint·POST request가 없어 검증 불가. 현재 페이지 GET은 200 | 값 비교 | Network·환경 | Action 요청 | 아니오 | unverifiable |
| 3 | allowedOrigins 설정 | proxy 도메인 허용 목록이 실제 config·현재 host와 일치 | baseline config fallback은 `localhost:3000`; dev zone은 3001. 다만 이를 확인할 Server Action 요청이 없음 | 산출물·설정 확인 | 소스·환경 | `next.config.ts` | 예 | fail |
| 4 | 검증 패널 | Origin/Host/status와 증거 위치 표시 | Footer Actual 고정 대기 문구, `불일치` | 외부 도구·환경 확인 | 접근성 snapshot·소스 | `[검증]` Actual | 예 | fail |

- 검증 불가 사유: 실제 Server Action과 악성 Origin POST endpoint가 없고, shared dev에서 임의 Action을 추가하지 않았다.
- 필요한 도구·환경: 실제 Server Action form, same-origin·mismatched Origin 요청 harness, 403 response와 서버 로그.
- 허용 가능한 간접 증거: config의 allowedOrigins와 실제 Action request headers/status. 정적 `200 OK` 문자열은 증거가 아님.
- 데모 재설계 필요 여부: 예. 정상·악성 요청을 분리한 실제 action fixture가 필요함.
- 기대 문구 축소 필요 여부: 예. “100% 원천 차단”과 암호화 Action ID 단정은 측정·기준 버전 범위를 명시해야 함.

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | high | G02, G03 | 정상/위조 Origin 요청, POST body, 403 status·서버 로그 확인 방법과 환경 조건을 추가 |
| 데모 예제 | 예 | high | D02, D03 | 정적 보안 문구를 실제 Server Action form·request harness로 교체 |
| 검증 | 예 | high | V01, V02, V03, V05 | 정상 200과 위조 403을 별도 비교하고 request header/status 증거 위치를 표시 |
| 개념 정리 | 예 | high | C01, C02, C03 | 실제 demo가 simulation이 아님을 반영하고 allowedOrigins·현재 port·Next 16.3.2 범위를 명시 |

#### 증거 파일

- 스크린샷: 별도 저장 없음. 접근성 snapshot에서 static Origin/Host 문구, 200 문자열, button/form 부재를 확인.
- Network·콘솔·서버 로그: 페이지 GET 200, Server Action POST 또는 malicious Origin 요청 없음. 콘솔의 데모 오류 없음.
- 빌드·설정 산출물: `next.config.ts`는 `serverActions.allowedOrigins: [process.env.PUBLIC_ORIGIN ?? 'localhost:3000']`; baseline current port 3001. target source에는 Action export/import 없음.

#### 종합 메모

- 최종 유형 검토 사항: request headers/status와 config를 확인하는 외부 도구·환경 확인형. 현재는 정적 문구만 있고 action boundary가 없음.
- 다른 데모와 공통화할 수 있는 부분: 정상·위조 요청의 method, Origin, Host, status, 서버 로그를 독립 항목으로 기록.
- 개별 구현이 필요한 부분: 실제 Server Action endpoint와 Origin mismatch 재현 harness.

### architecture/turbopack/incremental-harness — Turbopack 증분 빌드 및 핫 모듈 리로딩 가속

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | 3-api-reference/3.5-config/3.5.1-next-config-js/turbopack.md |
| 진입점 | apps/demo-baseline/src/app/zone/baseline/architecture/turbopack/incremental-harness/page.tsx |
| 대표 검증 유형 후보 | 산출물·설정 확인 |
| 실행 결과 | mismatch |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | Turbopack Rust 엔진 증분 컴파일 아키텍처 점검 및 next.config.ts turbopack 규칙/로더 설정 확인 | 페이지 진입, 조작 요소 없음 | 실습 영역 | 아니오 | 조작 요소가 전혀 없고, `next.config.ts`에도 확인할 `turbopack` 필드가 없음 |
| 2 | 10ms 이내 초고속 HMR 성능 관찰 | "8ms" 고정 텍스트 확인 | 실습 영역 | 아니오(관찰만 가능, 실제 코드 수정·HMR 트리거 불가) | 실제 파일을 수정해 HMR을 트리거하는 절차가 데모 안에 없음 |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | `next.config.ts`의 `turbopack` 필드 존재 여부 | 커스텀 로더/규칙 설정 존재 | `apps/demo-baseline/next.config.ts`에 `turbopack` 필드 없음(AGENTS.md 8번 규칙에 따라 Turbopack은 기본 활성화 상태이지만 커스텀 설정은 없음) | 산출물·설정 확인 | 소스 코드 | `apps/demo-baseline/next.config.ts` | 예 | fail |
| 2 | "8ms" HMR 수치가 실측값인지 여부 | 실제 파일 변경에 대한 HMR 응답 시간 측정값 | `ArchTurbopackHmrDemo.tsx`는 정적 JSX 텍스트 `"증분 HMR 갱신 시간: 8ms"`만 렌더링하며 어떤 측정 로직도 없음 | 값 비교 | 소스 코드 | `components/ArchTurbopackHmrDemo.tsx` 1–12행 | 예 | fail |
| 3 | dev 서버가 실제로 Turbopack을 사용하는지(참고 사실 확인) | Next.js 16 기본값상 Turbopack 사용 | 이 자체는 프로젝트 아키텍처 규칙(AGENTS.md 8번)과 Next.js 16 기본 동작상 참으로 추정되나, 이 데모 화면에서 그 사실을 확인할 장치는 없음(HMR 로그, 컴파일 시간 등 실측 UI 부재) | 산출물·설정 확인 | 프로젝트 규칙 문서 | `nextjs-app/AGENTS.md` 8번 항목 | 아니오 | unverifiable |

- 검증 불가 사유(#3): 데모 화면에 실제 컴파일 시간이나 HMR 이벤트 로그를 노출하는 장치가 없어, Turbopack이 실제로 동작 중이라는 사실 자체는 신뢰할 수 있으나 "이 데모를 통해" 확인할 방법이 없음
- 필요한 도구·환경: 개발 서버 터미널 로그(컴파일 시간 표시) 또는 Next DevTools MCP `get_compilation_issues`/컴파일 시간 지표
- 허용 가능한 간접 증거: 개발 서버 시작 로그에 "Turbopack"이 표기되는지 확인하는 정도
- 데모 재설계 필요 여부: 예
- 기대 문구 축소 필요 여부: 예

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | high | G02 | "확인" 대상(turbopack 규칙/로더 설정)이 실제로는 존재하지 않고, 관찰 위치도 조작 불가능한 정적 텍스트를 가리킴 |
| 데모 예제 | 예 | high | D02 | 실제 HMR 이벤트를 측정하려면 서버 사이드에서 실제 컴파일 시간을 계측해 전달하거나(Next DevTools MCP의 `compile_route` 활용 가능), 최소한 "이 수치는 예시이며 실측이 아니다"라고 명시해야 함 |
| 검증 | 예 | high | V01, V02 | 공통 결함 + 하드코딩 수치를 실제값처럼 제시 |
| 개념 정리 | 예 | high | C01 | "10ms 이내", "0ms" 등 실측 근거 없는 정량 주장 반복(playbook 5절 위반) |

#### 증거 파일

- 스크린샷: `nextjs-app/docs/planning/evidence-claude/241-turbopack-static-8ms.png`
- Network·콘솔·서버 로그: 해당 없음(조작 요소가 없어 이벤트 발생 자체가 없음).
- 빌드·설정 산출물: `apps/demo-baseline/next.config.ts` 전문. `nextjs_call get_compilation_issues`로 baseline 서버 컴파일 이슈 0건 확인(HMR 자체의 정상 동작과는 별개 사실).

#### 종합 메모

- 최종 유형 검토 사항: Turbopack 성능은 실제로 Next DevTools MCP의 `compile_route`(컴파일 시간 측정)를 활용하면 정직한 "산출물·설정 확인" 또는 "외부 도구·환경 확인"형으로 재구성할 수 있다 — 실제 도구가 이미 이 프로젝트에 연결되어 있으므로 구현 난이도는 낮음.
- 다른 데모와 공통화할 수 있는 부분: 공통 발견 2번, 3번.
- 개별 구현이 필요한 부분: 실제 컴파일 시간 계측 로직, 또는 최소한 "예시 수치" 라벨링.

## B21-B25 공통 발견

### B21·B23·B25 공통 발견 (201–210·221–230·241, Claude 담당)

1. **[검증] 패널이 21개 데모 전부에서 구조적으로 고장나 있다(최우선 수정 대상, high).** 21개 `page.tsx` 전부가 `<VerificationFooter />`를 **props 없이** 렌더링한다(`grep`으로 전수 확인). `VerificationFooter`의 `isMatched`는 `status`/`isLoaded`/`logs`/`count` 등 어떤 prop도 받지 못하면 `undefined`로 남고, 이때 `actualContent`는 고정 문구 `"인터랙션 대기 중…"`이 된다. 그런데 이 고정 문구는 `ExpectedActualPanel`에 `expected`(다른 고정 문구)와 함께 전달되고, `ExpectedActualPanel`은 `isMatched`가 `undefined`이면 두 문자열을 `.trim()` 비교하는 `autoMatched` 로직으로 폴백한다. 서로 다른 두 고정 문자열이므로 이 비교는 **항상 `false`**가 되어, 21개 데모 전부가 **사용자가 가이드를 정확히 따라도 상시 빨간색 "불일치" 배지를 표시**한다. 이는 [데모 검증 유형 분석 및 개선 설계](../17-demo-verification-type-design.md) 6절의 "고정 성공 문구나 근거 없는 통과 배지를 표시한다"(V02)에 해당하며, 실제로는 "실패 배지를 근거 없이 표시"하는 반대 방향의 동일 결함이다. B01에서 이미 이 계열 문제가 218/241건 규모로 보고됐는데, B21/B23/B25는 그중에서도 **모든 항목이 최댓값(21/21)**으로 나타난 배치다. 수정 방향: 각 `DirectiveXxxDemo`/`ConfigXxxDemo` 컴포넌트가 실제 상태(예: Network 상태 코드, 로컬스토리지 값, 캐시 HIT/MISS)를 상위 `page.tsx`와 공유하도록 상태 리프팅 또는 컨텍스트를 도입하고, `<VerificationFooter isMatched={...} actual={...} />` 형태로 실제 값을 전달해야 한다.

2. **B23 config 데모 10개 중 9개가 next.config.ts에 실제로 없는 설정을 있는 것처럼 시연한다(high).** `apps/demo-baseline/next.config.ts`와 `apps/demo-cache-components/next.config.ts`를 전문 확인한 결과 두 파일에 선언된 필드는 `assetPrefix`, `images.unoptimized`, `experimental.serverActions`, (cache zone만) `cacheComponents: true`뿐이다. `images.remotePatterns`, `images.formats`, `logging`, `devIndicators`, `env`, `crossOrigin`, `poweredByHeader`, `experimental.cacheLife`, `experimental.cacheHandlers`, `turbopack` 필드는 **전부 부재**한다. 그런데도 221–227, 229–230, 241의 데모 예제 컴포넌트는 하나의 동일한 "이커머스 상품 선택 → 수량 조절 → 동작 실행 → 로그 출력" 템플릿(파일당 정확히 101줄, `쇼핑몰 세션 초기화: 장바구니 활성화됨 (KRW)` 로그로 시작)을 복사-붙여넣기해 사용하며, 실제 해당 config 필드나 그 효과를 코드 어디에서도 참조하지 않는다. `poweredByHeader`(227)는 `curl -D -`로 `X-Powered-By: Next.js` 헤더가 여전히 존재함을, `crossOrigin`(226)은 모든 `<script>` 태그에 `crossorigin` 속성이 없음을 직접 반증할 수 있어 가장 심각하다 — 학습자가 "보안 설정을 켰다"고 오인할 위험이 있다.

3. **런타임에 토글할 수 없는 빌드/설정 타임 옵션을 "동작 실행 버튼을 누르면 즉시 반영"되는 것처럼 그리는 UX 패턴이 반복된다(medium~high).** `devIndicators`(224), `env`(225), `crossOrigin`(226), `poweredByHeader`(227), `cacheLife`/`cacheHandlers`(229/230), `turbopack`(241)은 모두 `next.config.ts` 수정 후 dev 서버 재시작이 필요한 설정인데, 데모는 "상품 선택 → 동작 실행"이라는 런타임 인터랙션 프레임을 강제로 씌워놓았다. 이 프레임 자체가 API의 성격과 맞지 않으므로, 유형 재설계 시 이런 데모군을 위한 별도 "산출물·설정 확인 전용" 정적 템플릿(코드 스니펫 + 실제 응답/HTML 대조) 신설을 권고한다.

4. **`architecture/`, `functions/`(taint, server-runtime, use-report-web-vitals, use-server-inserted-html), `directives/use-server/inline-action-closure`, `directives/use-cache/*` 총 9개 데모는 소스 코드 수준에서 대상 API를 전혀 호출하지 않는다(high, D02).** 이 중 2건(`inline-action-closure`, `directives/use-cache/function-cache`)은 소스 주석에 `// Simulate ...`, `// Simulated ...`가 그대로 남아 있어 **작성자 스스로 시뮬레이션임을 인지하고 있었다는 정황 증거**다. `AGENTS.md`(nextjs-app) 24번 규칙("가짜 시뮬레이션을 엄격히 금지")을 정면으로 위반하는 사례이며, B01에서 검증된 동일 zone의 정상 데모(`caching/basic`, `server-actions/basic`)와 나란히 비교하면 구현 편차가 매우 크다.

5. **소수지만 완전히 정상 작동하는 데모도 존재한다(206, 207, 205의 데모 예제 부분).** `directives/use-client/window-storage-access`는 실제 `localStorage` 읽기/쓰기/새로고침 후 유지가 재현됐고, `directives/use-server/file-level-action`은 실제 Server Action `POST 200` 네트워크 요청과 정확한 할인 계산(189,000원 → 170,100원)이 확인됐다. `directives/use-client/boundary-declaration`도 실제 클라이언트 상태(`useState`)와 이벤트 바인딩이 정상 동작한다. 이 3개는 [검증] 패널 배선만 고치면 즉시 `verified`로 전환 가능한 저비용 우선순위 후보다.

6. **`config/cache-components/enable-flag`(228)는 배치 내 유일하게 "설정 자체는 실제로 참"인 특수 사례다.** `apps/demo-cache-components/next.config.ts`에 `cacheComponents: true`가 실제로 선언되어 있으나(cache zone 전체가 이 값에 의존), 인터랙티브 데모 컴포넌트는 209/210과 동일한 가짜 템플릿을 사용해 이 사실을 전혀 시연하지 못한다. "설정 확인"과 "데모 예제 재작성"을 분리해 처리하면 다른 9개 config 데모보다 수정 비용이 낮다.

7. **`get_compilation_issues`(Next DevTools MCP) 기준으로 baseline·cache 두 서버 모두 컴파일 오류 0건.** 위 모든 `mismatch` 판정은 빌드 실패나 런타임 예외가 아니라 **콘텐츠 신뢰성(내용이 사실과 다름)** 문제이므로, 수정 우선순위를 잡을 때 "빌드가 깨진 데모"와 "그럴듯하게 작동하지만 거짓을 보여주는 데모"를 구분해서 다뤄야 한다 — 후자가 실제로는 더 위험하다(특히 2번, 227).

### B22·B24 공통 발견 (211–220·231–240, Codex 담당)

- 집계: `verified` 0개, `mismatch` 20개, `unverifiable` 0개, `execution-error` 0개, `blocked-by-environment` 0개. 개별 검증 항목에는 `unverifiable` 3개와 `blocked-by-environment` 6개가 있으며, 데모 전체의 mismatch 원인을 구성한다. 최고 심각도 `high` 데모는 20개다.
- B22/B24의 20개 진입점은 모두 dev에서 200으로 렌더링됐고 Next DevTools `get_compilation_issues`는 두 zone 모두 빈 배열이었다. 따라서 이번 결과는 서버 실행 장애가 아니라 기대 기능과 실제 구현 경계의 불일치다.
- 대부분의 데모가 설명용 정적 JSX 또는 공통 이커머스 `useState` 콘솔로 핵심 Next.js 기능을 대체한다. remote cache, config redirects/rewrites/headers, output, Edge runtime, React Compiler, Server Actions는 실제 경계를 통과하는 요청·빌드·서버 증거가 없다.
- 20개 모두 `<VerificationFooter />`를 props 없이 호출한다. Expected는 사양 문구이고 Actual은 조작 뒤에도 고정 `인터랙션 대기 중`이므로 `ExpectedActualPanel`의 자동 비교가 `불일치`를 표시한다. 이는 V01, V02, V03, V05의 반복 패턴이다.
- config 계열의 실제 설정은 zone 통합용 `assetPrefix`와 `cacheComponents`뿐이다. baseline manifest의 `basePath`는 빈 문자열, `headers`는 빈 배열, `trailingSlash`는 null, custom redirects/rewrites는 없고, `.next/standalone`·`out`도 없다.
- 외부 환경이 필요한 주장은 현재 dev 포트에서 확인 가능한 것과 분리해야 한다. CDN·cross-zone·Edge 배포·production build·Redis·CSRF 위조 요청은 외부 origin, 배포 runtime, build job, 저장소 또는 request harness가 없으면 blocked/unverifiable로 기록해야 하며, local UI 문구를 성공 증거로 재사용하면 안 된다.
- 우선 수정 대상(P1)은 217 cross-zone-proxy, 233 standalone-container, 234 export-static-spa, 235/236 Edge runtime, 239 React Compiler, 240 CSRF처럼 별도 환경 없이는 학습 목표를 검증할 수 없는 데모다. 그 다음으로 213–220 config 데모의 실제 config·manifest·HTTP evidence 연결과 211/212/231/232 cache demo의 runtime/cache signal을 복원해야 한다.
- 접근성에서는 form demo의 초기 `aria-invalid`·`aria-describedby`·`role=alert` 연결은 확인됐지만 유효한 16자리 입력 뒤에도 오류가 유지된다. modal demo는 ARIA semantics만 있고 focus trap, Escape close, trigger focus restore가 동작하지 않는다.
- 정량 표현 `0ms`, `100%`, `80%`, `90%`, `무한 확장`, `완벽한 보안`은 이번 실행에서 측정되지 않았다. 각 문구를 실제 측정값·환경 범위로 바꾸거나 검증 불가 범위를 명시해야 한다.
