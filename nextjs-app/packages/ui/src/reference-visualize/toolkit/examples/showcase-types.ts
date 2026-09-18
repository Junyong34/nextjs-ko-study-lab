/**
 * @fileoverview Showcase Types Definition
 */

import React from 'react';

export type DemoKey =
  | 'streaming-timeline'
  | 'hydration-timeline'
  | 'ppr-timeline'
  | 'transitions-timeline'
  | 'optimistic-timeline'
  | 'isr-timeline'
  | 'streaming-waterfall'
  | 'isr-cache'
  | 'render-tree'
  | 'metadata-flow'
  | 'render-strategy'
  | 'cache-shell'
  | 'cache-keys'
  | 'cache-lifetime'
  | 'cache-tags'
  | 'health'
  | 'angle'
  | 'confetti';

export type DemoGroup = 'timeline' | 'nextjs' | 'cache-components' | 'generic';

export interface DemoMeta {
  key: DemoKey;
  group: DemoGroup;
  layout: 'wide' | 'half';
  title: string;
  category: string;
  badgeColor: string;
  description: string;
  gridDescription: string;
  modules: string[];
  component: React.ReactNode;
  /** 검색 키워드 노출용 <meta name="keywords"> 값. 데모 고유 기술어 + "Next.js" 조합 */
  keywords?: string[];
}
