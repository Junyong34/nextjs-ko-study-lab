# [T01] 데모 공통 UI 컴포넌트 패키지 위치 결정

- **라벨**: `wayfinder:grilling`
- **상위 지도**: [Wayfinder Map](../map.md)
- **상태**: Open (Frontier)
- **차단 중**: [T06. @study/ui 및 @study/docs-render 패키지 구현](./006-setup-shared-ui-and-render-packages.md)

## Question

모든 데모가 공통으로 사용하는 **기대/실제 패널([03. 4-8])**, **리셋 버튼**, **iframe 높이 감지 브릿지(ResizeObserver)**를 어느 패키지에 배치할 것인가?

### 후보 옵션
1. **`@study/ui`**: 셸과 데모 앱이 모두 참조하는 단일 UI 패키지. 별도 패키지 증가 없이 관리 간소화.
2. **`@study/demo-kit`**: 순수 데모 전용 컴포넌트(`DemoContainer`, `ExpectedActualPanel`, `DemoResetButton`)만 전담하는 패키지 분리. 역할이 명확하지만 패키지 수가 증가.
3. **`@study/demos`**: 메타데이터/목록 패키지에 React 컴포넌트까지 포함.

### 결정 기준
- 셸이 데모 공통 컴포넌트의 타입이나 UI 일부를 알아야 하는가?
- 패키지 의존성 그래프가 단순하게 유지되는가?
