/**
 * @fileoverview structure/meta-merge.ts
 * 세그먼트별 metadata export의 병합 계산.
 *
 * 근거 — `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-metadata.md`
 * - 평가 순서: root layout → 중첩 layout → page (`:1318-1326`)
 * - **얕은(shallow) 병합**이라 같은 키는 뒤 세그먼트가 앞을 **교체**한다 (`:1328`)
 * - 따라서 `openGraph` 같은 중첩 객체는 필드 하나만 다시 써도 **객체 전체가 교체**되어
 *   앞 세그먼트의 나머지 필드가 사라진다 (`:1330`)
 *
 * 이 파일은 그 규칙을 계산으로 그대로 옮긴다. 부분 병합을 하지 않는 것이 요점이다.
 */

import type { MetadataSegment, MetadataTagView } from './types';

/** `<head>`에 항상 들어가는 기본 태그 — metadata를 하나도 쓰지 않아도 나온다 */
export const DEFAULT_HEAD_TAGS = [
  { key: 'charset', value: 'utf-8' },
  { key: 'viewport', value: 'width=device-width, initial-scale=1' }
];

export interface MetadataResolution {
  /** 평가된 순서대로의 전체 항목 (교체된 것 포함) */
  entries: MetadataTagView[];
  /** 최종 <head>에 남는 항목 */
  head: MetadataTagView[];
  /** 스트리밍 모드에서 <body>에 append 되는 항목 */
  bodyAppended: MetadataTagView[];
  /** 지금까지 평가된 세그먼트 수 */
  resolvedSegments: number;
}

/**
 * @param progress 재생 진행도 0~1. `resolveAt`이 이 값 이하인 세그먼트까지만 평가한다.
 * @param streaming `generateMetadata` 스트리밍 여부. 켜면 async 세그먼트의 태그가 <body>로 간다.
 */
export function resolveMetadata(
  segments: MetadataSegment[],
  progress: number,
  streaming: boolean
): MetadataResolution {
  const applied = segments.filter((segment) => progress >= segment.resolveAt);
  const entries: MetadataTagView[] = [];

  for (const segment of applied) {
    for (const entry of segment.entries) {
      // 얕은 병합 — 같은 키의 앞선 값은 병합이 아니라 교체된다
      for (const previous of entries) {
        if (previous.key !== entry.key || previous.overriddenBy) continue;
        previous.overriddenBy = segment.id;
        if (previous.nestedFields && previous.nestedFields.length > 0) {
          previous.lostNested = previous.nestedFields.filter(
            (field) => !(entry.nested ?? []).includes(field)
          );
        }
      }

      entries.push({
        key: entry.key,
        value: entry.value,
        fromSegmentId: segment.id,
        overriddenBy: null,
        atProgress: segment.resolveAt,
        nestedFields: entry.nested,
        streamed: streaming && Boolean(segment.isGenerate)
      });
    }
  }

  const alive = entries.filter((entry) => !entry.overriddenBy);
  return {
    entries,
    head: alive.filter((entry) => !entry.streamed),
    bodyAppended: alive.filter((entry) => entry.streamed),
    resolvedSegments: applied.length
  };
}

/** 교체된 직후 잠깐 취소선으로 남기기 위한 잔상 세기 (0~1) */
export function overrideFade(segments: MetadataSegment[], tag: MetadataTagView, progress: number): number {
  if (!tag.overriddenBy) return 0;
  const killer = segments.find((segment) => segment.id === tag.overriddenBy);
  if (!killer) return 0;
  const age = progress - killer.resolveAt;
  const window = 0.16;
  if (age < 0 || age > window) return 0;
  return 1 - age / window;
}

/** 세그먼트가 지금 막 평가되는 중인지 (카드 강조용) */
export function segmentPulse(segment: MetadataSegment, progress: number): number {
  const age = progress - segment.resolveAt;
  const window = 0.12;
  if (age < 0 || age > window) return 0;
  return 1 - age / window;
}
