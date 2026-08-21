# [T03] 배관 증명 데모 2종의 상세 인터랙션 및 검증 시나리오 설계

- **라벨**: `wayfinder:grilling`
- **상위 지도**: [Wayfinder Map](../map.md)
- **상태**: Open (Frontier)
- **차단 중**:
  - [T08. apps/demo-baseline 앱 생성 및 Server Actions 배관 데모 구현](./008-setup-apps-demo-baseline.md)
  - [T09. apps/demo-cache-components 앱 생성 및 Caching 배관 데모 구현](./009-setup-apps-demo-cache-components.md)

## Question

첫 배포 및 로컬 결합 아키텍처를 증명할 2개 데모의 **최소 기능 명세(Spec)**와 **배관 함정 검증 항목**을 구체적으로 어떻게 설계할 것인가?

### 대상 데모 2종
1. **`demo-baseline` (zone: baseline, 포트 3001)**
   - 근거 문서: `2.14 Server Actions`
   - 검증할 배관 함정:
     - Server Action 호출 시 오리진 불일치(`serverActions.allowedOrigins`) 여부
     - 동적 내용 추가 시 iframe 높이 변화 자동 감지(`ResizeObserver`)
     - 스토리지 네임스페이스 격리(`demo_baseline_*`)
     - `@study/ui` 공통 컴포넌트의 Tailwind CSS v4 `@source` 스타일 적용 여부
2. **`demo-cache-components` (zone: cache, 포트 3002)**
   - 근거 문서: `1.8 Caching` 또는 `2.7 ISR with Cache Components`
   - 검증할 배관 함정:
     - `cacheComponents: true` 전역 설정 및 `use cache` 동작 검증
     - 캐시 태그 및 `revalidateTag` 접두사 규칙(`caching-basic:posts`)
     - Next.js 정적 자산 로딩 (`assetPrefix: '/demo-static/cache'`)
     - 기대/실제 패널(`✓` 자동 판정)

### 결정 기준
- 데모 구현이 지나치게 비대해지지 않고 배관 검증에 집중하는 미니멀한 구성인가?
- 기대/실제 패널에 표시할 명확한 관찰 지표가 정의되어 있는가?
