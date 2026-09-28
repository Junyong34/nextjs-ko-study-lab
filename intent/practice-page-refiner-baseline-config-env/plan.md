Plan: baseline 설정·환경변수·server-only 실습 3개 재구성
Status: done
Approval: 2026-09-21 대화 승인(intent.md와 동일 대화).

## 실제 검증 결과

- **`config/powered-by-header/hide-x-powered`(REBUILD)**: `next.config.ts`에 `poweredByHeader: false` 실제 반영. 실습화면이 자기 자신을 `fetch()`해 `x-powered-by` 헤더 부재를 실측. `tsc`·`next build` 통과, curl로 헤더 부재 확인.
- **`guides/environment-variables/public-vs-server`(REBUILD)**: `.env` 신규(`NEXT_PUBLIC_STORE_NAME`, `INTERNAL_ADMIN_EMAIL`). Server Action + 클라이언트 `useEffect` 읽기로 노출 범위 비교. **구현 중 발견한 버그**: `'use client'` 컴포넌트도 최초 SSR 시 서버에서 실행되므로 렌더 본문에서 바로 `process.env`를 읽으면 서버 전용 값이 초기 HTML에 새어 나감 — `useEffect`로 옮겨 해결(수정 전/후 curl로 직접 확인). `tsc`·`next build` 통과, 빌드 산출물 전체에 시크릿 없음 확인.
- **`guides/data-security/server-only-guard`(IMPROVE)**: 기존 Server Action + `server-only` 골격 유지, 검증을 "응답 JSON에 시크릿 없음"에서 "실제 클라이언트 JS 번들 청크를 fetch해 시크릿 접두사 없음"으로 교체. 개념 정리의 잘못된 파일 경로도 정정. `tsc`·`next build` 통과, 빌드 산출물 전체에 시크릿 없음 확인.
- 공통: `pnpm --filter @study/demos lint`/`build` 통과, `demos.yaml` 세 항목 `stub → done` 전환, 매니페스트 재생성.
- **남은 문제**: 없음. 다만 작업 중 demo-baseline(포트 3001)에서 동시에 활동 중인 다른 세션/프로세스의 흔적을 발견함(대상 2 리셋 버그가 이 세션이 손대지 않은 사이 수정됨) — 내용은 정확했으나 참고로 기록.

## Steps

1. **`config/powered-by-header/hide-x-powered` (REBUILD)**
   - `nextjs-app/apps/demo-baseline/next.config.ts`에 `poweredByHeader: false` 추가.
   - 실습화면: 클라이언트에서 현재 페이지 자기 자신을 `fetch()`해 응답 헤더의 `x-powered-by` 존재 여부를 실측 확인하는 버튼 + 결과 표시.
   - `VerificationFooter`: 실측 헤더 부재 여부로 `isMatched` 계산.

2. **`guides/environment-variables/public-vs-server` (REBUILD)**
   - `nextjs-app/apps/demo-baseline/.env` 신규: `NEXT_PUBLIC_STORE_NAME`, `INTERNAL_ADMIN_EMAIL`(데모용 가짜 값, 주석으로 비밀 아님을 명시).
   - Server Component가 두 값을 모두 읽어 표시, Client Component가 같은 두 키를 읽어 표시(서버 전용 값은 `undefined`로 나와야 함).
   - `VerificationFooter`: 서버 쪽 두 값 존재 + 클라이언트 쪽 서버 전용 값 `undefined` 실측으로 `isMatched` 계산.

3. **`guides/data-security/server-only-guard` (IMPROVE)**
   - 기존 Server Action(`syncOrderAction`) 골격 유지.
   - 실습화면에 "번들 유출 스캔" 버튼 추가: 현재 페이지의 `<script>` 리소스(또는 `performance.getEntriesByType('resource')`)를 수집해 각 청크를 `fetch()`, 텍스트에 시크릿 문자열이 있는지 검사.
   - `VerificationFooter`/`DemoDeepDiveCard`: 실제 파일 경로(`lib/orderSyncSecret.ts`)로 예시 정정, `server-only`가 막는 대상이 "클라이언트 번들 유입"임을 번들 스캔 결과로 설명.

### 공통
- `DemoResetButton` 3개 모두 추가.
- 새 의존성 없음, 파일당 250줄 제한.

## Verification

- 각 데모: `pnpm --filter demo-baseline check-types`, `pnpm --filter demo-baseline build` 통과.
- `powered-by-header`: curl로 실제 응답 헤더에 `x-powered-by` 없음을 직접 확인.
- `environment-variables`: 서버 렌더 HTML과 클라이언트 콘솔/화면에서 서버 전용 값이 클라이언트 쪽에만 없는지 직접 확인.
- `server-only-guard`: 실제 번들 스캔 결과(시크릿 미포함) 확인.
- `pnpm --filter @study/demos lint && pnpm --filter @study/demos build`로 매니페스트 재생성.
- 완료 후 `demos.yaml` 세 항목 `stub → done`, intent/plan 문서 done 전환, `intent/README.md` 인덱스 갱신.
- 검증하지 못한 항목은 최종 보고에 명시.
