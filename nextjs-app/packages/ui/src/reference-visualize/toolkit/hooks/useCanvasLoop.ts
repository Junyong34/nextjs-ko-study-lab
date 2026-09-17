'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { LoopEngine, type LoopTickInfo } from '../core/loop-engine';

export interface UseCanvasLoopOptions {
  onTick: (info: LoopTickInfo) => void;
  autoPlay?: boolean;
  fpsLimit?: number;
  enabled?: boolean;
}

export function useCanvasLoop({
  onTick,
  autoPlay = true,
  fpsLimit,
  enabled = true
}: UseCanvasLoopOptions) {
  const [isPlaying, setIsPlaying] = useState(autoPlay && enabled);
  const onTickRef = useRef(onTick);
  onTickRef.current = onTick;

  const engineRef = useRef<LoopEngine | null>(null);

  useEffect(() => {
    if (!enabled) {
      engineRef.current?.stop();
      setIsPlaying(false);
      return;
    }

    const engine = new LoopEngine({
      onTick: (info) => onTickRef.current(info),
      fpsLimit
    });
    engineRef.current = engine;

    if (autoPlay) {
      engine.start();
      setIsPlaying(true);
    }

    return () => {
      engine.stop();
      engineRef.current = null;
    };
  }, [autoPlay, fpsLimit, enabled]);

  const start = useCallback(() => {
    if (engineRef.current && enabled) {
      engineRef.current.start();
      setIsPlaying(true);
    }
  }, [enabled]);

  const stop = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.stop();
      setIsPlaying(false);
    }
  }, []);

  const toggle = useCallback(() => {
    if (engineRef.current && enabled) {
      const running = engineRef.current.toggle();
      setIsPlaying(running);
    }
  }, [enabled]);

  return {
    isPlaying,
    start,
    stop,
    toggle
  };
}
