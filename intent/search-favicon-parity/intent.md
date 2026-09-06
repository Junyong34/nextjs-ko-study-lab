Intent: 구글 검색 결과 사이트 아이콘을 브라우저 파비콘 디자인과 일치
Author: devpark
Status: done
Approval: 사용자 승인 (2026-09-06 대화 메시지, 통합 intent·plan 동시 승인)

## Problem

구글 검색 결과에서 `learn-nextjs-lab.space`의 사이트 아이콘은 검은 원 안에 흰색 "N" 글자 하나로 표시된다.
반면 브라우저 탭의 파비콘은 검은 둥근 사각형 안에 흰 책과 `< / >` 코드 기호가 그려진 디자인이다.
두 곳의 아이콘이 서로 달라 브랜드 인상이 일관되지 않는다.

원인: 페이지 `<head>`에는 아이콘 후보가 두 개 선언된다.
- `rel="icon"` → `nextjs-app/apps/shell/src/app/icon.svg` (책 + 코드 디자인)
- `rel="apple-touch-icon"` → `nextjs-app/apps/shell/src/app/apple-icon.tsx`가 생성하는 180×180 PNG ("N" 글자)

구글은 여러 후보 중 자체 기준으로 하나를 고르며, 48px 배수의 충분히 큰 비트맵을 선호한다. 현재 검색 결과는 180px PNG인 apple-touch-icon을 사용하고 있다(2026-09-06 검색 결과 스크린샷으로 확인).

## Proposed outcome

구글 검색 결과의 사이트 아이콘이 브라우저 파비콘과 같은 책 + 코드 디자인으로 표시된다.
어떤 후보를 고르더라도 같은 디자인이 나오도록, 사이트가 선언하는 모든 아이콘 후보가 동일한 도형을 사용한다.

## Affected users and systems

- 사용자: 구글 검색으로 유입되는 방문자, iOS 홈 화면에 사이트를 추가한 사용자
- 시스템: `nextjs-app/apps/shell/src/app/apple-icon.tsx`, `nextjs-app/docs/07-seo-plan.md` 아이콘 행

## Constraints

- 반드시 지킬 것:
  - `icon.svg`의 기존 계약(64×64 viewBox, `id="book"`, `id="code"`, 텍스트 없음)을 유지한다. `20-shell-favicon-contract.test.ts`가 이를 검증한다.
  - apple-touch-icon은 투명 영역 없이 배경이 꽉 찬 정사각형이어야 한다(iOS와 구글이 각자 모서리를 자른다).
- 범위 밖:
  - 웹 앱 매니페스트(`manifest.ts`) 추가, PWA 아이콘 세트 구성
  - 구글 재크롤링 요청 자동화. 반영은 구글 재크롤링에 따르며 며칠 걸릴 수 있다.

## Requirements

1. `apple-icon.tsx`가 생성하는 180×180 PNG는 `icon.svg`와 같은 책 + 코드 도형을 그린다. "N" 글자 텍스트는 제거한다.
2. 배경색은 `icon.svg`와 같은 `#09090B`, 도형은 `#FFFFFF`로 캔버스 전체를 채운다(둥근 모서리 없음).
3. 도형은 원형으로 잘려도 잘리지 않도록 캔버스 중앙에 약 70~75% 크기로 배치한다.
4. `icon.svg`의 `<link rel="icon">` 선언과 기존 파비콘 계약 테스트는 그대로 통과한다.

## Design

- `apple-icon.tsx`의 `ImageResponse` JSX 안에서 `<div>` 텍스트 대신 인라인 `<svg viewBox="0 0 64 64">`로 `icon.svg`의 `book`/`code` path를 렌더링한다. satori는 인라인 SVG 요소를 지원한다.
- 배경은 바깥 `<div>`가 `#09090B`로 채우고, 안쪽 SVG는 130px(180의 72%) 크기로 중앙 정렬한다. `rect` 배경은 SVG에 넣지 않는다.
- path 데이터는 `icon.svg`에서 그대로 복사한다. `icon.svg`는 정적 파일이어야 하므로 도형 공유 모듈은 만들지 않고, 두 파일이 같은 path를 갖는지 테스트로 묶는다.

## Acceptance criteria

- [x] 로컬 실행 후 `/apple-icon` PNG를 열었을 때 검은 배경 위에 책 + 코드 도형이 보이고 "N" 글자가 없다.
- [ ] 배포 후 프로덕션 `<head>`의 `apple-touch-icon` href 응답이 같은 이미지다.
- [x] `20-shell-favicon-contract.test.ts`가 통과한다(기존 케이스 + apple-icon 케이스).
- [x] `pnpm --filter @study/shell check-types`가 통과한다.
- [ ] (사후 관찰) 구글 재크롤링 후 검색 결과 아이콘이 책 + 코드 디자인으로 바뀐다. 즉시 검증 불가하므로 완료 조건이 아닌 후속 관찰 항목으로 둔다.

## Open questions

- 구글이 SVG `rel="icon"`을 직접 쓰게 하려면 48px 배수의 PNG `icon`을 추가로 선언하는 방법도 있다(`generateImageMetadata`로 96/192px 생성). 이번에는 apple-icon 디자인 통일만으로 충분하다고 보고 범위에서 제외했다(승인 시 사용자 선택). 반영 후에도 다른 디자인이 보이면 후속 intent로 다룬다.
