# 🎨 Canvas UI Toolkit (Canvas Components)

Next.js 및 React의 핵심 런타임 메커니즘과 인터랙티브 아키텍처 다이어그램을 렌더링하기 위한 모듈형 캔버스 라이브러리입니다.

`/visualize` 페이지에서 사용되는 모든 아토믹 프리미티브 및 완성형 쇼케이스 컴포넌트가 [`toolkit/`](./toolkit) 하위에 구성되어 있습니다.

---

## 📁 주요 구성

- **[`toolkit/core/`](./toolkit/core)**: HiDPI 캔버스 엔진, 렌더 루프 엔진, 수학 유틸리티, 옵저버
- **[`toolkit/hooks/`](./toolkit/hooks)**: `useCanvas`, `useCanvasLoop`, `useTimelinePlayback`, `usePointerTracker`
- **[`toolkit/primitives/`](./toolkit/primitives)**: 격자, 선/화살표, 기하 도형, 타이포그래피/뱃지
- **[`toolkit/modules/`](./toolkit/modules)**: 게이지(arc, linear), 차트(sparkline, area-fill), 다이어그램(card-node, flow-connector), 물리(spring, particles)
- **[`toolkit/components/`](./toolkit/components)**: 타임라인 비교 캔버스(`TimelineCompareCanvas`), 컨트롤러, 구조 뷰어
- **[`toolkit/examples/`](./toolkit/examples)**: Next.js/React 아키텍처 실전 쇼케이스 15종 (SSR Streaming, Selective Hydration, PPR, Transitions, Optimistic UI, ISR, Cache Components 등)
