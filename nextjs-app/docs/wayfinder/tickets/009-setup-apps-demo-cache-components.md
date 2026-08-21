# [T09] apps/demo-cache-components 앱 생성 및 Caching 배관 데모 구현

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

Next.js 16 캐시 컴포넌트 zone인 `apps/demo-cache-components`(`@study/demo-cache-components`, 포트 3002)를 생성하고, 배관 증명용 `use cache` 데모를 구현한다.

### 작업 목록
1. **앱 초기화 및 설정**:
   - 포트 3002 고정 (`"dev": "next dev --port 3002"`)
   - `next.config.ts`:
     - `cacheComponents: true` (최상위 설정)
     - `assetPrefix: '/demo-static/cache'`
     - `images: { unoptimized: true }`
     - `serverActions.allowedOrigins: ['localhost:3000', process.env.PUBLIC_ORIGIN]`
2. **Tailwind CSS v4 연동**:
   - `globals.css`에 `@source "../../../../packages/ui"` 지정
3. **데모 라우트 구현**:
   - `src/app/zone/cache/caching/basic/page.tsx`
   - `'use cache'` 지시자 적용 함수와 `cacheTag('caching-basic:data')` 호출
   - Server Action에서 `revalidateTag('caching-basic:data')` 호출 시 캐시 무효화 동작 검증
   - 기대/실제 패널에 새로고침 시 타임스탬프 유지 여부 판정 표시
