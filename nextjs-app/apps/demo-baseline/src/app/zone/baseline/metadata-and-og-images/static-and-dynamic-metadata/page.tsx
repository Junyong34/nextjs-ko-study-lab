import React from 'react'
import type { Metadata } from 'next'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { MetadataPreviewClient } from './components/MetadataPreviewClient'
import { VerificationFooter } from './components/VerificationFooter'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Next.js App Router 공식 학습 코스 | 한국어 스터디 랩',
    description: 'Next.js App Router의 모든 개념을 한국어 가이드와 인터랙티브 데모로 완벽하게 마스터하세요.',
    openGraph: {
      title: 'Next.js App Router 공식 학습 코스 | 한국어 스터디 랩',
      description: 'Next.js App Router의 모든 개념을 한국어 가이드와 인터랙티브 데모로 완벽하게 마스터하세요.',
      type: 'website',
      url: 'https://nextjs-ko-lab.dev/course/app-router',
    },
    twitter: {
      card: 'summary_large_image',
    },
  }
}

export default async function StaticAndDynamicMetadataDemoPage() {
  const meta = {
    title: 'Next.js App Router 공식 학습 코스 | 한국어 스터디 랩',
    description: 'Next.js App Router의 모든 개념을 한국어 가이드와 인터랙티브 데모로 완벽하게 마스터하세요.',
    ogType: 'website',
    url: 'https://nextjs-ko-lab.dev/course/app-router',
  }

  return (
    <DemoContainer className="space-y-6">
      {/* 1단. 상단 가이드 필드셋 */}
      <DemoGuideCard
        title="generateMetadata 동적 메타데이터 & 소셜 공유 미리보기"
        concept="Next.js는 정적 metadata 객체와 비동기 generateMetadata() 함수를 통해 검색 엔진 최적화(SEO) 및 카카오톡, X, 페이스북 등의 소셜 링크 공유 카드를 서버에서 자동으로 구성하여 <head>에 주입합니다."
        steps={[
          {
            step: 1,
            title: 'og:title 및 설명 실시간 수정',
            description: '상단 입력창에서 제목과 설명을 변경하여 소셜 카드가 즉각 반응하는 것을 봅니다.',
            actionBadge: '메타데이터 편집',
          },
          {
            step: 2,
            title: '플랫폼별 미리보기 탭 전환',
            description: '카카오톡, X (Twitter), 페이스북 탭을 클릭하여 각 SNS의 렌더링 규격을 확인합니다.',
            actionBadge: 'SNS 규격 시뮬레이션',
          },
          {
            step: 3,
            title: '자동 주입 <head> 태그 인스펙팅',
            description: '하단 박스에서 Next.js가 렌더링하는 최종 HTML 메타 태그 목록을 확인합니다.',
            actionBadge: '<head> 태그 검증',
          },
        ]}
      />

      {/* 2단. 실습 조작 영역 (DemoPlaygroundCard) */}
      <DemoPlaygroundCard title="SEO & OpenGraph 소셜 공유 시뮬레이터" className="space-y-4">
        <MetadataPreviewClient
          title={meta.title}
          description={meta.description}
          ogType={meta.ogType}
          url={meta.url}
        />
      </DemoPlaygroundCard>

      {/* 3단 & 4단: 검증 패널 및 [개념 정리] 카드 */}
      <VerificationFooter />
    </DemoContainer>
  )
}
