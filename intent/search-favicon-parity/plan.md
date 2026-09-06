Plan: 구글 검색 결과 사이트 아이콘을 브라우저 파비콘 디자인과 일치
Spec: ./intent.md#requirements
Author: devpark
Status: approved
Approval: 사용자 승인 (2026-09-06 대화 메시지, 통합 intent·plan 동시 승인)

## Scope of change

- `nextjs-app/apps/shell/src/app/apple-icon.tsx` — "N" 텍스트를 `icon.svg`와 같은 책 + 코드 도형(인라인 SVG)으로 교체
- `nextjs-app/packages/test-suite/src/tier1-feature-coverage/20-shell-favicon-contract.test.ts` — apple-icon 소스가 텍스트 대신 `book`/`code` path를 포함하고, `icon.svg`의 모든 path를 공유하는지 검증하는 케이스 추가
- `nextjs-app/docs/07-seo-plan.md` — 아이콘 행에 "두 아이콘은 같은 도형을 사용" 메모
- `intent/README.md` — 작업 인덱스 상태 갱신

## Steps

1. `apple-icon.tsx`의 `ImageResponse` JSX를 바깥 `<div>`(배경 `#09090B`, flex 중앙 정렬) + 안쪽 `<svg viewBox="0 0 64 64" width={130} height={130}>`로 바꾸고, `icon.svg`의 `book` path 2개, 책 가운데 가로선, `code` stroke path를 그대로 옮긴다.
2. `20-shell-favicon-contract.test.ts`에 apple-icon 계약 케이스를 추가한다.
3. `nextjs-app/docs/07-seo-plan.md` 아이콘 행을 갱신한다.
4. 로컬 dev 서버에서 `/apple-icon` 응답 PNG를 열어 육안 확인한다.
5. 인덱스 상태를 갱신하고 구현 PR을 만든다.

## Verification

- 테스트: 저장소 루트에서
  `node --test --experimental-strip-types --disable-warning=ExperimentalWarning nextjs-app/packages/test-suite/src/tier1-feature-coverage/20-shell-favicon-contract.test.ts`
- 타입 검사: `pnpm --filter @study/shell check-types`
- 수동 확인: dev 서버 실행 후 `/apple-icon`을 열어 검은 배경 + 책/코드 도형, "N" 없음 확인.
- 배포 후: 프로덕션 `<head>`의 `apple-touch-icon` href를 열어 같은 이미지인지 확인.
- 사후 관찰: 구글 검색 결과 아이콘 변경 여부. Search Console에서 홈 URL 색인 재요청 가능(수동, 범위 밖).

## Rollback

`apple-icon.tsx` 한 파일을 되돌리면 이전 "N" 아이콘으로 복귀한다. 데이터·설정 변경 없음.

## Verification results

- 상태: 로컬 검증 통과, 배포·사후 관찰 미실행
- 실행 명령·환경 / 결과 / 증거(2026-09-06, macOS 로컬):
  - `node --test --experimental-strip-types --disable-warning=ExperimentalWarning nextjs-app/packages/test-suite/src/tier1-feature-coverage/20-shell-favicon-contract.test.ts`: 4/4 통과 (기존 2 + apple-icon 2)
  - `pnpm --filter @study/shell check-types`: 오류 없이 통과
  - 로컬 dev 서버(`http://localhost:3000/apple-icon`) 응답: 180×180 PNG, 검은 배경 위 책 + 코드 도형, "N" 없음 (육안 확인)
- 실패·미검증 항목과 후속 작업:
  - 배포 후 프로덕션 `apple-touch-icon` 응답 확인
  - 구글 재크롤링 후 검색 결과 아이콘 변경 관찰. 필요 시 Search Console에서 홈 URL 색인 재요청
