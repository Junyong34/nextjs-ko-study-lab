import React from 'react'
import Link from 'next/link'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { VerificationFooter } from '../../components/VerificationFooter'

const DOCS_CONTENT: Record<string, { title: string; desc: string; sections: string[] }> = {
  root: {
    title: '이커머스 개발자 문서 홈 (Root Index)',
    desc: '파라미터가 생략된 기본 docs 진입점입니다. slug는 undefined로 주입됩니다.',
    sections: ['1. 시작하기 개요', '2. 아키텍처 다이어그램', '3. API 레퍼런스 색인'],
  },
  installation: {
    title: '환경 설정 및 설치 가이드 (installation)',
    desc: 'pnpm 및 Next.js 16.3.2 프로젝트 초기화 설정 매뉴얼입니다.',
    sections: ['패키지 매니저 설치', '의존성 카탈로그 동기화', 'Next.js Dev Server 구동'],
  },
  'routing/dynamic-routes': {
    title: '동적 라우팅 가이드 (routing > dynamic-routes)',
    desc: '[id], [...slug], [[...slug]] 세그먼트 활용법과 params Promise 처리 원리입니다.',
    sections: ['단일 파라미터 매핑', 'Catch-all 세그먼트', 'Optional Catch-all 매핑'],
  },
  'api-reference/file-conventions/page': {
    title: '특수 파일 컨벤션: page.tsx',
    desc: 'App Router에서 고유한 UI를 렌더링하고 경로를 공개하는 최상위 엔트리 파일입니다.',
    sections: ['PageProps 시그니처', 'Async Server Component', '메타데이터 연동'],
  },
}

export default async function OptionalCatchAllDocsPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>
}) {
  const { slug } = await params
  const BASE_PATH = '/zone/baseline/file-conventions/dynamic-segments/optional-catch-all'

  const slugKey = slug && slug.length > 0 ? slug.join('/') : 'root'
  const currentDoc = DOCS_CONTENT[slugKey] || {
    title: `문서: ${slugKey}`,
    desc: `동적 경로 /docs/${slugKey}에 해당하는 문서입니다.`,
    sections: ['개요', '파라미터 구조', '코드 예제'],
  }

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={`[[...slug]] 선택적 포괄 세그먼트: /docs${slug && slug.length > 0 ? `/${slug.join('/')}` : ' (루트)'}`}
        concept="Next.js App Router의 [[...slug]] (이중 대괄호) 폴더 컨벤션은 파라미터가 없는 기본 경로(/docs)와 N단계 하위 경로(/docs/a/b)를 모두 단 하나의 page.tsx에서 처리합니다."
        steps={[
          {
            step: 1,
            title: "선택적 세그먼트 params.slug 수신",
            description: slug ? `하위 경로 "${slug.join('/')}"가 string[] 배열로 수신되었습니다.` : '루트 /docs 진입 시 params.slug는 undefined로 주입됩니다.',
            actionBadge: slug ? `배열 (${slug.length}개)` : 'undefined (루트)',
          },
          {
            step: 2,
            title: "루트 및 하위 문서 조건부 렌더링",
            description: "slug의 유무에 따라 기본 인덱스 홈 또는 해당 서브 문서를 분기 렌더링합니다.",
            actionBadge: "조건부 렌더링",
          },
          {
            step: 3,
            title: "단일 파일 라우팅 일원화 검증",
            description: "루트와 심층 하위 문서 간을 이동하며 동일한 파일이 모든 상태를 처리함을 확인합니다.",
            actionBadge: "일원화 검증",
          },
        ]}
      />

      <DemoPlaygroundCard title={`문서 뷰어 (URL: .../docs${slug && slug.length > 0 ? `/${slug.join('/')}` : ''})`}>
        <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 dark:border-zinc-800">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-zinc-900 dark:text-zinc-100">{currentDoc.title}</h4>
                <span className="rounded bg-purple-100 px-2 py-0.5 text-[11px] font-mono font-semibold text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                  {slug ? `slug.length = ${slug.length}` : 'slug = undefined'}
                </span>
              </div>
              <p className="text-xs text-zinc-500">{currentDoc.desc}</p>
            </div>
            <Link
              href={BASE_PATH}
              className="rounded bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300"
            >
              ← 데모 목록으로 복귀
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50 space-y-3">
              <div className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                문서 목차 (Table of Contents)
              </div>
              <ul className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400 list-disc list-inside">
                {currentDoc.sections.map((sec, i) => (
                  <li key={i}>{sec}</li>
                ))}
              </ul>
            </div>

            <div className="rounded border border-zinc-200 bg-zinc-950 p-4 font-mono text-xs text-zinc-300 dark:border-zinc-800 space-y-2">
              <div className="font-bold text-zinc-400 border-b border-zinc-800 pb-1">
                서버 수신 params 객체:
              </div>
              <pre className="text-[11px] text-emerald-400 bg-zinc-900 p-2 rounded">
                {JSON.stringify({ params: { slug: slug ?? null } }, null, 2)}
              </pre>
              <div className="pt-2 text-[11px] text-zinc-400 font-sans">
                다른 [[...slug]] 경로 탐색:
              </div>
              <div className="flex flex-wrap gap-1.5 font-mono text-[10px]">
                <Link
                  href={`${BASE_PATH}/docs`}
                  className={`rounded px-2 py-1 ${!slug ? 'bg-purple-600 text-white font-bold' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}
                >
                  /docs (루트 인덱스)
                </Link>
                <Link
                  href={`${BASE_PATH}/docs/installation`}
                  className="rounded bg-zinc-800 px-2 py-1 text-zinc-300 hover:bg-zinc-700"
                >
                  /docs/installation (1단계)
                </Link>
                <Link
                  href={`${BASE_PATH}/docs/routing/dynamic-routes`}
                  className="rounded bg-zinc-800 px-2 py-1 text-zinc-300 hover:bg-zinc-700"
                >
                  /docs/routing/dynamic-routes (2단계)
                </Link>
                <Link
                  href={`${BASE_PATH}/docs/api-reference/file-conventions/page`}
                  className="rounded bg-zinc-800 px-2 py-1 text-zinc-300 hover:bg-zinc-700"
                >
                  /docs/api-reference/file-conventions/page (3단계)
                </Link>
              </div>
            </div>
          </div>
        </div>
      </DemoPlaygroundCard>

      <VerificationFooter currentSlug={slug} isDocsRoute={true} />
    </DemoContainer>
  )
}
