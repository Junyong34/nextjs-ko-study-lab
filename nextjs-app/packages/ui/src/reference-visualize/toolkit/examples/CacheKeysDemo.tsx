'use client';

/**
 * @fileoverview CacheKeysDemo
 * `use cache` 경계와 캐시 키. 재생을 기다리지 않는다 —
 * 값을 바꾸는 즉시 바뀐 키 조각이 강조되고 HIT/MISS가 갈린다.
 * 근거: `03-api-reference/01-directives/use-cache.md:74-99`(키), `:194`(경계).
 */

import React, { useRef, useState } from 'react';
import { CACHE_CONTROL, CacheFrame } from '../components/cache-components/CacheFrame';
import { paintKeys } from '../components/cache-components/paint-keys';
import {
  keySegments,
  readEntry,
  type CacheEntry,
  type KeyInput,
  type KeySegmentId
} from '../components/cache-components/model';
import type { NoteItem } from '../components/structure';

const INITIAL: KeyInput = { build: 'v1', product: '1', locale: 'ko' };
const FLASH_MS = 900;
const CANVAS_H = 340;

const NOTES: NoteItem[] = [
  {
    id: 'boundary',
    label: '경계 안에서는 요청 API를 읽을 수 없다',
    meta: 'use-cache.md:194',
    detail:
      '캐시된 함수·컴포넌트는 cookies(), headers(), searchParams에 접근할 수 없다. 제약은 호출 스택을 따라 전파되어, 캐시 함수가 부르는 헬퍼가 읽어도 next-request-in-use-cache로 똑같이 실패한다. 경계 밖에서 읽어 인자로 넘겨야 한다.',
    color: '#dc2626'
  },
  {
    id: 'key',
    label: '키는 무엇으로 만들어지나',
    meta: 'use-cache.md:74-99',
    detail:
      'Build ID + Function ID(함수의 위치·시그니처 해시) + 직렬화된 인자로 만들어진다. 개발 모드에서는 HMR 해시도 들어간다. 그래서 배포가 바뀌면 모든 항목이 무효가 되고, 인자가 하나만 달라도 별개의 항목이 된다.',
    color: '#2563eb'
  },
  {
    id: 'closure',
    label: '캡처한 외부 변수도 인자가 된다',
    meta: 'use-cache.md:82-99',
    detail:
      '캐시된 함수가 바깥 스코프의 변수를 참조하면 그 변수가 자동으로 인자로 묶여 키에 포함된다. 의도치 않게 사용자별 값을 캡처하면 캐시가 사용자 수만큼 쪼개지므로, 무엇이 키에 들어가는지 항상 확인해야 한다.',
    color: '#7c3aed'
  },
  {
    id: 'storage',
    label: '이 데모의 저장소는 단순화한 가정이다',
    meta: 'use-cache.md:198-215',
    detail:
      '이 데모는 저장소가 계속 유지된다고 가정한다. 실제로 기본 인메모리 핸들러를 쓰는 서버리스 환경에서는 요청 간 보존이 보장되지 않지만, 자체 호스팅에서는 유지된다. 필요하면 use cache: remote로 전용 핸들러를 쓴다.',
    color: '#64748b'
  }
];

export const CacheKeysDemo: React.FC = () => {
  // 첫 조회도 실제로 저장해 둔다. 그래야 값을 바꿨다가 되돌렸을 때 HIT이 되어
  // "같은 키면 재사용"이라는 인과가 성립한다.
  const [input, setInput] = useState<KeyInput>(INITIAL);
  const [entries, setEntries] = useState<CacheEntry[]>(() => readEntry([], INITIAL).entries);
  const [hit, setHit] = useState(false);
  const [violation, setViolation] = useState(false);
  const [noteHover, setNoteHover] = useState<string | null>(null);

  const flashRef = useRef<{ id: KeySegmentId | null; at: number }>({ id: null, at: 0 });
  const stateRef = useRef({ entries, hit, input, violation });
  stateRef.current = { entries, hit, input, violation };

  /** 값을 바꾸는 즉시 조회하고 저장한다 — 인과가 한 동작 안에 있어야 읽힌다 */
  const change = (field: keyof KeyInput, value: string) => {
    const next = { ...input, [field]: value };
    const result = readEntry(entries, next);
    flashRef.current = { id: field as KeySegmentId, at: performance.now() };
    setInput(next);
    setEntries(result.entries);
    setHit(result.hit);
  };

  const reset = () => {
    flashRef.current = { id: null, at: 0 };
    setInput(INITIAL);
    setEntries(readEntry([], INITIAL).entries);
    setHit(false);
  };

  const select = (field: keyof KeyInput, options: [string, string][]) => (
    <select
      className={CACHE_CONTROL}
      value={input[field]}
      onChange={(event) => change(field, event.target.value)}
    >
      {options.map(([value, text]) => (
        <option key={value} value={value}>
          {text}
        </option>
      ))}
    </select>
  );

  return (
    <CacheFrame
      title="use cache 경계와 캐시 키"
      source="https://nextjs.org/docs/app/api-reference/directives/use-cache#cache-keys"
      height={CANVAS_H}
      notes={NOTES}
      hoveredId={noteHover}
      onHoverNote={setNoteHover}
      controls={
        <>
          <span className="text-[11px] font-semibold text-slate-500">인자</span>
          {select('product', [
            ['1', '상품 1'],
            ['2', '상품 2']
          ])}
          {select('locale', [
            ['ko', 'locale ko'],
            ['en', 'locale en']
          ])}
          {select('build', [
            ['v1', 'Build v1'],
            ['v2', 'Build v2']
          ])}
          <button type="button" className={CACHE_CONTROL} onClick={reset}>
            초기화
          </button>
          <button
            type="button"
            onClick={() => setViolation((prev) => !prev)}
            className={`${CACHE_CONTROL} ${violation ? 'border-red-400 bg-red-50 text-red-700' : ''}`}
          >
            {violation ? '경계 위반 표시 중' : '경계 안에서 cookies() 읽어 보기'}
          </button>
        </>
      }
      conclusion={
        violation
          ? '경계 안에서 cookies()를 읽으면 next-request-in-use-cache 오류가 발생합니다. 밖에서 읽어 인자로 넘기세요.'
          : hit
            ? '같은 키를 찾았습니다 — HIT. 저장된 결과를 그대로 재사용합니다.'
            : '이 조합의 키는 처음입니다 — MISS. 계산 결과를 새 항목으로 저장했습니다. 같은 값으로 되돌리면 HIT가 됩니다.'
      }
      onFrame={({ ctx, size }) => {
        const now = performance.now();
        const age = now - flashRef.current.at;
        const state = stateRef.current;
        paintKeys(ctx, {
          width: size.width,
          height: size.height,
          segments: keySegments(state.input),
          entries: state.entries,
          hit: state.hit,
          violation: state.violation,
          flashId: age < FLASH_MS ? flashRef.current.id : null,
          flash: age < FLASH_MS ? 1 - age / FLASH_MS : 0
        });
      }}
    />
  );
};
