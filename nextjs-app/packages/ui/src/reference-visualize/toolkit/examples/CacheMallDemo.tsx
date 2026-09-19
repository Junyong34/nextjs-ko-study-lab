'use client';

/**
 * @fileoverview CacheMallDemo
 * "스터디몰" — 한 번의 페이지 요청이 세 구역(진열대 `cacheLife` · 상품 상세 `cacheTag` ·
 * 장바구니 `cookies()`)을 동시에 지나며 레인마다 다른 결과를 겪는 요청 추적도.
 *
 * 구성은 `isr-cache`와 같다: 재생 컨트롤 → 캔버스 → 결론 스트립 → 설명 목록.
 * 시계는 흐르지만 캐시는 저절로 갱신되지 않는다 — 사용자가 "페이지 요청"을 보내야
 * STALE/EXPIRED가 재생성을 트리거한다. 상태·타이밍은 `useCacheMallSim`, 그림은 `paint-mall*.ts`.
 * 근거: `cacheLife.md`, `updateTag.md`, `revalidateTag.md`, `use-cache.md:126`.
 */

import React from 'react';
import { StructureControls, StructureLegendChip, StructureNotes } from '../components/structure';
import { RESULT_COLOR } from '../components/cache-components/paint-mall';
import type { LaneKey } from '../components/cache-components/mall-model';
import { CacheMallControls } from './cache-mall/Controls';
import { MALL_SOURCE, conceptNotes, conclusionOf, requestLogNotes } from './cache-mall/notes';
import { useCacheMallSim } from './cache-mall/useCacheMallSim';

const CANVAS_H = 316;
const MIN_WIDTH = 640;
const LANES: LaneKey[] = ['shelf', 'product', 'cart'];

export const CacheMallDemo: React.FC = () => {
  const sim = useCacheMallSim();
  const notes = [...conceptNotes(sim.shelfLife, sim.lastTag), ...requestLogNotes(sim.logs)];
  const hoveredId = sim.hoveredLane;

  return (
    <div className="w-full space-y-3 rounded-xl border border-slate-200/90 bg-white p-4 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
        <span>개념 시각화 · Next.js 16.3.2 기준 · 실제 서버 실행이나 측정이 아닙니다 · 수명은 시연용 축소값</span>
        <a className="underline underline-offset-4" href={MALL_SOURCE} target="_blank" rel="noreferrer">
          공식 문서 ↗
        </a>
      </div>

      <StructureControls
        isPlaying={sim.isPlaying}
        speed={sim.speed}
        readout={`시뮬레이션 ${sim.displaySec.toFixed(1)}s · 진열대 나이 ${sim.displayAge.toFixed(1)}s`}
        onToggle={sim.toggle}
        onReplay={sim.reset}
        onCycleSpeed={sim.cycleSpeed}
        speedTitle="재생 속도 전환 (1× → 0.5× → 0.25× → 2×) — 시계와 점 이동이 함께 느려집니다"
        extra={
          <>
            <StructureLegendChip color={RESULT_COLOR.HIT} label="HIT" />
            <StructureLegendChip color={RESULT_COLOR.STALE} label="STALE" />
            <StructureLegendChip color={RESULT_COLOR.EXPIRED} label="EXPIRED" />
            <StructureLegendChip color={RESULT_COLOR.DYNAMIC} label="서버 렌더" />
            <button
              type="button"
              onClick={sim.sendRequest}
              className="rounded-md px-3 py-1 text-[11px] font-bold whitespace-nowrap text-white shadow-xs cursor-pointer hover:bg-blue-700 active:translate-y-px"
              style={{ backgroundColor: '#2563eb', color: '#ffffff' }}
              title="실행 — 브라우저가 페이지를 한 번 요청한다 (캔버스를 클릭해도 같다)"
            >
              ▶ 페이지 요청 ⚡
            </button>
          </>
        }
      />

      <CacheMallControls
        shelfLife={sim.shelfLife}
        onSelectShelfLife={sim.selectShelfLife}
        onRunTag={sim.runTag}
        onSkip={sim.skip}
        lastTag={sim.lastTag}
      />

      <div className="w-full overflow-x-auto">
        <div style={{ minWidth: MIN_WIDTH, height: CANVAS_H }} className="relative">
          <canvas
            ref={sim.canvasRef}
            role="img"
            aria-label="스터디몰 요청 추적도 — 브라우저에서 출발한 요청이 진열대·상품 상세·장바구니 레인을 지나 캐시 또는 원본 서버에서 돌아온다"
            onClick={sim.sendRequest}
            style={{ width: '100%', height: CANVAS_H }}
            className="block w-full cursor-pointer select-none"
          />
        </div>
      </div>

      <p role="status" className="rounded-lg bg-slate-900 px-3 py-2 text-[11px] leading-relaxed text-slate-300">
        {sim.lastOutcome ? (
          <>
            <span className="font-semibold text-white">요청 #{sim.lastOutcome.id}</span>
            <span className="mx-2 text-slate-500">—</span>
            {conclusionOf(sim.lastOutcome)}
          </>
        ) : (
          conclusionOf(null)
        )}
      </p>

      <StructureNotes
        items={notes}
        hoveredId={hoveredId}
        onHover={(id) => sim.setHoveredLane(id && LANES.includes(id as LaneKey) ? (id as LaneKey) : null)}
        columns={1}
        caption="위 3개는 레인별 규칙(마우스를 올리면 캔버스의 해당 레인이 강조됩니다), 아래는 최근 페이지 요청이 레인마다 겪은 일입니다."
      />
    </div>
  );
};
