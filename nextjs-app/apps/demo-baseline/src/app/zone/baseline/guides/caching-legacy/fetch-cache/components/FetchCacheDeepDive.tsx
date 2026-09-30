import React from 'react'
import { DemoDeepDiveCard } from '@study/demo-kit'

const h = 'font-bold text-zinc-900 dark:text-zinc-100 mb-1'
const ul = 'list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1'

export function FetchCacheDeepDive() {
  return (
    <DemoDeepDiveCard title="레거시 fetch 캐시 옵션과 Data Cache">
      <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
        <div>
          <h5 className={h}>1. 이번 실습에서 본 것</h5>
          <p>
            같은 <code>api/source</code>를 네 가지 옵션으로 fetch했습니다. 원본 Route Handler가 실행될 때만 <code>sourceCount</code>가
            오르므로, 값이 고정이면 Data Cache 응답이고 오르면 원본 실행입니다. <code>force-cache</code>는 무효화 전까지 고정,
            <code> no-store</code>와 옵션 없음은 매번 증가, <code>revalidate</code>는 지정한 초 동안만 고정이었습니다.
          </p>
        </div>
        <div>
          <h5 className={h}>2. 이 프로젝트 기준 (Next.js 16.3.2, cacheComponents 꺼짐)</h5>
          <ul className={ul}>
            <li>옵션 없는 <code>fetch</code>는 캐시되지 않습니다. 캐시하려면 <code>cache: &apos;force-cache&apos;</code> 또는 <code>next.revalidate</code>를 명시합니다.</li>
            <li>캐시 키에 URL이 포함됩니다. 이 실습이 URL에 <code>?mode=</code>를 붙인 이유입니다.</li>
            <li><code>revalidateTag(tag, {'{ expire: 0 }'})</code>는 <code>next.tags</code>가 붙은 항목만 즉시 만료시킵니다. <code>no-store</code> 요청에는 지울 캐시가 없습니다.</li>
            <li><code>revalidate</code>는 만료 후 첫 요청에 stale 응답을 주고 백그라운드에서 갱신하므로, 값이 바뀌는 시점이 한 요청 늦을 수 있습니다.</li>
          </ul>
        </div>
        <div>
          <h5 className={h}>3. 이 실습이 다루지 않는 것</h5>
          <p>
            Route Segment의 <code>export const revalidate</code>, <code>dynamic</code>, <code>fetchCache</code>와 개별 fetch 옵션의 우선순위는
            <code> guides/caching-legacy/segment-revalidate</code> 실습에서 다룹니다. 이 페이지의 관찰은 개발 서버 기준이며, 프로덕션 빌드의 Data Cache 동작은 확인하지 않았습니다.
          </p>
        </div>
      </div>
    </DemoDeepDiveCard>
  )
}
