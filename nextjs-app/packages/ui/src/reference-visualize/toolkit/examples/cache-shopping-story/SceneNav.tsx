'use client';

/**
 * @fileoverview SceneNav
 * 4단 장 네비게이션 — 현재 장 강조, 클릭으로 임의 장 이동.
 */

import React from 'react';
import { SCENES } from './scenes';

interface SceneNavProps {
  currentIndex: number;
  onSelect: (index: number) => void;
}

export const SceneNav: React.FC<SceneNavProps> = ({ currentIndex, onSelect }) => (
  <nav className="flex flex-wrap items-center gap-2" aria-label="쇼핑몰 스토리 장 이동">
    {SCENES.map((scene, i) => (
      <button
        key={scene.id}
        type="button"
        onClick={() => onSelect(i)}
        aria-current={i === currentIndex ? 'step' : undefined}
        className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
          i === currentIndex
            ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900'
            : 'border-zinc-200 text-zinc-600 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-500'
        }`}
      >
        {scene.step}. {scene.title}
      </button>
    ))}
  </nav>
);
