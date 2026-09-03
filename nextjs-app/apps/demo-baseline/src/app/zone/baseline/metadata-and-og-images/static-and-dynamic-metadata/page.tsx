import React from 'react'
import type { Metadata } from 'next'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { MetadataPreviewClient } from './components/MetadataPreviewClient'
import { PRODUCTS } from './products'

// 정적 metadata 객체 — params 없이 항상 같은 값. 빌드 타임에 확정되어 초기 HTML에 바로 포함된다.
export const metadata: Metadata = {
  title: 'Next.js App Router 학습',
  description: 'Next.js App Router의 모든 개념을 한국어 가이드와 인터랙티브 데모로 완벽하게 마스터하세요.',
  openGraph: {
    title: 'Next.js App Router 학습',
    description: 'Next.js App Router의 모든 개념을 한국어 가이드와 인터랙티브 데모로 완벽하게 마스터하세요.',
    type: 'website',
    url: 'https://nextjs-ko-lab.dev/course/app-router',
  },
  twitter: {
    card: 'summary_large_image',
  },
}

const STATIC_TITLE = 'Next.js App Router 학습'
const STATIC_DESCRIPTION =
  'Next.js App Router의 모든 개념을 한국어 가이드와 인터랙티브 데모로 완벽하게 마스터하세요.'

export default function StaticAndDynamicMetadataDemoPage() {
  return (
    <DemoContainer className="space-y-6">
      {/* 1단. 상단 가이드 필드셋 */}
      <DemoGuideCard
        title="정적 metadata vs generateMetadata({ params }) 동적 메타데이터"
        concept="현재 페이지는 params 없이 항상 같은 값을 반환하는 정적 metadata 객체를 씁니다. 아래 [상품 프리셋]은 실제로 다른 URL(/[productId])로 이동하는 링크이며, 그 라우트의 generateMetadata({ params })가 상품별로 다른 title/description을 서버에서 진짜로 생성합니다."
        steps={[
          {
            step: 1,
            title: '지금 이 페이지의 실제 <head> 인스펙터 확인',
            description: '브라우저의 진짜 document.title / meta 태그를 읽어와 보여주는 인스펙터로, 정적 metadata 객체의 값이 그대로 반영된 걸 확인합니다.',
            actionBadge: '정적 메타 점검',
          },
          {
            step: 2,
            title: '[상품 프리셋] 링크 클릭 → 실제 페이지 이동',
            description: '프리셋을 클릭하면 /static-and-dynamic-metadata/[productId]로 실제 내비게이션이 일어나고, 그 라우트의 generateMetadata({ params })가 서버에서 다시 실행됩니다.',
            actionBadge: '실제 라우트 이동',
          },
          {
            step: 3,
            title: '이동한 페이지의 <head> 인스펙터 재확인',
            description: '같은 인스펙터가 이번엔 상품별로 다른 실제 title/description을 보여주는지 확인합니다 — 버튼 클릭이 아니라 실제 서버 재렌더링으로 바뀐 값입니다.',
            actionBadge: '동적 메타 검증',
          },
          {
            step: 4,
            title: '[카카오톡], [X (Twitter)], [페이스북] 자유 편집 미리보기 탭',
            description: '이 탭은 실제 head와 무관하게, 임의의 문구를 입력했을 때 SNS 카드가 어떻게 보이는지만 시뮬레이션합니다.',
            actionBadge: 'SNS 카드 시뮬레이터',
            observe: '실제 <head> 인스펙터는 페이지 이동 시에만 바뀌고, SNS 미리보기 입력창은 실제 head와 별개로 자유롭게 편집 가능함',
            observeAt: 'playground',
          },
        ]}
      />

      {/* 2단. 실습 조작 영역 (DemoPlaygroundCard) 및 3단/4단 */}
      <DemoPlaygroundCard title="SEO & OpenGraph 소셜 공유 시뮬레이터" className="space-y-4">
        <MetadataPreviewClient
          products={PRODUCTS}
          currentTitle={STATIC_TITLE}
          currentDescription={STATIC_DESCRIPTION}
        />
      </DemoPlaygroundCard>
    </DemoContainer>
  )
}
