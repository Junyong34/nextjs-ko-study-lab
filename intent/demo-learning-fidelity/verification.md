# 실습 5개 개선 검증 기록

## 실행한 검증

- `pnpm --filter @study/demo-baseline check-types`: 통과
- `pnpm --filter @study/demos lint`: 통과. 기존 캐시 태그 경고 26건이 남아 있음
- `pnpm test:manifest`: 통과. 240개 등록, 240개 경로·매니페스트 일치
- `pnpm test:guide`: 통과. GC05 누수 0건
- `24-demo-learning-fidelity.test.ts`: 통과. 카드 입력 경계값 7건
- `git diff --check`: 통과

## 브라우저 확인

- Form: 실제 `next/form` GET 제출, 일치·빈 검색·0건·공백 검색, 메모 유지, 새로고침 초기화를 확인했다.
- 병렬 라우트: 실제 `@analytics/details` 이동에서 team 메모가 유지되고, 새로고침에서 team·children의 `default.tsx`가 표시되는 것을 확인했다. 기존 `independent-tabs`, `conditional-slot` 진입에도 404와 부모 가이드 중복이 없었다.
- 접근성 폼: 빈 값, 15자리, 16자리, 17자리, 문자 포함, 구분자 입력과 초기화를 확인했다. `aria-invalid`, `aria-describedby`, label 연결이 결과에 맞게 바뀌었다.
- CSRF: 정상 Server Action은 200으로 실행됐고, Origin만 `https://csrf-demo.invalid`로 바꾼 요청은 Next.js에서 500과 `Invalid Server Actions request`로 차단됐다. 원래 Origin으로 복구한 요청은 다시 200이었다. 차단 요청에는 액션 도달 로그가 없었다.
- Turbopack: 저장소가 필요한 로컬 실습이라는 사용자 요청에 따라 페이지·등록 항목을 제거했다. 관련 문서에는 브라우저 데모 불가로 기록했다.
- Playwright 콘솔 오류: 네 페이지의 새로고침·조작 시 예상 밖 오류가 없었다. 의도적으로 Origin을 바꾼 CSRF 요청은 프레임워크 오류 로그를 남긴다.

## 미통과 또는 미실행

- `pnpm test:tier1`: 기존 DemoIndexToolbar·DemoEmptyState 계약 2건과 UI 설계 문서의 기존 반응형·DemoBackButton 계약 1건이 실패했다. 이번 네 페이지 변경과 무관하다. 새 카드 입력 계약은 통과했다.
- `pnpm --filter @study/demo-baseline build`, `pnpm --filter @study/shell build`: 샌드박스의 Turbopack CSS worker 로컬 포트 바인딩 제한으로 실패했다. baseline은 별도로 Google Fonts 네트워크 접근 제한도 확인됐다. 배포 전 정상 환경에서 재실행해야 한다.
- 실제 스크린 리더 음성 출력은 확인하지 않았다. DOM·키보드 흐름 검증 범위로 제한한다.
