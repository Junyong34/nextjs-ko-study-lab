# 🎨 Canvas Toolkit (`@study/ui/canvas-toolkit`)

Next.js 학습 사이트 및 캔버스 기반 시각화 컴포넌트들을 아토믹(Atomic)한 모듈 단위로 결합하여 빠르게 구축할 수 있는 **고성능 캔버스 유틸리티 툴킷**입니다.

기존 187개 컴포넌트에 분산되어 있던 수백 회의 중복 로직(HiDPI 스케일링, ResizeObserver, 애니메이션 루프, 기본 도형, 텍스트 줄바꿈, 게이지, 차트, 물리 수식)을 순수 함수 및 React 훅으로 통합하였습니다.

---

## 🌟 주요 특징

1. **HiDPI (Retina) 자동 보정**: `devicePixelRatio`를 감지하여 비트맵 해상도 왜곡 없는 선명한 렌더링
2. **반응형 컨테이너 감지**: `ResizeObserver`로 컨테이너 크기 변경 시 캔버스 버퍼와 좌표계를 즉각 자동 동기화
3. **가시성 최적화 (Visibility Aware)**: `IntersectionObserver`를 통해 화면 밖(Offscreen)에 있을 때 rAF 루프를 자동 일시정지하여 CPU/배터리 절약
4. **마우스/터치 좌표 정규화**: 마우스 및 모바일 터치를 캔버스 상대 좌표계(`{ x, y, isDown, isInside }`)로 자동 변환
5. **아토믹 드로잉 모듈**: 부수 효과가 없는 순수 Canvas 2D 헬퍼 (`roundRect`, `circle`, `arrow`, `badge`, `grid`, `sparkline`, `arcGauge` 등)
6. **단일 파일 250줄 제한 준수**: 작은 단위의 모듈로 분할되어 쉬운 확장성과 테스트 용이성 제공

---

## 📦 계층별 모듈 구성 (Layered Architecture)

```
canvas-toolkit/
├── core/                        # 기반 인프라 & 엔진
│   ├── types.ts                 # CanvasSize, CanvasFrameContext, PointerState
│   ├── math.ts                  # clamp, lerp, mapRange, degToRad, polarToCartesian
│   ├── dpi-driver.ts            # setupCanvasDpi, clearCanvas
│   ├── observer.ts              # observeElementResize, observeVisibility
│   └── loop-engine.ts           # LoopEngine (rAF, DeltaTime, FPS Throttling)
│
├── hooks/                       # React 연동 훅
│   ├── useCanvas.ts             # 핵심 통합 캔버스 훅 (DPI + Resize + Loop + Pointer)
│   ├── useTimelinePlayback.ts   # 타임라인 재생/속도/스크럽/루프 홀드 상태
│   ├── useCanvasLoop.ts         # 순수 rAF 애니메이션 루프 훅
│   └── usePointerTracker.ts     # 마우스/터치 정규화 훅
│
├── primitives/                  # 단위 그래픽 프리미티브 (순수 캔버스 API)
│   ├── shapes.ts                # drawRoundRect, drawCircle, drawArc
│   ├── lines.ts                 # drawLine, drawDashedLine, drawArrow
│   ├── typography.ts            # drawText, drawBadge, measureAndWrapText
│   └── grid.ts                  # drawGrid, drawCrosshair
│
├── modules/                     # 시각화 도메인 블록
│   ├── gauges/                  # drawArcGauge, drawLinearGauge
│   ├── charts/                  # drawSparkline, drawAreaFill, drawThresholdLine
│   ├── diagrams/                # drawCardNode, drawFlowConnector, drawPulseIndicator
│   └── physics/                 # SpringSimulator, createConfettiCluster, updateAndDrawParticles
│
├── components/                  # 선언적 JSX 래퍼
│   ├── CanvasView.tsx           # <CanvasView onFrame={...} />
│   ├── TimelineCompareCanvas.tsx # 공유 시간축 Before/After 비교 캔버스 (고수준 조립)
│   └── timeline/                # 타임라인 전용 모듈 (전부 250줄 이하)
│       ├── types.ts             # TimelineTaskSpec / EventSpec / LaneSpec / CompareSpec
│       ├── palette.ts           # 태스크 종류별 색 (캔버스·DOM 공유)
│       ├── scale.ts             # ms↔px 스케일, nice tick, 반응형 밀도 판정
│       ├── layout.ts            # 레인 배치·총 높이 산출, 이벤트 행 배정, 히트 테스트
│       ├── label-fit.ts         # 단계적 라벨 축약 (폰트 축소 → 순번 칩 → 미표시)
│       ├── simulate.ts          # 시각 t의 레인 상태(대기 큐·처리 완료·양보 신호)
│       ├── paint-track.ts       # 축·눈금·레인 제목·완료 깃발
│       ├── paint-bars.ts        # 태스크 바, 진행 채움, 블로킹 스트라이프, 유휴 레일
│       ├── paint-flow.ts        # 대기 지연 막대, 큐 적체, ⚡ 양보 스파크, 스케줄 아크
│       ├── paint-hud.ts         # 재생 헤드, Δ 브래킷, 호버 툴팁
│       ├── arrow-head.ts        # 선(획) 화살촉 — 작은 크기에서 뭉치는 채운 삼각형 대체
│       ├── TimelineControls.tsx # 재생 컨트롤 + 범례 (DOM)
│       └── TimelineStepList.tsx # 긴 설명 전용 DOM 스텝 리스트 (호버 동기화)
│   └── structure/               # Next.js 인터랙티브 구조 데모 3종 공용 모듈
│       ├── types.ts             # 스트리밍 청크 / 캐시 요청 로그 / 렌더 트리 노드 모델
│       ├── frame.ts             # 패널, 단계 인디케이터, 경계를 넘지 않는 배지(drawClampedBadge)
│       ├── rsc-waterfall.ts     # 청크 워터폴 + 도착 시각 + 첫 페인트 기준선
│       ├── rsc-browser.ts       # 브라우저 미니 뷰포트 (빈 화면 → 스켈레톤 → 콘텐츠)
│       ├── isr-track.ts         # 캐시 나이 트랙, 요청 마커, 재생성 밴드, 인과 화살표
│       ├── isr-pipeline.ts      # 방문자 → ISR 캐시 → 원본 서버 3노드
│       ├── tree-nest.ts         # 중첩 박스 좌표 계산 + 페인트
│       ├── tree-sequence.ts     # 렌더 순서 3단계(셸 → 스트리밍 → 수화) 상태 계산
│       ├── meta-merge.ts        # metadata 얕은 병합 계산 (덮어쓰기·중첩 손실 추적)
│       ├── meta-flow.ts         # 세그먼트 카드 + 평가 순서 전달 화살표
│       ├── meta-head.ts         # <head> / <body> append 결과 패널
│       ├── strategy-model.ts    # SSG·SSR·CSR + Next 16 컴포넌트 단위 레인 데이터
│       ├── strategy-lanes.ts    # 서버·네트워크·클라이언트 3영역 위의 레인 페인트
│       ├── strategy-hit.ts      # 단계 블록 포인터 판정
│       ├── StructureControls.tsx # 구조 데모 공통 재생 컨트롤 (DOM)
│       └── StructureNotes.tsx    # 구조 데모 공통 설명 리스트 (DOM, 호버 동기화)
│
└── examples/                    # 모듈 결합 실사용 예제
    ├── *TimelineDemo.tsx        # Next.js 6대 기술 Before/After 타임라인 비교 (공유 시간축)
    ├── RscStreamingWaterfallDemo.tsx # Next.js RSC 스트리밍 워터폴 타임라인
    ├── IsrCacheLifecycleDemo.tsx     # Next.js ISR stale-while-revalidate 수명주기
    ├── AppRouterRenderTreeDemo.tsx   # Next.js App Router 중첩 렌더 트리 (스프링 호버)
    ├── InteractiveAngleDemo.tsx # 마우스 추적 및 각도 게이지
    ├── ConfettiBurstDemo.tsx    # 콘페티 파티클 발사
    ├── SystemHealthMonitorDemo.tsx # 복합 서버 모니터링 대시보드
    └── ShowcaseTabs.tsx         # 위 예제들의 탭/그리드 쇼케이스
```

---

## 🚀 빠른 시작 (Quick Start)

### 1. 훅 기반 모듈 결합 (추천: `useCanvas`)

```tsx
import React from 'react';
import { useCanvas, drawGrid, drawArcGauge } from '@study/ui';

export function MyCpuMonitor({ cpu = 72 }: { cpu?: number }) {
  const { canvasRef } = useCanvas({
    // 매 프레임마다 호출 (HiDPI scale 및 pointer 좌표 자동 주입)
    onFrame: ({ ctx, size }) => {
      ctx.clearRect(0, 0, size.width, size.height);

      // 1. 그리드 결합
      drawGrid(ctx, {
        bounds: { x: 0, y: 0, width: size.width, height: size.height },
        step: 30
      });

      // 2. 원형 게이지 결합
      drawArcGauge(ctx, {
        center: [size.width / 2, size.height / 2],
        radius: 60,
        value: cpu,
        title: 'CPU 점유율',
        unit: '%'
      });
    }
  });

  return <canvas ref={canvasRef} className="w-full h-[200px] border rounded-lg bg-white" />;
}
```

### 2. 마우스 인터랙션 결합 (포인터 추적)

```tsx
import { useCanvas, drawArrow, drawBadge } from '@study/ui';

export function Compass() {
  const { canvasRef } = useCanvas({
    trackPointer: true,
    onFrame: ({ ctx, size, pointer }) => {
      ctx.clearRect(0, 0, size.width, size.height);
      const center = { x: size.width / 2, y: size.height / 2 };

      // 마우스 방향으로 화살표 그리기
      drawArrow(ctx, {
        from: [center.x, center.y],
        to: pointer.isInside ? [pointer.x, pointer.y] : [center.x + 80, center.y],
        stroke: '#228be6',
        lineWidth: 3
      });

      // 상태 배지
      drawBadge(ctx, {
        text: pointer.isInside ? `X: ${Math.round(pointer.x)} Y: ${Math.round(pointer.y)}` : '마우스를 올려보세요',
        x: 16,
        y: 16
      });
    }
  });

  return <canvas ref={canvasRef} className="w-full h-[220px]" />;
}
```

### 3. 선언적 컴포넌트 (`CanvasView`)

```tsx
import { CanvasView, drawSparkline, drawAreaFill } from '@study/ui';

export function MiniChart({ data }: { data: number[] }) {
  return (
    <CanvasView
      className="w-full h-[120px] rounded border"
      onFrame={({ ctx, size }) => {
        ctx.clearRect(0, 0, size.width, size.height);
        const bounds = { x: 10, y: 10, width: size.width - 20, height: size.height - 20 };
        drawAreaFill(ctx, { bounds, data, color: 'rgba(34, 139, 230, 0.1)' });
        drawSparkline(ctx, { bounds, data, stroke: '#228be6' });
      }}
    />
  );
}
```

## Cache Components 쇼케이스

`Composed Showcase → Cache Components`에서 4개 독립 예제를 선택한다.

- `CacheShellDemo`: 정적 셸·캐시 콘텐츠·Suspense fallback과 요청별 스트리밍. HTML 전달·fallback 대기·콘텐츠 채움 애니메이션.
- `CacheKeysDemo`: 요청 값을 캐시 밖에서 읽고 인자로 전달하는 경계, 키별 MISS/HIT와 빌드 구분.
- `CacheLifetimeDemo`: 클라이언트 stale과 서버 revalidate/expire, 무트래픽 후 다음 탐색의 응답.
- `CacheTagsDemo`: 태그별 영향 범위, revalidateTag(tag, 'max')와 Server Action의 updateTag 비교.

Next.js 16.3.2 번들 문서 기준 **개념 시각화**이며 실제 캐시 요청이나 측정값이 아니다.
상태·페인터는 `components/cache-components/`, 등록은 `examples/showcase-cache-demos.tsx`에 있다.
모델 테스트: 저장소 루트에서 `node --experimental-strip-types --test nextjs-app/packages/ui/src/reference-visualize/toolkit/components/cache-components/model.test.mjs`.
설계·검증 기록은 `intent/cache-components-canvas-showcases/plan.md`를 참조한다.

4종은 `useCachePlayback`과 `CachePlaybackControls`로 자동 반복 재생·일시정지·0.5×/1×/2× 속도·스크럽·단계 이동을 공유한다. `motion.ts`의 패킷 이동·진행률·콘텐츠 표시 효과는 재생 시각에만 의존하므로 일시정지 시 함께 멈춘다. 모션 축소 설정에서는 자동 재생하지 않으며, 화면 밖에서는 기존 가시성 제어로 재생을 멈춘다. 키 예제는 응답 단계에서 항목을 저장하고 반복 재생은 같은 호출을 다시 보여 준다.
