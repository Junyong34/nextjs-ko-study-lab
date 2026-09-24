import React from 'react'
import Link from 'next/link'
import { DemoDeepDiveCard } from '@study/demo-kit'
import { CATCH_ALL_SIBLING_PATH } from '../types'

const ROUTE_TABLE = [
  { url: '/shop', catchAll: '404 (매칭 없음)', optional: 'slug 없음 (undefined)' },
  { url: '/shop/a', catchAll: "['a']", optional: "['a']" },
  { url: '/shop/a/b', catchAll: "['a', 'b']", optional: "['a', 'b']" },
]

export function OptionalCatchAllDeepDive() {
  return (
    <DemoDeepDiveCard title="[[...slug]] Optional Catch-all 세그먼트">
      <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
        <section>
          <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">1. [...slug]와 딱 하나 다른 점</h5>
          <p className="break-keep">
            이중 대괄호 <code>[[...slug]]</code>는 catch-all을 <b>선택적</b>으로 만듭니다. 차이는 세그먼트가 0개인
            <code> /shop</code> 자체도 같은 page가 받는다는 것 하나이며, 이때 <code>params.slug</code>는 <code>undefined</code>입니다.
            1개 이상이면 <code>[...slug]</code>와 똑같이 <code>string[]</code>입니다.
          </p>
          <div className="mt-2 overflow-x-auto rounded border border-zinc-200 dark:border-zinc-800">
            <table className="w-full text-left font-mono text-[11px]">
              <thead className="bg-zinc-50 text-zinc-500 dark:bg-zinc-900/60">
                <tr>
                  <th className="px-3 py-1">URL</th>
                  <th className="px-3 py-1">shop/[...slug]</th>
                  <th className="px-3 py-1">shop/[[...slug]]</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {ROUTE_TABLE.map((r) => (
                  <tr key={r.url}>
                    <td className="px-3 py-1">{r.url}</td>
                    <td className="px-3 py-1">{r.catchAll}</td>
                    <td className="px-3 py-1">{r.optional}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-1.5 text-[11px] text-zinc-500">
            공식 문서(dynamic-routes) 표 기준. <code>/shop</code>에서 <code>[...slug]</code>가 404를 내는 것은 형제 실습에서 실제 요청으로 확인할 수 있습니다:{' '}
            <Link href={CATCH_ALL_SIBLING_PATH} className="font-semibold text-zinc-900 underline dark:text-zinc-100">
              [...slug] 형제 실습 열기
            </Link>
          </p>
        </section>

        <section>
          <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">2. 이 실습의 파일 구조</h5>
          <pre className="overflow-x-auto rounded bg-zinc-100 p-2.5 font-mono text-[11px] dark:bg-zinc-900">{`optional-catch-all/
├── page.tsx                    ← 실습 첫 화면 (/optional-catch-all)
└── shop/
    └── [[...slug]]/page.tsx    ← /shop, /shop/a, /shop/a/b ... 전부 처리`}</pre>
          <p className="mt-1.5 break-keep">
            <code>[[...slug]]</code>를 첫 화면 <code>page.tsx</code>와 같은 폴더에 두면 두 파일이 같은 URL을 두고 겹칩니다. Next.js는 이를 빌드 오류
            (&ldquo;You cannot define a route with the same specificity as a optional catch-all route&rdquo;)로 막으므로 <code>shop/</code> 아래로 한 단계 내렸습니다.
          </p>
        </section>

        <section>
          <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">3. 실무 주의사항</h5>
          <ul className="list-inside list-disc space-y-1 pl-1 text-zinc-600 dark:text-zinc-400">
            <li>
              타입은 <code>{'{ slug?: string[] }'}</code>입니다. <code>slug.length</code>, <code>slug.join()</code>을 바로 쓰면 <code>/shop</code>에서 TypeError가 나므로
              <code> slug ?? []</code> 또는 <code>if (!slug)</code>로 먼저 분기합니다.
            </li>
            <li>
              공식 문서 표는 <code>{'{ slug: undefined }'}</code>로 적지만, 0개 경로에서 <code>slug</code> 키가 객체에 아예 없는지는 실측 표의
              <code> &apos;slug&apos; in (await params)</code>, <code>Object.keys</code> 행으로 확인합니다. 어느 쪽이든 <code>params.slug</code>를 읽으면
              <code> undefined</code>이고, <code>JSON.stringify</code>는 undefined 값을 출력하지 않으므로 직렬화 결과만 보고 판단하지 않습니다.
            </li>
            <li>
              한글·공백 세그먼트는 주소에서 퍼센트 인코딩됩니다. <code>slug[i]</code>가 인코딩된 채로 오는지 디코딩되어 오는지는 실측 표의 &ldquo;받은 값 / 디코딩 값&rdquo; 비교로
              확인하고, 화면 표시나 DB 조회 전에 필요하면 <code>decodeURIComponent</code>를 적용합니다.
            </li>
          </ul>
        </section>
      </div>
    </DemoDeepDiveCard>
  )
}
