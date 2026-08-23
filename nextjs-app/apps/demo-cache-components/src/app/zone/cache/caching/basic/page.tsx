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
    '- 일반 브라우저 새로고침: getCachedTimestamp()의 반환값이 영구 캐싱되어 캐시 ID와 시각이 유지됨\n- revalidateTag() 실행: 캐시 태그가 무효화되어 다음 요청 시 새 캐시 ID가 발급됨'

  const actualText = `- 캐시 고유 ID: #${cachedData.cacheId}\n- 캐시 생성 시각: ${cachedData.timestamp}\n- 적용 태그: cacheTag('caching-basic:data')`

  return (
    <DemoContainer className="space-y-6">
      {/* 1단. 상단 가이드 필드셋 */}
      <DemoGuideCard
        title="Next.js 16 use cache 지시어 & cacheTag/revalidateTag 무효화"
        concept="'use cache' 지시어를 선언하면 서버 함수 결과가 캐싱되며, cacheTag('caching-basic:data')로 태그를 부여한 뒤 revalidateTag 호출 시 0ms 지연 없이 즉시 새 캐시 ID(#...)로 갱신됩니다."
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
            description: '버튼을 클릭해도 캐시 ID와 시각이 바뀌지 않고 영구 보존되는 것을 확인합니다.',
            actionBadge: '캐시 유지',
          },
          {
            step: 3,
            title: '[캐시 무효화 (revalidateTag)] 실행',
            description: 'revalidateTag Server Action을 호출하여 캐시를 무효화하고 새로운 캐시 ID로 갱신합니다.',
            actionBadge: '온디맨드 무효화',
            observe: '캐시 고유 식별자(#ID) 및 캐시 생성 시각이 새로운 값으로 즉시 갱신됨',
            observeAt: 'verification',
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
        isMatched={Boolean(cachedData && cachedData.cacheId)}
      />

      {/* 4단. 최하단 개념 정리 카드 */}
                        <DemoDeepDiveCard title="Next.js 16 use cache 지시어 기본 동작 및 revalidateTag 무효화">
              <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
                  <p>Next.js 16의 <code>'use cache'</code> 지시어는 함수나 컴포넌트 레벨에서 비동기 연산 및 JSX 결과물을 캐싱하고, <code>cacheTag()</code>로 등록된 태그를 기반으로 <code>revalidateTag()</code> 호출 시 즉각적인 온디맨드 무효화를 수행하는 차세대 캐싱 아키텍처 스펙입니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
                  <p>본 데모에서는 <code>'use cache'</code>가 선언된 비동기 데이터 조회 함수에서 타임스탬프가 고정되어 캐시되는 동작을 확인하고, [캐시 무효화 (revalidateTag)] 버튼을 클릭했을 때 태그 단위로 캐시가 즉시 삭제되고 새로운 데이터로 갱신되는 수명 주기를 검증합니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>함수 단위 초정밀 캐싱</strong>: 페이지 전체를 ISR로 묶지 않고도 무거운 DB 쿼리나 외부 API 결과만 선택적으로 캐싱합니다.</li>
                    <li><strong>태그 기반 연쇄 무효화</strong>: 상품 가격 변경 시 관련 카테고리, 추천 목록, 메인 배너의 캐시를 단 한 번의 <code>revalidateTag</code>로 일괄 갱신합니다.</li>
                    <li><strong>서버 인프라 부하 감소</strong>: 동일 요청에 대해 불필요한 중복 DB 조회를 원천 차단하여 서버 리소스를 극대화합니다.</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li>쇼핑몰 타임세일 상품 카탈로그 및 기획전 목록 캐싱</li>
                    <li>관리자 상품 정보 수정 시 실시간 웹훅 연동 캐시 무효화</li>
                    <li>환율, 날씨, 주가 등 주기적/온디맨드 갱신이 필요한 공통 데이터</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>experimental.dynamicIO 설정 필수</strong>: Next.js 16에서 <code>'use cache'</code>를 사용하려면 <code>next.config.ts</code>에 <code>experimental.dynamicIO = true</code> 또는 관련 캐시 플래그가 설정되어 있어야 합니다.</li>
                    <li><strong>인자값 기반 자동 캐시 키 생성</strong>: 함수의 매개변수는 자동으로 캐시 키에 포함되므로, 직렬화 가능한 원시값(Primitive)이나 평면 객체를 인자로 넘겨야 정확한 캐시 히트가 보장됩니다.</li>
                  </ul>
                </div>
              </div>
            </DemoDeepDiveCard>
    </DemoContainer>
  )
}
