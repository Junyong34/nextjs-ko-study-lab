import React from 'react'
import Link from 'next/link'
import { Baby, Flame, Zap, ArrowRight, BookOpen, Layers } from 'lucide-react'

interface Track {
  id: string
  title: string
  subtitle: string
  target: string
  badge: string
  badgeColor: string
  steps: string[]
  startDoc: string
  startDocTitle: string
  icon: React.ElementType
}

const LEARNING_TRACKS: Track[] = [
  {
    id: 'fast-track',
    title: '입문자 패스트 트랙',
    subtitle: 'App Router Essentials',
    target: 'Next.js App Router를 처음 시작하거나 기존 Pages Router에서 전환하는 개발자',
    badge: '추천 입문 코스',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
    steps: [
      '1. 시작하기: 1.1 설치부터 1.10 에러 핸들링까지',
      '2. 핵심 개념: 서버 컴포넌트 & 클라이언트 컴포넌트 경계',
      '3. 4. 용어집: RSC, Hydration 등 필수 용어 점검',
      '4. 실습: 기초 라우팅 및 데이터 페칭 데모 실행',
    ],
    startDoc: '/getting-started',
    startDocTitle: '1.1 Installation 시작하기',
    icon: Baby,
  },
  {
    id: 'production-track',
    title: '실무 프로덕션 트랙',
    subtitle: 'Production-Ready Engineering',
    target: '실제 실무에서 비즈니스 웹 서비스를 개발하고 최적화하려는 프론트엔드/풀스택 엔지니어',
    badge: '실무 필수 코스',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800',
    steps: [
      '1. 실무 가이드: 2.1 렌더링 철학 & 2.14 Server Actions',
      '2. 폼 처리 & 낙관적 업데이트 (useActionState, useOptimistic)',
      '3. 보안 & 인증: Middleware/Proxy, CSP, 환경 변수',
      '4. 프로덕션 체크리스트 & 셀프 호스팅 최적화',
    ],
    startDoc: '/guides',
    startDocTitle: '2.1 Rendering Philosophy 보기',
    icon: Flame,
  },
  {
    id: 'deep-dive-track',
    title: '성능 & 아키텍처 트랙',
    subtitle: 'Performance & Internals Deep Dive',
    target: 'Next.js 16의 최신 캐싱 모델과 빌드 파이프라인의 내부 구현을 깊이 파악하려는 시니어/아키텍트',
    badge: '심화 아키텍처',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800',
    steps: [
      '1. 최신 캐싱: "use cache", cacheLife, cacheTag 아키텍처',
      '2. Partial Prerendering (PPR) & App Shell 전략',
      '3. 5. 아키텍처: Turbopack 모듈 그래프 & SWC 컴파일러',
      '4. CDN 에지 캐싱 & 버전 스큐(Version Skew) 관리',
    ],
    startDoc: '/guides',
    startDocTitle: '2.7 ISR with Cache Components 탐구',
    icon: Zap,
  },
]

export function LearningTracks() {
  return (
    <section id="tracks" className="space-y-6 scroll-mt-20">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-zinc-200 pb-4 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider">
            <span>Tailored Pathways</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-100 mt-1">
            🎯 수준별 추천 학습 트랙
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-md">
          학습 목적과 현재 역량에 맞추어 가장 효율적인 커리큘럼 경로를 선택하세요.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {LEARNING_TRACKS.map((track) => {
          const Icon = track.icon

          return (
            <div
              key={track.id}
              className="group relative flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-zinc-400 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/90 dark:hover:border-zinc-600"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${track.badgeColor}`}
                  >
                    {track.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  {track.title}
                </h3>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-3">
                  {track.subtitle}
                </p>

                <div className="rounded-xl bg-zinc-50/80 p-3 text-xs text-zinc-600 dark:bg-zinc-800/50 dark:text-zinc-300 mb-4">
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100 block mb-1">
                    추천 대상:
                  </span>
                  {track.target}
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 block">
                    추천 학습 순서:
                  </span>
                  <ul className="space-y-1.5">
                    {track.steps.map((step, sIdx) => (
                      <li
                        key={sIdx}
                        className="flex items-start gap-2 text-xs text-zinc-600 dark:text-zinc-300 leading-snug"
                      >
                        <span className="font-mono text-zinc-400 dark:text-zinc-500 shrink-0">
                          {sIdx + 1}.
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
                <Link
                  href={track.startDoc}
                  className="inline-flex w-full items-center justify-between rounded-xl bg-zinc-900 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                  <span>{track.startDocTitle}</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
