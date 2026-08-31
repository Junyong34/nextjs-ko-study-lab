import React from 'react'
import { cacheTag, revalidateTag } from 'next/cache'
import {
  DemoContainer,
  DemoGuideCard,
  DemoPlaygroundCard,
  DemoDeepDiveCard,
} from '@study/demo-kit'
import { CacheVerificationClient } from './components/CacheVerificationClient'

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

  return (
    <DemoContainer className="space-y-6">
      {/* 1단. 상단 가이드 필드셋 */}
      <DemoGuideCard
        title="Next.js 16 use cache 지시어 & cacheTag/revalidateTag 무효화"
        concept="'use cache' 지시어를 선언하면 서버 함수 결과가 캐싱됩니다. cacheTag('caching-basic:data')로 태그를 부여한 뒤 revalidateTag(tag, 'max')를 호출하면 항목은 stale 상태가 되고, 첫 재방문에는 이전 값을 반환하면서 백그라운드에서 새 값을 생성합니다."
        steps={[
          {
            step: 1,
            title: '[캐시 고유 식별자] 초기 상태 확인',
            description: '화면에 표시된 초기 캐시 생성 시각과 고유 ID(#...)를 확인합니다.',
            actionBadge: '캐시 확인',
          },
          {
            step: 2,
            title: '[브라우저 새로고침] 클릭',
            description: '무효화 전에는 캐시 ID와 시각이 유지되는 것을 확인합니다.',
            actionBadge: '캐시 유지',
          },
          {
            step: 3,
            title: '[캐시 무효화 (revalidateTag)] 실행',
            description: 'revalidateTag(tag, "max") Server Action을 호출해 태그가 붙은 캐시를 stale 상태로 표시합니다. 이 버튼만으로 현재 화면의 ID가 즉시 바뀌지는 않습니다.',
            actionBadge: '온디맨드 무효화',
          },
          {
            step: 4,
            title: '[브라우저 새로고침]으로 첫 재방문',
            description: '첫 재방문에서는 이전 캐시 ID가 표시됩니다. 이 요청은 오래된 값을 즉시 반환하면서 백그라운드 재검증을 시작합니다.',
            actionBadge: 'stale 반환',
            observe: '무효화 전 ID가 첫 재방문에서도 유지되고, 재검증은 화면 뒤에서 진행됨',
            observeAt: 'playground',
          },
          {
            step: 5,
            title: '[브라우저 새로고침]으로 재검증 결과 확인',
            description: '재검증이 끝난 뒤 다음 요청에서 새 캐시 ID와 생성 시각이 표시되는지 확인합니다. 환경에 따라 재생성이 끝날 때까지 한 번 더 기다리거나 재방문해야 할 수 있습니다.',
            actionBadge: 'fresh 결과',
            observe: '이전 ID와 다른 새 ID 및 새 생성 시각이 표시됨',
            observeAt: 'playground',
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

        {/* 조작 액션 버튼 및 검증 패널 */}
        <CacheVerificationClient
          currentCacheId={cachedData.cacheId}
          currentTimestamp={cachedData.timestamp}
          onRevalidate={invalidateCacheAction}
        />
      </DemoPlaygroundCard>

      {/* 4단. 최하단 개념 정리 카드 */}
                        <DemoDeepDiveCard title="Next.js 16 use cache 지시어 기본 동작 및 revalidateTag 무효화">
              <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
                  <p>Next.js 16의 <code>'use cache'</code> 지시어는 함수나 컴포넌트 레벨에서 비동기 연산 및 JSX 결과물을 캐싱합니다. <code>cacheTag()</code>는 캐시 항목에 태그를 붙이고, <code>revalidateTag(tag, 'max')</code>는 해당 항목을 stale 상태로 표시합니다. 이 프로필은 삭제 직후 새 값을 강제로 기다리는 방식이 아니라 stale-while-revalidate 방식으로 동작합니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
                  <p>본 데모의 <code>getCachedTimestamp()</code>는 매번 새 시각과 난수 ID를 만들지만, <code>'use cache'</code> 때문에 같은 캐시 항목을 재사용합니다. 무효화 버튼은 <code>revalidateTag('caching-basic:data', 'max')</code>를 호출합니다. 따라서 버튼 직후 또는 첫 재방문에는 이전 ID가 남아 있을 수 있고, 그 요청이 백그라운드 재생성을 시작한 뒤 다음 요청에서 새 ID가 보입니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>함수 단위 초정밀 캐싱</strong>: 페이지 전체를 ISR로 묶지 않고도 무거운 DB 쿼리나 외부 API 결과만 선택적으로 캐싱합니다.</li>
                    <li><strong>태그 기반 연쇄 무효화</strong>: 상품 가격 변경 시 관련 카테고리, 추천 목록, 메인 배너의 캐시를 같은 태그로 stale 처리하고 다음 요청부터 순차적으로 새 값으로 교체할 수 있습니다.</li>
                    <li><strong>서버 인프라 부하 감소</strong>: 동일 요청에 대해 불필요한 중복 DB 조회를 원천 차단하여 서버 리소스를 극대화합니다.</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li>쇼핑몰 타임세일 상품 카탈로그 및 기획전 목록 캐싱</li>
                    <li>관리자 상품 정보 수정 뒤, 잠시 이전 값을 허용해도 되는 카탈로그·추천 목록의 캐시 갱신</li>
                    <li>환율, 날씨, 주가 등 주기적/온디맨드 갱신이 필요한 공통 데이터</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>“무효화”와 “즉시 새 값”을 구분</strong>: <code>revalidateTag(tag, 'max')</code>는 stale-while-revalidate입니다. Server Action 뒤 다음 읽기에서 반드시 새 값이 필요하면 <code>updateTag(tag)</code>처럼 즉시 만료하는 API를 검토합니다.</li>
                    <li><strong>Cache Components 설정 확인</strong>: 이 데모처럼 <code>'use cache'</code>를 사용할 때는 프로젝트의 <code>cacheComponents: true</code> 설정과 배포 환경의 캐시 수명 정책을 함께 확인해야 합니다.</li>
                  </ul>
                </div>
              </div>
            </DemoDeepDiveCard>
    </DemoContainer>
  )
}
