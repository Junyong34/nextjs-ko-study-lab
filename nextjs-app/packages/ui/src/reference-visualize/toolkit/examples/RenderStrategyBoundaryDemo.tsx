/**
 * @fileoverview RenderStrategyBoundaryDemo
 * 어느 단계가 서버에서 돌고 어느 단계가 클라이언트에서 도는지를 세로 위치로 드러낸다.
 * CSR/SSR/SSG는 학습자의 기존 멘탈 모델을 받아 주는 입구이고, 결론은 네 번째 레인 —
 * Next 16은 정적/동적을 라우트가 아니라 **컴포넌트 단위**로 나눈다.
 */

'use client';

import React, { useRef, useState } from 'react';
import { useCanvas } from '../hooks/useCanvas';
import { useTimelinePlayback } from '../hooks/useTimelinePlayback';
import {
  AREA_COLOR,
  MODE_LABEL,
  MODE_TOTAL_MS,
  STRATEGY_LANES,
  StructureControls,
  StructureLegendChip,
  StructureNotes,
  hitTestSteps,
  lanesHeight,
  paintStrategyLanes,
  type NoteItem,
  type RenderMode
} from '../components/structure';
import { formatMs } from '../components/timeline/scale';

const CORRECTIONS: NoteItem[] = [
  {
    id: 'c-component-level',
    label: '경계는 라우트가 아니라 컴포넌트 단위',
    meta: 'guides/rendering-philosophy.md',
    detail:
      'Next 16 문서는 라우트 단위로 정적/동적을 고르는 방식을 "다른 프레임워크의 트레이드오프"로 분류한다. Next.js는 한 페이지 안에서 정적 셸과 동적 구역이 공존하는 스펙트럼 모델을 쓴다.',
    color: '#8b5cf6'
  },
  {
    id: 'c-ppr',
    label: 'PPR은 cacheComponents로 켠다',
    meta: 'guides/upgrading/version-16.md:582',
    detail:
      'Next 16에서 experimental.ppr 플래그와 세그먼트 옵션 experimental_ppr은 제거됐다. 이제 next.config의 cacheComponents: true가 PPR을 켜며, 그것이 기본 렌더링 동작이 된다.',
    color: '#8b5cf6'
  },
  {
    id: 'c-shell',
    label: '정적 셸은 HTML이자 RSC Payload',
    meta: 'getting-started/08-caching.md:444',
    detail:
      '정적 셸은 초기 로드용 HTML과 클라이언트 내비게이션용 RSC Payload 두 형태로 생성되어 CDN에서 직접 서빙된다. 그래서 주소로 바로 들어와도, 다른 페이지에서 이동해 와도 즉시 내용이 보인다.',
    color: '#8b5cf6'
  },
  {
    id: 'c-use-client',
    label: "'use client'는 CSR이 아니다",
    meta: 'getting-started/05-server-and-client-components.md:105',
    detail:
      '첫 로드에서는 Client Component도 서버에서 HTML로 프리렌더된다. 브라우저는 그 HTML로 비대화형 화면을 먼저 띄우고, RSC Payload로 트리를 맞춘 뒤 JS로 수화한다.',
    color: '#ec4899'
  },
  {
    id: 'c-real-csr',
    label: '진짜 클라이언트 전용 렌더는 두 경우뿐',
    meta: '05-server-and-client-components.md:132 · guides/lazy-loading.md:66',
    detail:
      '① 이후 내비게이션 — 서버 HTML 없이 클라이언트에서만 렌더된다. ② next/dynamic(..., { ssr: false }) — Client Component 안에서만 쓸 수 있다. 이 둘이 아니면 서버가 HTML을 한 번 만든다.',
    color: '#ec4899'
  },
  {
    id: 'c-csr-html',
    label: 'CSR도 첫 HTML은 서버가 준다',
    meta: '차이는 그 HTML에 내용이 있느냐',
    detail:
      '전통적 SPA도 서버(또는 CDN)가 첫 HTML을 준다. 다만 그것은 <div id="root"></div> 한 줄짜리 껍데기이고, 스트리밍이 아니라 정적 파일 한 장이다. 내용은 JS가 실행된 뒤에야 생긴다.',
    color: '#ec4899'
  }
];

const MIN_WIDTH = 560;
const PAD = 12;
const CANVAS_H = PAD * 2 + 18 + lanesHeight(STRATEGY_LANES.length) + 6;

export const RenderStrategyBoundaryDemo: React.FC = () => {
  const [mode, setMode] = useState<RenderMode>('first-load');
  const [canvasHover, setCanvasHover] = useState<string | null>(null);
  const [listHover, setListHover] = useState<string | null>(null);
  const hoverId = canvasHover ?? listHover;
  const hoverRef = useRef(hoverId);
  hoverRef.current = hoverId;
  const canvasHoverRef = useRef(canvasHover);
  canvasHoverRef.current = canvasHover;
  const modeRef = useRef(mode);
  modeRef.current = mode;

  const totalMs = MODE_TOTAL_MS[mode];
  const playback = useTimelinePlayback({ totalMs: 1000, cycleMs: 5200 });
  const { advance } = playback;
  const progress = playback.displayMs / 1000;

  const { canvasRef } = useCanvas({
    trackPointer: true,
    onFrame: ({ ctx, size, pointer, deltaTime }) => {
      ctx.clearRect(0, 0, size.width, size.height);
      const panel = {
        x: PAD,
        y: PAD,
        width: size.width - PAD * 2,
        height: CANVAS_H - PAD * 2
      };
      const currentMode = modeRef.current;
      const span = MODE_TOTAL_MS[currentMode];
      const nowMs = (advance(deltaTime) / 1000) * span;

      paintStrategyLanes(ctx, {
        panel,
        lanes: STRATEGY_LANES,
        mode: currentMode,
        totalMs: span,
        nowMs,
        hoveredId: hoverRef.current
      });

      // 단계 블록을 짚으면 그 단계가 속한 레인의 설명을 강조한다
      const stepId = hitTestSteps(panel, STRATEGY_LANES, currentMode, span, pointer);
      const laneId =
        STRATEGY_LANES.find((lane) => lane.steps[currentMode].some((step) => step.id === stepId))?.id ??
        null;
      if (laneId !== canvasHoverRef.current) {
        canvasHoverRef.current = laneId;
        setCanvasHover(laneId);
      }
    }
  });

  const stepNotes: NoteItem[] = STRATEGY_LANES.map((lane) => ({
    id: lane.id,
    label: lane.title,
    meta: `첫 화면 ${formatMs(lane.firstPaintMs[mode])} · ${MODE_LABEL[mode]}`,
    detail: lane.detail,
    color: lane.color
  }));

  return (
    <div className="w-full space-y-3 rounded-xl border border-slate-200/90 bg-white p-4 shadow-xs">
      <StructureControls
        isPlaying={playback.isPlaying}
        speed={playback.speed}
        readout={`${formatMs(Math.round(progress * totalMs))} / ${formatMs(totalMs)}`}
        onToggle={playback.toggle}
        onReplay={playback.replay}
        onCycleSpeed={playback.cycleSpeed}
        extra={
          <>
            <StructureLegendChip color={AREA_COLOR.server} label="서버 실행" />
            <StructureLegendChip color={AREA_COLOR.network} label="네트워크" />
            <StructureLegendChip color={AREA_COLOR.client} label="클라이언트 실행" />
          </>
        }
      />

      <div className="flex flex-wrap items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1">
        {(['first-load', 'client-nav'] as RenderMode[]).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setMode(value)}
            className={`rounded-md px-3 py-1 text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              mode === value ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {MODE_LABEL[value]}
          </button>
        ))}
        <span className="ml-2 text-[11px] text-slate-500">
          {mode === 'first-load'
            ? "첫 로드 — 'use client' 컴포넌트도 서버가 HTML로 프리렌더합니다"
            : '이후 내비게이션 — 서버 HTML이 없습니다. RSC Payload만 오고 클라이언트가 그립니다'}
        </span>
      </div>

      <div className="w-full overflow-x-auto">
        <div style={{ minWidth: MIN_WIDTH, height: CANVAS_H }} className="relative">
          <canvas
            ref={canvasRef}
            style={{ width: '100%', height: CANVAS_H }}
            className="block w-full cursor-default select-none touch-pan-y"
          />
        </div>
      </div>

      <div className="rounded-lg bg-slate-900 px-3 py-2 text-[11px] leading-relaxed text-slate-300">
        <span className="font-semibold text-white">블록의 세로 위치가 곧 실행 위치입니다.</span>
        <span className="mx-2 text-slate-500">—</span>
        네 번째 레인이 Next 16의 실제 모델입니다. 앞의 셋은 라우트 단위로 하나를 고르지만, Next 16은{' '}
        <span className="font-mono text-violet-300">use cache</span>와{' '}
        <span className="font-mono text-violet-300">&lt;Suspense&gt;</span>로 한 페이지 안에서 둘을 섞습니다.
      </div>

      <StructureNotes items={[...stepNotes, ...CORRECTIONS]} hoveredId={hoverId} onHover={setListHover} />
    </div>
  );
};
