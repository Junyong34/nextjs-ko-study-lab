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
            step: 1,
            title: '[og:title (페이지 제목)] 및 [og:description (페이지 요약 설명)] 텍스트 입력',
            description: '상단 입력 필드에서 페이지 제목과 설명을 수정하여 메타데이터 상태를 변경합니다.',
            actionBadge: '메타데이터 편집',
          },
          {
            step: 2,
            title: '[카카오톡] / [X (Twitter)] / [페이스북] 미리보기 탭 전환',
            description: '소셜 플랫폼 탭을 전환하며 플랫폼별 카드 템플릿에 맞게 렌더링된 소셜 공유 UI를 확인합니다.',
            actionBadge: '소셜 카드 미리보기',
          },
          {
            step: 3,
            title: 'Next.js 자동 주입 <head> 메타 태그 실시간 동기화 확인',
            description: '입력한 og:title과 og:description이 하단 HTML <head> 메타 태그 블록에 동기화되는 것을 관찰합니다.',
            actionBadge: '메타 태그 검증',
            observe: '입력한 제목과 설명이 소셜 카드 미리보기 및 하단 <head> 메타 태그 블록에 실시간 반영됨',
            observeAt: 'playground',
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
