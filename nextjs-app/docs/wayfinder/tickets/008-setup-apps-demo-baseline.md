# [T08] apps/demo-baseline 앱 생성 및 Server Actions 배관 데모 구현

- **라벨**: `wayfinder:task`
- **상위 지도**: [Wayfinder Map](../map.md)
- **상태**: Blocked
- **선행 티켓**:
  - [T03. 배관 증명 데모 2종의 상세 인터랙션 및 검증 시나리오 설계](./003-design-plumbing-proof-demos-spec.md)
  - [T05. @study/demos 패키지 구성 및 유효성 검사기 구현](./005-setup-packages-demos.md)
  - [T06. @study/ui 및 @study/docs-render 패키지 구현](./006-setup-shared-ui-and-render-packages.md)
- **차단 중**:
  - [T10. 로컬 및 Vercel 배포 종합 배관 검증 통과](./010-verify-local-and-deployment-plumbing.md)

## Question

기준선 설정 zone인 `apps/demo-baseline`(`@study/demo-baseline`, 포트 3001)을 생성하고, 배관 증명용 Server Actions 데모를 구현한다.

### 작업 목록
1. **앱 초기화 및 설정**:
   - 포트 3001 고정 (`"dev": "next dev --port 3001"`)
   - `next.config.ts`:
     - `assetPrefix: '/demo-static/baseline'`
     - `images: { unoptimized: true }`
     - `serverActions.allowedOrigins: ['localhost:3000', process.env.PUBLIC_ORIGIN]`
2. **Tailwind CSS v4 연동**:
   - `globals.css`에 `@source "../../../../packages/ui"` 지정
3. **데모 라우트 구현**:
   - `src/app/zone/baseline/server-actions/basic/page.tsx`
   - Server Action 호출(폼 제출, 비동기 mutation) 및 응답 렌더링
   - 동적 높이 변화 시 iframe 리사이즈 브릿지 동작 확인
   - 기대/실제 패널에 Server Action 성공 결과 표시
