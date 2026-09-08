/**
 * @fileoverview IsrCacheLifecycleDemo
 * ISR stale-while-revalidate — 시간은 흐르지만 요청은 사용자가 보낸다.
 *
 * 모델 주의: `export const revalidate` 기준의 **이전 모델**(cacheComponents 미사용)이다.
 * 동작은 next@16.3.2에서도 유효하나(`02-guides/incremental-static-regeneration.md:100-101`),
 * `cacheComponents: true`에서는 이 세그먼트 옵션이 제거되고 `cacheLife`가 대신한다
 * (`03-api-reference/03-file-conventions/02-route-segment-config/index.md:19`).
 * "만료 뒤 첫 요청이 구버전을 받으면서 그 요청이 재생성을 트리거한다"는 인과를 화살표로 잇는다.
 */

'use client';

import React, { useCallback, useRef, useState } from 'react';
import { useCanvas } from '../hooks/useCanvas';
import {
  HIT_COLOR,
  REGEN_COLOR,
  STALE_COLOR,
  StructureControls,
  StructureLegendChip,
  StructureNotes,
  hitTestRequests,
  paintCacheTrack,
  paintRequestMarkers,
  paintIsrPipeline,
  type CacheRequestLog,
  type IsrRuntime,
  type IsrSpec,
  type NoteItem,
  type RegenBand
} from '../components/structure';
import { ISR_EXPIRE_NOTE, ISR_MODEL_NOTE, ISR_TRIGGER_NOTE } from './isr-model-note';

const SPEC: IsrSpec = { revalidateSec: 10, regenerateSec: 1.4, windowSec: 20, maxAgeSec: 15 };
const TRACK_H = 170;
const PIPELINE_H = 52;
const CANVAS_H = 12 + TRACK_H + 12 + PIPELINE_H + 12;
const MIN_WIDTH = 480;

export const IsrCacheLifecycleDemo: React.FC = () => {
  const nowSecRef = useRef(0);
  const ageRef = useRef(0);
  const historyRef = useRef<{ t: number; age: number }[]>([{ t: 0, age: 0 }]);
  const requestsRef = useRef<CacheRequestLog[]>([]);
  const bandsRef = useRef<RegenBand[]>([]);
  const regenElapsedRef = useRef(0);
  const regeneratingRef = useRef(false);
  const pulseRef = useRef(0);
  const sampleRef = useRef(0);
  const idRef = useRef(0);

  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [displayAge, setDisplayAge] = useState(0);
  const [logs, setLogs] = useState<CacheRequestLog[]>([]);
  const [counts, setCounts] = useState({ hit: 0, stale: 0 });
  const [canvasHover, setCanvasHover] = useState<string | null>(null);
  const [listHover, setListHover] = useState<string | null>(null);

  const playingRef = useRef(isPlaying);
  playingRef.current = isPlaying;
  const speedRef = useRef(speed);
  speedRef.current = speed;
  const hoverId = canvasHover ?? listHover;
  const hoverRef = useRef(hoverId);
  hoverRef.current = hoverId;
  const canvasHoverRef = useRef(canvasHover);
  canvasHoverRef.current = canvasHover;

  const sendRequest = useCallback(() => {
    const ageSec = ageRef.current;
    const isStale = ageSec >= SPEC.revalidateSec;
    const alreadyRegen = regeneratingRef.current;
    const triggeredRegen = isStale && !alreadyRegen;
    const id = ++idRef.current;

    if (triggeredRegen) {
      regeneratingRef.current = true;
      regenElapsedRef.current = 0;
      bandsRef.current.push({ id, startSec: nowSecRef.current, endSec: null, triggeredBy: id });
    }

    const log: CacheRequestLog = {
      id,
      atSec: nowSecRef.current,
      ageSec,
      result: isStale ? 'STALE' : 'HIT',
      triggeredRegen,
      reason: !isStale
        ? `캐시 나이 ${ageSec.toFixed(1)}s < ${SPEC.revalidateSec}s — 저장된 응답을 0ms에 그대로 반환한다.`
        : alreadyRegen
          ? '이미 재생성이 돌고 있다 — 완료될 때까지 이 요청도 구버전을 0ms에 받는다.'
          : `캐시 나이 ${ageSec.toFixed(1)}s ≥ ${SPEC.revalidateSec}s — 구버전을 0ms에 먼저 주고, 이 요청이 백그라운드 재생성을 시작시킨다.`
    };

    requestsRef.current = [...requestsRef.current, log].slice(-40);
    pulseRef.current = 1;
    setLogs(requestsRef.current.slice(-5).reverse());
    setCounts((p) => ({ hit: p.hit + (isStale ? 0 : 1), stale: p.stale + (isStale ? 1 : 0) }));
  }, []);

  const reset = useCallback(() => {
    nowSecRef.current = 0;
    ageRef.current = 0;
    historyRef.current = [{ t: 0, age: 0 }];
    requestsRef.current = [];
    bandsRef.current = [];
    regeneratingRef.current = false;
    regenElapsedRef.current = 0;
    pulseRef.current = 0;
    idRef.current = 0;
    setLogs([]);
    setCounts({ hit: 0, stale: 0 });
    setDisplayAge(0);
    setIsPlaying(true);
  }, []);

  const { canvasRef } = useCanvas({
    trackPointer: true,
    onFrame: ({ ctx, size, pointer, deltaTime }) => {
      const dt = playingRef.current ? (Math.min(50, Math.max(0, deltaTime)) / 1000) * speedRef.current : 0;
      nowSecRef.current += dt;
      ageRef.current += dt;
      pulseRef.current = Math.max(0, pulseRef.current - dt * 2.2);

      if (regeneratingRef.current) {
        regenElapsedRef.current += dt;
        if (regenElapsedRef.current >= SPEC.regenerateSec) {
          regeneratingRef.current = false;
          const open = bandsRef.current.find((b) => b.endSec === null);
          if (open) open.endSec = nowSecRef.current;
          ageRef.current = 0;
        }
      }

      sampleRef.current += dt;
      if (sampleRef.current >= 0.05) {
        sampleRef.current = 0;
        historyRef.current.push({ t: nowSecRef.current, age: ageRef.current });
        const cutoff = nowSecRef.current - SPEC.windowSec - 1;
        historyRef.current = historyRef.current.filter((p) => p.t >= cutoff);
        if (Math.abs(displayAge - ageRef.current) > 0.1) setDisplayAge(ageRef.current);
      }

      const runtime: IsrRuntime = {
        nowSec: nowSecRef.current,
        ageSec: ageRef.current,
        history: historyRef.current,
        requests: requestsRef.current,
        bands: bandsRef.current,
        isRegenerating: regeneratingRef.current
      };

      ctx.clearRect(0, 0, size.width, size.height);
      const pad = 12;
      const track = { x: pad, y: pad, width: size.width - pad * 2, height: TRACK_H };
      const pipeline = { x: pad + 6, y: pad + TRACK_H + 12, width: size.width - pad * 2 - 12, height: PIPELINE_H };

      paintCacheTrack(ctx, { panel: track, spec: SPEC, runtime });
      paintRequestMarkers(ctx, { panel: track, spec: SPEC, runtime, hoveredId: hoverRef.current });
      paintIsrPipeline(ctx, {
        panel: pipeline,
        isStale: ageRef.current >= SPEC.revalidateSec,
        isRegenerating: regeneratingRef.current,
        requestPulse: pulseRef.current
      });

      const hit = hitTestRequests(track, SPEC, runtime, pointer);
      if (hit !== canvasHoverRef.current) {
        canvasHoverRef.current = hit;
        setCanvasHover(hit);
      }
    }
  });

  const notes: NoteItem[] = [ISR_TRIGGER_NOTE, ISR_MODEL_NOTE, ISR_EXPIRE_NOTE, ...logs.map((log) => ({
    id: `req-${log.id}`,
    label: `#${log.id} ${log.result}`,
    meta: `캐시 나이 ${log.ageSec.toFixed(1)}s · 응답 0ms`,
    detail: log.reason,
    color: log.result === 'HIT' ? HIT_COLOR : STALE_COLOR
  }))];

  return (
    <div className="w-full space-y-3 rounded-xl border border-slate-200/90 bg-white p-4 shadow-xs">
      <StructureControls
        isPlaying={isPlaying}
        speed={speed}
        readout={`캐시 나이 ${displayAge.toFixed(1)}s / ${SPEC.revalidateSec}s`}
        onToggle={() => setIsPlaying((p) => !p)}
        onReplay={reset}
        onCycleSpeed={() => setSpeed((s) => (s === 1 ? 2 : s === 2 ? 0.5 : 1))}
        extra={
          <>
            <StructureLegendChip color={HIT_COLOR} label="HIT" />
            <StructureLegendChip color={STALE_COLOR} label="STALE" />
            <StructureLegendChip color={REGEN_COLOR} label="백그라운드 재생성" />
            <button
              type="button"
              onClick={sendRequest}
              className="rounded-md bg-blue-600 px-3 py-1 text-[11px] font-bold whitespace-nowrap text-white shadow-xs hover:bg-blue-700 cursor-pointer"
              style={{ backgroundColor: '#2563eb', color: '#ffffff' }}
            >
              요청 보내기 ⚡
            </button>
          </>
        }
      />

      <div className="w-full overflow-x-auto">
        <div style={{ minWidth: MIN_WIDTH, height: CANVAS_H }} className="relative">
          <canvas
            ref={canvasRef}
            onClick={sendRequest}
            style={{ width: '100%', height: CANVAS_H }}
            className="block w-full cursor-pointer select-none"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-slate-900 px-3 py-2 text-[11px] text-slate-300">
        <span>
          누적 <span className="mx-1 font-mono text-emerald-300">HIT {counts.hit}</span>
          <span className="font-mono text-orange-300">STALE {counts.stale}</span>
        </span>
        <span className="text-slate-400">
          10초가 지나도 저절로 재생성되지 않습니다 — 다음 요청이 도착해야 그 요청이 구버전을 받고 동시에 재생성을 시작시킵니다
        </span>
      </div>

      <StructureNotes
        items={notes}
        hoveredId={hoverId}
        onHover={setListHover}
        columns={1}
        caption={
          notes.length === 0
            ? '아직 요청이 없습니다. 캐시 나이가 10초를 넘긴 뒤 요청을 보내면 STALE 응답과 백그라운드 재생성이 어떻게 이어지는지 볼 수 있습니다.'
            : '최근 요청 5건 — 항목에 마우스를 올리면 트랙 위 해당 마커가 강조됩니다.'
        }
      />
    </div>
  );
};
