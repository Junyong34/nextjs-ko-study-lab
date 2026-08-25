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
        title="generateMetadata 동적 메타데이터 & 소셜 OG 태그 생성"
        concept="정적 metadata 객체와 비동기 generateMetadata({ params }) 함수를 활용하여 상품별 고유 title, description, Open Graph(1200x630) 이미지를 서버에서 동적으로 주입하고 소셜 미리보기를 제공합니다."
        steps={[
          {
                    "step": 1,
                    "title": "정적 metadata 객체 선언 확인",
                    "description": "title, description, keywords가 정의된 정적 메타데이터 구조를 확인합니다.",
                    "actionBadge": "정적 메타 점검"
          },
          {
                    "step": 2,
                    "title": "동적 generateMetadata() OpenGraph 태그 생성 확인",
                    "description": "상품 파라미터에 따라 og:title, og:image가 동적으로 생성되는지 확인합니다.",
                    "actionBadge": "동적 OG 생성"
          },
          {
                    "step": 3,
                    "title": "[kakao 카카오톡 twitter X (Twitter) 페이스북] 미리보기 탭 선택",
                    "description": "각 SNS 플랫폼별 미리보기 탭을 전환하여 렌더링 카드를 확인합니다.",
                    "actionBadge": "SNS 미리보기"
          },
          {
                    "step": 4,
                    "title": "HTML <head> 메타 태그 주입 및 소셜 카드 관찰",
                    "description": "생성된 meta 태그가 브라우저 <head>에 올바르게 주입되어 소셜 크롤러 규격을 충족하는지 관찰합니다.",
                    "actionBadge": "메타 태그 관찰",
                    "observe": "동적 generateMetadata() 결과가 <head> 태그 및 SNS 공유 카드 미리보기에 정확히 반영됨",
                    "observeAt": "playground"
          }
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
