'use client';

import {useRef, useEffect, useState, useCallback} from 'react';
import {setupCanvasDpi} from '../core';
import {observeElementResize, observeVisibility} from '../core';
import {useCanvasLoop} from './useCanvasLoop';
import {usePointerTracker} from './usePointerTracker';
import type {CanvasFrameContext, CanvasSize} from '../core';

export interface UseCanvasOptions {
    /** 매 프레임마다 실행될 렌더링 콜백 함수 */
    onFrame?: (frame: CanvasFrameContext) => void;
    /** 정적 캔버스용 1회성 드로우 콜백 (루프 없이 리사이즈 시에만 재호출) */
    onDraw?: (frame: CanvasFrameContext) => void;
    /** 컴포넌트 마운트 시 자동 재생 여부 (기본값: true) */
    autoPlay?: boolean;
    /** 뷰포트에서 벗어났을 때 루프를 멈출지 여부 (기본값: true) */
    pauseWhenHidden?: boolean;
    /** 마우스/터치 좌표 추적 활성화 여부 (기본값: true) */
    trackPointer?: boolean;
    /** 초당 프레임 수 제한 (선택) */
    fpsLimit?: number;
    /** 고정 너비 (미지정 시 부모 컨테이너 너비 100% 반응형) */
    width?: number;
    /** 고정 높이 (선택) */
    height?: number;
}

export function useCanvas(options: UseCanvasOptions = {}) {
    const {
        onFrame,
        onDraw,
        autoPlay = true,
        pauseWhenHidden = true,
        trackPointer = true,
        fpsLimit,
        width: fixedWidth,
        height: fixedHeight
    } = options;

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const sizeRef = useRef<CanvasSize>({
        width: fixedWidth || 300,
        height: fixedHeight || 150,
        dpr: 1,
        pixelWidth: fixedWidth || 300,
        pixelHeight: fixedHeight || 150
    });

    const [isVisible, setIsVisible] = useState(true);
    const pointerRef = usePointerTracker(canvasRef);

    const onFrameRef = useRef(onFrame);
    onFrameRef.current = onFrame;

    const onDrawRef = useRef(onDraw);
    onDrawRef.current = onDraw;

    // 캔버스 DPI 및 크기 갱신 함수
    const updateCanvasSize = useCallback((w: number, h: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const {size, ctx} = setupCanvasDpi(canvas, w, h);
        sizeRef.current = size;

        // 정적 드로우 콜백이 있으면 크기 변경 시 즉시 1회 다시 그리기
        if (onDrawRef.current) {
            onDrawRef.current({
                ctx,
                size,
                time: performance.now(),
                deltaTime: 0,
                frameCount: 0,
                pointer: pointerRef.current
            });
        }
    }, [pointerRef]);

    // 리사이즈 및 가시성 옵저버 부착
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // 초기 크기 설정
        const initialWidth = fixedWidth ?? canvas.parentElement?.clientWidth ?? canvas.clientWidth ?? 300;
        const initialHeight = fixedHeight ?? canvas.clientHeight ?? 150;
        updateCanvasSize(initialWidth, initialHeight);

        // 부모 컨테이너 크기 감지
        const targetElement = canvas.parentElement || canvas;
        const cleanupResize = observeElementResize(targetElement, ({width, height}) => {
            const newWidth = fixedWidth ?? width;
            const newHeight = fixedHeight ?? (height > 0 ? height : initialHeight);
            updateCanvasSize(newWidth, newHeight);
        });

        // 가시성 감지
        let cleanupVisibility = () => {
        };
        if (pauseWhenHidden) {
            cleanupVisibility = observeVisibility(canvas, (visible) => {
                setIsVisible(visible);
            });
        }

        return () => {
            cleanupResize();
            cleanupVisibility();
        };
    }, [fixedWidth, fixedHeight, pauseWhenHidden, updateCanvasSize]);

    // 루프 활성화 조건: onFrame 함수가 있고, 가시성 조건 충족
    const loopEnabled = Boolean(onFrame) && (!pauseWhenHidden || isVisible);

    const {isPlaying, start, stop, toggle} = useCanvasLoop({
        enabled: loopEnabled,
        autoPlay,
        fpsLimit,
        onTick: ({time, deltaTime, frameCount}) => {
            const canvas = canvasRef.current;
            if (!canvas || !onFrameRef.current) return;

            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            onFrameRef.current({
                ctx,
                size: sizeRef.current,
                time,
                deltaTime,
                frameCount,
                pointer: trackPointer
                    ? pointerRef.current
                    : {x: 0, y: 0, prevX: 0, prevY: 0, isDown: false, isInside: false}
            });
        }
    });

    return {
        canvasRef,
        size: sizeRef.current,
        pointer: pointerRef.current,
        isPlaying,
        start,
        stop,
        toggle
    };
}
