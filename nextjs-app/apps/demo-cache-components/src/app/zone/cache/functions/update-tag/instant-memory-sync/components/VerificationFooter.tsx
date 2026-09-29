'use client'

import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'
import type { CartQtyActionResult, CartQtySnapshot } from '../types'

export interface VerificationFooterProps {
  updateTagCache: CartQtySnapshot
  revalidateTagCache: CartQtySnapshot
  updateTagResult: CartQtyActionResult | null
  revalidateTagResult: CartQtyActionResult | null
}

export function VerificationFooter({
  updateTagCache,
  revalidateTagCache,
  updateTagResult,
  revalidateTagResult,
}: VerificationFooterProps) {
  const updateTagMatched = updateTagResult ? updateTagCache.qty === updateTagResult.qty : undefined
  const revalidateTagMatched = revalidateTagResult ? revalidateTagCache.qty === revalidateTagResult.qty : undefined

  // 배지는 updateTag 쪽 read-your-own-writes 보장만으로 판정한다.
  // revalidateTag 쪽은 지연(불일치) 자체가 stale-while-revalidate의 정상 동작이라 pass/fail로 판단하지 않는다.
  const isMatched = updateTagMatched

  const expected =
    "• updateTag() 실행 후 새로고침 1회 이내에 캐시된 조회 수량이 액션 응답 수량과 반드시 같아진다 (read-your-own-writes).\n• revalidateTag(tag, 'max') 실행 직후에는 캐시된 조회 수량이 액션 응답 수량보다 지연될 수 있다 (stale-while-revalidate)."

  const actual =
    !updateTagResult && !revalidateTagResult
      ? '• 아직 두 버튼 중 어느 것도 실행하지 않았습니다.'
      : [
          `• updateTag 흐름: 캐시 수량 ${updateTagCache.qty} / 액션 응답 수량 ${
            updateTagResult ? updateTagResult.qty : '-'
          } → ${
            updateTagResult ? (updateTagMatched ? '일치 (즉시 반영됨)' : '불일치 (새로고침 진행 중)') : '대기 중'
          }`,
          `• revalidateTag 흐름: 캐시 수량 ${revalidateTagCache.qty} / 액션 응답 수량 ${
            revalidateTagResult ? revalidateTagResult.qty : '-'
          } → ${
            revalidateTagResult
              ? revalidateTagMatched
                ? '일치 (백그라운드 재검증 완료)'
                : '불일치 (SWR 지연 중, 정상 동작)'
              : '대기 중'
          }`,
        ].join('\n')

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="updateTag() vs revalidateTag() 즉시성 검증"
        expected={expected}
        actual={actual}
        isMatched={isMatched}
        description="updateTag 흐름의 캐시-액션 수량 일치 여부만으로 배지를 판정합니다(공식 문서가 보장하는 결정론적 동작). revalidateTag 흐름은 지연 자체가 정상이므로 수치만 함께 관찰합니다."
      />
      <DemoDeepDiveCard title="updateTag()와 revalidateTag()의 즉시성 차이">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              <code>updateTag(tag)</code>는 <strong>Server Action 안에서만</strong> 호출할 수 있는 API로,
              지정한 태그의 <code>'use cache'</code> 캐시를 즉시 만료시킵니다. 다음 요청은 오래된 값을 먼저
              보여주지 않고 새 데이터를 기다립니다 — 공식 문서가 <strong>read-your-own-writes</strong> 시나리오로
              부르는 동작입니다. 반대로 <code>revalidateTag(tag, 'max')</code>는 해당 태그를 stale로만
              표시합니다. 다음 방문은 기존 값을 먼저 보여주고 백그라운드에서 새 값을 준비하는{' '}
              <strong>stale-while-revalidate</strong> 방식입니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              왼쪽 카드는 <code>incrementViaUpdateTagAction()</code>을 호출합니다. 이 Server Action은 장바구니
              수량을 늘리고 <code>updateTag('instant-memory-sync:cart-qty-update-tag')</code>를 실행합니다.{' '}
              <code>router.refresh()</code> 직후 <code>page.tsx</code>가 다시 실행돼{' '}
              <code>getUpdateTagCartCache()</code>를 호출하면, 캐시가 이미 만료됐으므로 새 값을 기다렸다가
              반환합니다 — 그래서 캐시된 조회 수량이 액션 응답과 곧바로 같아집니다. 오른쪽 카드는{' '}
              <code>incrementViaRevalidateTagAction()</code>이{' '}
              <code>revalidateTag('instant-memory-sync:cart-qty-revalidate-tag', 'max')</code>만 호출합니다.
              같은 새로고침에서 <code>getRevalidateTagCartCache()</code>는 stale 상태의 이전 값을 먼저 반환할
              수 있어, 캐시 수량이 액션 응답보다 뒤처질 수 있습니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>
                <strong>updateTag</strong>: 사용자가 방금 만든 변경(글쓰기, 결제, 프로필 수정 등)을 새로고침
                없이도 다음 화면에서 곧바로 확인시킬 수 있습니다.
              </li>
              <li>
                <strong>revalidateTag</strong>: 여러 사용자에게 서빙되는 콘텐츠(상품 목록, 게시판)를 매 요청마다
                블로킹하지 않고 점진적으로 갱신할 수 있습니다.
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>updateTag: 게시글 작성 직후 목록·상세 반영, 장바구니 담기 직후 결제 화면 확인</li>
              <li>revalidateTag: 웹훅으로 받은 CMS 콘텐츠 변경, 정기 배치로 갱신되는 상품 카탈로그</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>
                <strong>사용 위치 제한</strong>: <code>updateTag</code>는 Server Action 전용입니다. Route
                Handler에서 호출하면 에러가 발생하며, 그런 경우 <code>revalidateTag</code>를 사용해야 합니다.
              </li>
              <li>
                <strong>즉시 재계산이 아님</strong>: <code>revalidateTag(tag, 'max')</code>는 호출 즉시 새
                값을 계산하지 않습니다 — 태그를 stale로 표시할 뿐이며, 다음 방문에야 백그라운드 재검증이
                시작됩니다.
              </li>
              <li>
                <strong>데모 접두사</strong>: 태그 이름에 <code>instant-memory-sync:</code>를 붙여 zone
                전역에서 공유되는 다른 데모의 캐시와 충돌하지 않게 합니다.
              </li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
