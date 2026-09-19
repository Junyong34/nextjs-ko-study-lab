'use client';

/**
 * @fileoverview cache-regions/RegionCodeMap.tsx
 * `app/page.tsx`가 네 영역을 어떻게 조립하는지 보여 주는 코드 지도.
 * 줄마다 영역 id가 붙어 있어 캔버스·노트와 같은 호버 상태를 공유한다 — "이 줄이 저 칸"을 잇는다.
 */

import React from 'react';
import { MODE_COLOR } from '../../components/cache-components/paint-regions';
import { REGION_BY_ID, type RegionId } from '../../components/cache-components/regions-model';

interface CodeLine {
  text: string;
  region?: RegionId;
  comment?: string;
}

const PAGE_LINES: CodeLine[] = [
  { text: '// app/page.tsx' },
  { text: 'export default function Page() {' },
  { text: '  return (' },
  { text: '    <>' },
  { text: '      <Header />', region: 'header', comment: '데이터 없음 → 정적 셸' },
  { text: '      <ProductList />', region: 'products', comment: "컴포넌트 첫 줄 'use cache' → 출력 캐시, 셸에 포함" },
  { text: '      <Suspense fallback={<BannerSkeleton />}>', region: 'price' },
  { text: '        <PriceBanner />', region: 'price', comment: 'cookies() 읽어 요청마다 렌더 · getRate()만 캐시' },
  { text: '      </Suspense>', region: 'price' },
  { text: '      <Suspense fallback={<ListSkeleton />}>', region: 'recs' },
  { text: '        <Recommendations />', region: 'recs', comment: 'cookies() + DB → 캐시 없음, 스트리밍' },
  { text: '      </Suspense>', region: 'recs' },
  { text: '    </>' },
  { text: '  )' },
  { text: '}' }
];

const SNIPPETS: Record<Exclude<RegionId, 'header'>, string[]> = {
  products: [
    'export async function ProductList() {',
    "  'use cache'",
    "  cacheLife('hours'); cacheTag('products')",
    '  const items = await db.products.list()',
    '  return <Grid items={items} />',
    '}'
  ],
  price: [
    'export async function PriceBanner() {',
    "  const currency = (await cookies()).get('currency')?.value ?? 'KRW'",
    '  const rate = await getRate(currency)   // 인자가 캐시 키가 된다',
    '  return <Banner rate={rate} currency={currency} />',
    '}',
    '// lib/rates.ts',
    'export async function getRate(currency: string) {',
    "  'use cache'",
    "  cacheLife('minutes')",
    '  return fetchRate(currency)   // 외부 환율 API',
    '}'
  ],
  recs: [
    'export async function Recommendations() {',
    "  const session = (await cookies()).get('session')?.value",
    '  const items = await db.recommendations.forSession(session)',
    '  return <List items={items} />',
    '}'
  ]
};

export interface RegionCodeMapProps {
  hoveredId: RegionId | null;
  onHover: (id: RegionId | null) => void;
}

export const RegionCodeMap: React.FC<RegionCodeMapProps> = ({ hoveredId, onHover }) => {
  const snippetId = hoveredId && hoveredId !== 'header' ? hoveredId : 'products';
  const snippetColor = MODE_COLOR[REGION_BY_ID[snippetId].mode];
  return (
    <div className="grid gap-2 md:grid-cols-2">
      <pre className="overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-[10.5px] leading-[1.55] text-slate-700">
        {PAGE_LINES.map((line, i) => {
          const color = line.region ? MODE_COLOR[REGION_BY_ID[line.region].mode] : undefined;
          const active = line.region !== undefined && line.region === hoveredId;
          const dim = hoveredId !== null && line.region !== undefined && !active;
          return (
            <div
              key={i}
              onMouseEnter={() => line.region && onHover(line.region)}
              onMouseLeave={() => onHover(null)}
              className={`-mx-1 flex flex-wrap gap-x-3 rounded px-1 transition-colors ${line.region ? 'cursor-default' : ''} ${active ? 'bg-white shadow-xs' : ''}`}
              style={{ opacity: dim ? 0.45 : 1, borderLeft: `2px solid ${color ?? 'transparent'}` }}
            >
              <span className="whitespace-pre">{line.text}</span>
              {line.comment && <span className="whitespace-normal break-keep text-[9.5px]" style={{ color }}>{`// ${line.comment}`}</span>}
            </div>
          );
        })}
      </pre>
      <pre
        className="overflow-x-auto rounded-lg border bg-white p-3 font-mono text-[10.5px] leading-[1.55] text-slate-700"
        style={{ borderColor: `${snippetColor}66` }}
      >
        <div className="mb-1 text-[9.5px] font-bold" style={{ color: snippetColor }}>
          {REGION_BY_ID[snippetId].file} — 캔버스·코드 지도에 마우스를 올리면 바뀝니다
        </div>
        {SNIPPETS[snippetId].map((l, i) => (
          <div key={i} className="whitespace-pre">
            {l}
          </div>
        ))}
      </pre>
    </div>
  );
};
