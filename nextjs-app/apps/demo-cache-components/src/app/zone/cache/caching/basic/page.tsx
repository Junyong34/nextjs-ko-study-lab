import React from 'react'
import { cacheTag, revalidateTag } from 'next/cache'
import {
  DemoContainer,
  DemoGuideCard,
  DemoPlaygroundCard,
  ExpectedActualPanel,
  DemoDeepDiveCard,
} from '@study/demo-kit'
import { CacheActions } from './CacheActions'

// 1. 'use cache' 적용 데이터 로딩 함수 (타임스탬프와 캐시 ID 반환)
async function getCachedTimestamp() {
  'use cache'
  cacheTag('caching-basic:data')

  const now = new Date()
  const timestamp = now.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3,
  })
  const cacheId = Math.random().toString(36).substring(2, 8).toUpperCase()

  return {
    timestamp,
    cacheId,
    generatedAt: now.toISOString(),
  }
}

// 2. Server Action: 특정 캐시만 선택 무효화
async function invalidateCacheAction() {
  'use server'
  revalidateTag('caching-basic:data', 'max')
}

export default async function DemoPage() {
  const cachedData = await getCachedTimestamp()

  const expectedText =
    '• 일반 브라우저 새로고침: getCachedTimestamp()의 반환값이 영구 캐싱되어 캐시 ID와 시각이 유지됨\n• revalidateTag() 실행: 캐시 태그가 무효화되어 다음 요청 시 새 캐시 ID가 발급됨'

  const actualText = `• 캐시 고유 ID: #${cachedData.cacheId}\n• 캐시 생성 시각: ${cachedData.timestamp}\n• 적용 태그: cacheTag('caching-basic:data')`

  return (
    <DemoContainer className="space-y-6">
      {/* 1단. 상단 가이드 필드셋 */}
      <DemoGuideCard
        title="Next.js 16 `use cache` 지시어 & 태그 기반 온디맨드 무효화"
        concept="함수 또는 컴포넌트에 'use cache'를 선언하면 실행 결과가 자동으로 영구 캐싱됩니다. cacheTag로 이름을 붙여두면 필요할 때 revalidateTag로 특정 캐시만 즉시 새로고침할 수 있습니다."
        steps={[
          {
            step: 1,
            title: '초기 캐시 상태 확인',
            description: '아래 발급된 캐시 생성 시각과 고유 ID(#...)를 확인합니다.',
            actionBadge: '캐시 확인',
          },
          {
            step: 2,
            title: '브라우저 새로고침 클릭',
            description: '[브라우저 새로고침]을 눌러도 캐시 ID가 변하지 않고 유지되는 것을 봅니다.',
            actionBadge: '캐시 보존 확인',
          },
          {
            step: 3,
            title: '캐시 무효화 클릭',
            description: '[캐시 무효화 (revalidateTag)]를 눌러 새 캐시 ID로 즉시 갱신합니다.',
            actionBadge: '온디맨드 무효화',
          },
        ]}
      />

      {/* 2단. 실습 조작 영역 (DemoPlaygroundCard) */}
      <DemoPlaygroundCard title="use cache 함수 결과 및 태그 무효화 제어" className="space-y-4">
        <div className="space-y-1">
          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded font-mono">
              getCachedTimestamp()
            </code>{' '}
            함수에{' '}
            <code className="text-xs text-amber-600 dark:text-amber-400 font-semibold font-mono">
              'use cache'
            </code>
            와{' '}
            <code className="text-xs text-amber-600 dark:text-amber-400 font-semibold font-mono">
              cacheTag('caching-basic:data')
            </code>
            가 적용되어 있습니다.
          </p>
        </div>

        {/* 캐시 데이터 카드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="p-3.5 rounded-md bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800 space-y-1">
            <div className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
              캐시 생성 시각 (Cache Timestamp)
            </div>
            <div className="font-mono text-sm font-bold text-zinc-900 dark:text-zinc-100">
              {cachedData.timestamp}
            </div>
          </div>

          <div className="p-3.5 rounded-md bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800 space-y-1">
            <div className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
              캐시 고유 식별자 (Cache ID)
            </div>
            <div className="font-mono text-sm font-bold text-amber-600 dark:text-amber-400">
              #{cachedData.cacheId}
            </div>
          </div>
        </div>

        {/* 조작 액션 버튼 */}
        <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
          <CacheActions onRevalidate={invalidateCacheAction} />
        </div>
      </DemoPlaygroundCard>

      {/* 3단. 기대값 vs 실제값 검증 패널 */}
      <ExpectedActualPanel
        title="use cache 영구 보존 및 revalidateTag 무효화 검증"
        description="새로고침 시 캐시 유지 및 무효화 Server Action 호출 시 갱신 동작 대조"
        expected={expectedText}
        actual={actualText}
        isMatched={true}
      />

      {/* 4단. 최하단 개념 정리 카드 */}
      <DemoDeepDiveCard title="use cache 지시어의 특징과 cacheTag 무효화 메커니즘">
        <div className="space-y-3">
          <div>
            <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
              1. Next.js 16 use cache의 핵심 특징
            </h4>
            <p className="leading-relaxed">
              기존의 페이지/라우트 단위 캐싱(<code className="font-mono text-[11px]">revalidate = 60</code>)과 달리, <code className="font-mono text-[11px]">'use cache'</code>는 <strong>함수나 컴포넌트 단위로 정밀하게 캐싱 범위를 지정(Cache Components)</strong>할 수 있습니다.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
              2. cacheTag와 revalidateTag의 관계
            </h4>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400">
              <li><strong className="text-zinc-800 dark:text-zinc-200">cacheTag:</strong> 캐시 데이터에 고유한 태그(라벨)를 붙입니다. (예: `product-123`, `user-profile`)</li>
              <li><strong className="text-zinc-800 dark:text-zinc-200">revalidateTag:</strong> 데이터가 수정되었을 때 Server Action에서 해당 태그만 즉시 무효화하여 최신 데이터로 갱신합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </DemoContainer>
  )
}
