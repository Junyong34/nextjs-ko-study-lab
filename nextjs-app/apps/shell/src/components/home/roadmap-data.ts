import type React from 'react'
import { Compass, Code2, BookOpenText, FileCode2, Cpu } from 'lucide-react'

export interface StepCard {
  step: string
  title: string
  subtitle: string
  badge: string
  badgeColor: string
  summary: string
  countText: string
  tags: string[]
  href: string
  icon: React.ElementType
}

export const ROADMAP_STEPS: StepCard[] = [
  {
    step: 'Step 01',
    title: '시작하기',
    subtitle: 'Getting Started',
    badge: '기초',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800',
    summary: 'Next.js 설치, 기본 프로젝트 구조, 라우팅 및 데이터 페칭 기초를 다룹니다.',
    countText: '18개 챕터',
    tags: ['설치 & 구조', 'Layouts & Pages', 'RSC 경계', '페칭 & 캐싱', '최적화'],
    href: '/getting-started',
    icon: Compass,
  },
  {
    step: 'Step 02',
    title: '실무 가이드',
    subtitle: 'Guides',
    badge: '주제별 가이드',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
    summary: '렌더링, Server Actions, 캐싱, 폼 처리, 인증/보안 등 주제별 심층 가이드입니다.',
    countText: '64개 챕터',
    tags: ['렌더링', 'use cache', 'Server Actions', '인증 & 보안', '배포'],
    href: '/guides',
    icon: Code2,
  },
  {
    step: 'Step 03',
    title: 'API 레퍼런스',
    subtitle: 'API Reference',
    badge: 'API 명세',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800',
    summary: '컴포넌트, 내장 함수, 지시어, next.config.js 등 공식 API 명세입니다.',
    countText: '9개 분야',
    tags: ['Components', 'Functions', 'Directives', 'File Conventions', 'Config'],
    href: '/api-reference',
    icon: FileCode2,
  },
  {
    step: 'Step 04',
    title: '용어집',
    subtitle: 'Glossary',
    badge: '용어 사전',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
    summary: 'Next.js 공식 문서에서 사용되는 48가지 핵심 기술 용어 사전입니다.',
    countText: '48개 용어',
    tags: ['RSC & Hydration', 'PPR & App Shell', 'Cache Tags', 'Proxy'],
    href: '/glossary',
    icon: BookOpenText,
  },
  {
    step: 'Step 05',
    title: '아키텍처',
    subtitle: 'Architecture',
    badge: '내부 원리',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800',
    summary: 'Turbopack 번들러, SWC 컴파일러, Fast Refresh 등 내부 동작 원리를 다룹니다.',
    countText: '4개 챕터',
    tags: ['Turbopack', 'SWC Compiler', 'Fast Refresh', 'Supported Browsers'],
    href: '/architecture',
    icon: Cpu,
  },
]
