'use client'
import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'
import type { TaggedProductSnapshot } from '../types'
import type { LastAction } from './FetchExtendedTagDemo'

export interface VerificationFooterProps {
  lastAction: LastAction
  shoesChanged: boolean
  windbreakerChanged: boolean
  shoes: TaggedProductSnapshot
  windbreaker: TaggedProductSnapshot
}

const ACTION_LABEL: Record<Exclude<LastAction, null>, string> = {
  shoes: '러닝화',
  windbreaker: '윈드브레이커',
  both: '러닝화 + 윈드브레이커',
}

export function VerificationFooter({
  lastAction,
  shoesChanged,
  windbreakerChanged,
  shoes,
  windbreaker,
}: VerificationFooterProps) {
  const expectedShoesChanged = lastAction === 'shoes' || lastAction === 'both'
  const expectedWindbreakerChanged = lastAction === 'windbreaker' || lastAction === 'both'

  const isMatched =
    lastAction === null ? undefined : shoesChanged === expectedShoesChanged && windbreakerChanged === expectedWindbreakerChanged

  const expected =
    lastAction === null
      ? '- 아직 태그를 무효화하지 않았습니다. 위에서 버튼을 눌러 무효화한 태그만 캐시가 갱신되는지 확인해 보세요.'
      : [
          `- 무효화한 태그(${ACTION_LABEL[lastAction]})가 붙은 fetch만 캐시 미스가 발생해야 합니다.`,
          `- 러닝화: ${expectedShoesChanged ? '변경됨(캐시 미스)' : '이전 값 유지(캐시 HIT)'}`,
          `- 윈드브레이커: ${expectedWindbreakerChanged ? '변경됨(캐시 미스)' : '이전 값 유지(캐시 HIT)'}`,
        ].join('\n')

  const actual =
    lastAction === null
      ? '- 상호작용 대기 중 (위에서 태그 무효화 버튼을 눌러 주세요.)'
      : [
          `- 러닝화 fetchCount=${shoes.fetchCount}, fetchedAt=${shoes.fetchedAt} → ${shoesChanged ? '변경됨' : '이전 값 유지'}`,
          `- 윈드브레이커 fetchCount=${windbreaker.fetchCount}, fetchedAt=${windbreaker.fetchedAt} → ${windbreakerChanged ? '변경됨' : '이전 값 유지'}`,
        ].join('\n')

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="캐시 태그별 무효화 대조"
        expected={expected}
        actual={actual}
        isMatched={isMatched}
        description="revalidateTag()로 무효화한 태그의 fetch만 다음 렌더에서 캐시 미스가 발생해야 하고, 무효화하지 않은 태그의 fetch는 그대로 캐시 HIT을 유지해야 합니다."
      />
      <DemoDeepDiveCard title="Next.js 확장 fetch tags 태그 바인딩 & 온디맨드 revalidation">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              <code>fetch(url, {'{'} cache: &apos;force-cache&apos;, next: {'{'} tags: [&apos;shoes&apos;] {'}'} {'}'})</code>는 캐시된 요청에 하나 이상의
              캐시 태그(Cache Tags)를 부여하는 확장 옵션입니다. baseline zone처럼 <code>cacheComponents</code>를 쓰지 않는 프로젝트에서는 fetch가 기본적으로
              캐시되지 않으므로 <code>cache: &apos;force-cache&apos;</code>를 명시해야 실제로 캐시되고, 그 캐시 항목에만 태그가 붙습니다. 이후 Server Action이나
              Route Handler에서 <code>revalidateTag(tag, profile)</code>를 호출하면 그 태그가 붙은 캐시 항목만 무효화됩니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 이 데모의 실제 동작 원리</h5>
            <p>
              이 데모는 러닝화·윈드브레이커 두 상품을 이 데모 전용 Route Handler(<code>api/[product]/route.ts</code>)에서 각각 다른 캐시 태그로 fetch합니다.
              Route Handler는 실제로 실행될 때마다 <code>fetchCount</code>를 늘리고 새 <code>fetchedAt</code>을 반환합니다. 페이지가 다시 렌더링될 때마다
              동일한 URL과 태그로 다시 fetch를 호출하지만, <code>force-cache</code> 덕분에 캐시가 살아있는 동안은 Route Handler가 다시 실행되지 않고 이전
              응답이 그대로 재사용됩니다. &quot;러닝화 캐시 태그 무효화&quot; 버튼을 누르면 Server Action이 실제로{' '}
              <code>revalidateTag(&apos;fetch-extended-tag-option-shoes&apos;, {'{'} expire: 0 {'}'})</code>를 호출하고, 이어서
              <code>router.refresh()</code>가 페이지의 두 fetch를 모두 다시 실행시킵니다. 이때 러닝화 fetch만 캐시 미스로 Route Handler를 다시 호출해
              값이 바뀌고, 윈드브레이커 fetch는 캐시가 그대로 살아있어 이전 값을 유지합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>초정밀 온디맨드 캐시 무효화</strong>: 전체 페이지나 사이트를 다시 빌드하지 않고 변경된 엔티티(예: 특정 상품)의 캐시만 정밀 타겟팅하여 삭제합니다.</li>
              <li><strong>다중 태그 다대다(N:M) 관계 구성</strong>: 단일 fetch에 여러 태그를 부여하면 상품별, 카테고리별로 유연한 연쇄 무효화를 구현할 수 있습니다.</li>
              <li><strong>데이터 신선도와 캐시 히트율 양립</strong>: 시간 만료를 기다리지 않고 데이터 변경 이벤트 발생 시점에만 캐시를 갱신합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>쇼핑몰 상품 재고·가격 변경 시 해당 상품의 캐시만 즉시 갱신</li>
              <li>게시판 글 작성/수정/삭제 시 게시글 목록 캐시 즉시 무효화</li>
              <li>프로모션 배너 교체 시 온디맨드 배너 캐시 갱신</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>
                <strong>revalidateTag는 2개 인자가 필요합니다</strong>: Next.js 16.3.2 기준 <code>revalidateTag(tag)</code> 단일 인자 호출은 deprecated입니다.
                <code>{'{'} expire: 0 {'}'}</code>은 즉시 만료(다음 요청이 블로킹 재검증/캐시 미스), <code>&apos;max&apos;</code>는 stale-while-revalidate로
                캐시된 값을 먼저 보여주고 백그라운드에서 새로 고칩니다.
              </li>
              <li><strong>force-cache 없이는 태그가 무의미합니다</strong>: cacheComponents를 쓰지 않는 zone에서는 fetch가 기본적으로 캐시되지 않으므로, tags를 붙여도 캐시된 적이 없으면 무효화할 대상이 없습니다.</li>
              <li><strong>revalidateTag 실행 컨텍스트</strong>: Server Action 또는 Route Handler 등 서버 변경 컨텍스트에서만 호출할 수 있습니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
