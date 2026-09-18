'use client';

/**
 * @fileoverview CacheShoppingStoryDemo
 * 쇼핑몰 시나리오(유준·서아) 4장으로 감싼 Cache Components 내러티브 래퍼.
 * 캔버스 로직은 기존 4개 데모(CacheShellDemo 등)를 그대로 재사용하고, 여기서는
 * 장 전환·역할 배지·내레이션·4장 영향 범위 목록만 조립한다.
 */

import React, { useState } from 'react';
import { CacheShellDemo } from '../CacheShellDemo';
import { CacheKeysDemo } from '../CacheKeysDemo';
import { CacheLifetimeDemo } from '../CacheLifetimeDemo';
import { CacheTagsDemo } from '../CacheTagsDemo';
import { RoleBadge } from './RoleBadge';
import { SceneNav } from './SceneNav';
import { useSceneController } from './useSceneController';
import type { SceneId } from './scenes';

const SCENE_DEMO: Record<SceneId, React.ReactNode> = {
  home: <CacheShellDemo />,
  'product-detail': <CacheKeysDemo />,
  category: <CacheLifetimeDemo />,
  'price-change': <CacheTagsDemo />
};

export const CacheShoppingStoryDemo: React.FC = () => {
  const { index, scene, total, goTo, next, prev } = useSceneController();
  const [showNarration, setShowNarration] = useState(true);

  const selectScene = (i: number) => {
    goTo(i);
    setShowNarration(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SceneNav currentIndex={index} onSelect={selectScene} />
        <RoleBadge role={scene.role} roleName={scene.roleName} />
      </div>

      {showNarration && (
        <div className="relative rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 pr-14 text-sm leading-relaxed text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-300">
          <p>{scene.narration}</p>
          <button
            type="button"
            onClick={() => setShowNarration(false)}
            className="absolute right-3 top-3 text-xs font-semibold text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          >
            닫기
          </button>
        </div>
      )}

      {SCENE_DEMO[scene.id]}

      {scene.impactList && (
        <div className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-xs text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
          <p className="mb-2 font-semibold text-zinc-700 dark:text-zinc-300">
            같은 태그로 함께 바뀌는 화면
          </p>
          <ul className="flex flex-wrap gap-2">
            {scene.impactList.map((item) => (
              <li key={item} className="rounded-full bg-zinc-100 px-2.5 py-1 dark:bg-zinc-800">
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex items-center justify-between text-xs font-semibold text-zinc-500">
        <button type="button" onClick={prev} disabled={index === 0} className="disabled:opacity-30">
          ← 이전 장
        </button>
        <span>
          {index + 1} / {total}
        </span>
        <button
          type="button"
          onClick={next}
          disabled={index === total - 1}
          className="disabled:opacity-30"
        >
          다음 장 →
        </button>
      </div>
    </div>
  );
};
