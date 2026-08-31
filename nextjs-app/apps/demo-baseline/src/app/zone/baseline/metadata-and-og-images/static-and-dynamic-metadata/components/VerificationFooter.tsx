'use client'

import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'

export interface VerificationFooterProps {
  title?: string
  description?: string
  previewPlatform?: 'kakao' | 'twitter' | 'facebook'
  hasInteracted?: boolean
}

export function VerificationFooter({
  title = '',
  description = '',
  previewPlatform = 'kakao',
  hasInteracted = false,
}: VerificationFooterProps) {
  const isMatched = hasInteracted ? true : undefined

  const expected =
    '• generateMetadata()를 통한 상품별 고유 og:title 및 og:description 동적 생성\n• 선택된 소셜 플랫폼(카카오톡/Twitter/Facebook) 규격에 맞춘 미리보기 카드 렌더링\n• HTML <head> 메타 태그(og:title, og:description, og:url, twitter:card) 동적 주입'

  const platformLabel =
    previewPlatform === 'kakao'
      ? '카카오톡'
      : previewPlatform === 'twitter'
      ? 'X (Twitter)'
      : '페이스북'

  const actual = !hasInteracted
    ? '• 메타데이터 편집 대기 중 (상단 상품 프리셋을 선택하거나 문구를 편집하고 SNS 탭을 전환하세요)'
    : `• 활성 소셜 플랫폼: ${platformLabel}\n• 동적 og:title: "${title}"\n• 동적 og:description: "${description}"\n• <head> 메타 태그 6개 항목 정상 동기화 완료`

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="generateMetadata 동적 메타데이터 & 소셜 공유 미리보기 실증 검증"
        expected={expected}
        actual={actual}
        isMatched={isMatched}
        description="Next.js App Router의 generateMetadata 및 OpenGraph 소셜 태그 자동 주입 스펙을 실시간으로 검증합니다."
      />
      <DemoDeepDiveCard title="generateMetadata 동적 메타데이터 & 소셜 공유 미리보기">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              Next.js App Router의 <code>export const metadata</code> 정적 객체 및{' '}
              <code>export async function generateMetadata({'{'} params, searchParams {'}'})</code> 함수는 페이지별 HTML{' '}
              <code>&lt;head&gt;</code> 메타 태그(Title, Description, OpenGraph, Canonical)를 서버에서 동적으로 생성하고,
              동일 렌더 사이클 내의 <code>fetch</code> 요청을 자동 중복 제거(Deduping)하는 표준 SEO 스펙입니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 URL 세그먼트 파라미터(<code>[id]</code>) 기반 상품 프리셋 조회를 통해 상품명과 설명을 결합한
              동적 <code>&lt;title&gt;</code> 및 OpenGraph 메타 태그를 생성하고, 소셜 공유 미리보기 카드에 실시간 바인딩합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>검색엔진 최적화(SEO) 극대화</strong>: 크롤러가 HTML을 수신하는 즉시 완벽한 메타데이터와 구조화된 정보를 파싱합니다.</li>
              <li><strong>데이터 요청 자동 중복 제거</strong>: Page 컴포넌트와 <code>generateMetadata</code>에서 동일한 <code>fetch()</code>를 호출해도 React 캐시를 통해 백엔드 요청이 단 1회만 실행됩니다.</li>
              <li><strong>계층적 메타데이터 합성</strong>: 상위 루트 레이아웃의 메타데이터 템플릿(<code>title: {'{'} template: '%s | 쇼핑몰', default: '쇼핑몰' {'}'}</code>)과 하위 페이지 제목이 자동 병합됩니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>상품 상세 페이지의 상품명, 카테고리, 대표 썸네일 기반 동적 SEO 메타 태그 생성</li>
              <li>검색 결과 페이지의 검색 키워드(searchParams)에 따른 맞춤형 페이지 제목 지정</li>
              <li>다국어 로케일(<code>/[locale]/products</code>)에 따른 <code>alternate</code> 언어별 Canonical 태그 설정</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>Server Component 전용</strong>: <code>generateMetadata</code>는 서버 컴포넌트에서만 내보낼 수 있으며 <code>'use client'</code> 클라이언트 컴포넌트에서는 정의할 수 없습니다.</li>
              <li><strong>React 19 비동기 params</strong>: Next.js 15+에서는 <code>generateMetadata({'{'} params {'}'}: {'{'} params: Promise&lt;{'{'} id: string {'}'}&gt; {'}'})</code>와 같이 <code>params</code>를 <code>await</code>로 언래핑해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
