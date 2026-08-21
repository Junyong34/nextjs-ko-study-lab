# [T10] 로컬 및 Vercel 배포 종합 배관 검증 통과

- **라벨**: `wayfinder:task`
- **상위 지도**: [Wayfinder Map](../map.md)
- **상태**: Blocked
- **선행 티켓**:
  - [T07. apps/shell 앱 생성 및 라우팅/rewrites 결합](./007-setup-apps-shell.md)
  - [T08. apps/demo-baseline 앱 생성 및 Server Actions 배관 데모 구현](./008-setup-apps-demo-baseline.md)
  - [T09. apps/demo-cache-components 앱 생성 및 Caching 배관 데모 구현](./009-setup-apps-demo-cache-components.md)

## Question

로컬 환경 및 Vercel 배포 환경에서 멀티존 결합 아키텍처의 모든 함정 체크리스트([03. 6-1], [01. 5절])를 검증하고 최종 통과 판정을 획득한다.

### 검증 체크리스트
1. **로컬 무결성 검증**:
   - `pnpm install`이 워크스페이스 루트에서 오류 없이 1회에 완료되는가?
   - `pnpm dev` 실행 시 shell(3000), baseline(3001), cache(3002)가 동시에 뜨는가?
   - `http://localhost:3000`에서 문서 및 문서 내 인라인 데모가 정상 로드되는가?
   - `turbo build` 및 `turbo check-types`가 전체 패키지에서 성공하는가?
2. **배포 환경 함정 검증 ([03. 6-1])**:
   - `outputFileTracingRoot` 정상 작동 (배포 산출물에서 md 문서 정상 렌더링)
   - `assetPrefix` 및 rewrites 정상 작동 (CSS/JS 정적 자산 404 없음)
   - `serverActions.allowedOrigins` 정상 작동 (Server Action 호출 성공)
   - iframe 높이 브릿지 및 기대/실제 패널 `✓` 정상 표시
