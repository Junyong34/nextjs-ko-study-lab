import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'file-conventions/intercepting-routes/photos/[id]')

import React from 'react'
import Link from 'next/link'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { VerificationFooter } from '../../components/VerificationFooter'

const PHOTOS_DB: Record<string, { title: string; category: string; price: number; desc: string; color: string }> = {
  '101': {
    title: '에어 줌 페가수스 러닝화',
    category: '러닝화 카테고리',
    price: 139000,
    desc: '가벼운 반응성의 줌 에어 유닛이 탑재되어 장거리 러닝에 최적화된 신발입니다.',
    color: 'from-blue-600 to-indigo-700',
  },
  '102': {
    title: '윈드러너 후디 자켓',
    category: '스포츠 아우터',
    price: 179000,
    desc: '경량 발수 원단과 통풍 벤트 구조로 악천후 러닝 시 쾌적함을 유지합니다.',
    color: 'from-emerald-600 to-teal-700',
  },
  '103': {
    title: '테크 에어로스위프트 타이츠',
    category: '트레이닝 웨어',
    price: 99000,
    desc: '신축성과 땀 배출 능력이 뛰어난 프로 선수용 퍼포먼스 타이츠입니다.',
    color: 'from-purple-600 to-pink-700',
  },
}

export default async function DirectPhotoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const BASE_PATH = '/zone/baseline/file-conventions/intercepting-routes'

  const photo = PHOTOS_DB[id] || {
    title: `상품 사진 #${id}`,
    category: '일반 카테고리',
    price: 100000,
    desc: '독립 페이지로 로드된 이미지입니다.',
    color: 'from-zinc-600 to-zinc-800',
  }

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={`직접 접속 페이지: /photos/${id}`}
        concept="새로고침(F5) 또는 외부 직접 링크를 통해 접속했을 때, 인터셉트 모달이 아닌 독립형 풀 페이지(photos/[id]/page.tsx)가 렌더링된 화면입니다."
        steps={[
          {
            step: 1,
            title: "독립 라우트 마운트",
            description: "인터셉트 조건(Soft Navigation)이 성립하지 않아 독립 전체 페이지가 렌더링되었습니다.",
            actionBadge: "직접 접속",
          },
          {
            step: 2,
            title: "풀 페이지 데이터 조회",
            description: `params.id(${id})를 기반으로 단독 레이아웃 화면을 구성합니다.`,
            actionBadge: "단독 뷰",
          },
          {
            step: 3,
            title: "갤러리 피드로 복귀",
            description: "메인 갤러리로 돌아가서 다시 링크를 클릭하면 이번에는 모달로 인터셉트되는 것을 확인합니다.",
            actionBadge: "인터셉트 비교",
          },
        ]}
      />

      <DemoPlaygroundCard title={`단독 상품 사진 상세 (URL: .../photos/${id})`}>
        <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 dark:border-zinc-800">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-zinc-900 dark:text-zinc-100">{photo.title}</h4>
                <span className="rounded bg-amber-100 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  직접 접속 (Full Page)
                </span>
              </div>
              <p className="text-xs text-zinc-500">{photo.category} • 사진 고유 ID: {id}</p>
            </div>
            <Link
              href={BASE_PATH}
              className="rounded bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900"
            >
              ← 갤러리 피드로 이동
            </Link>
          </div>

          <div className={`h-56 w-full rounded-lg bg-gradient-to-br ${photo.color} flex items-center justify-center text-white p-6 text-center`}>
            <div>
              <h3 className="text-xl font-bold">{photo.title}</h3>
              <p className="text-xs opacity-90 mt-1 font-mono">STANDALONE FULL PAGE ROUTE (photos/[id])</p>
            </div>
          </div>

          <div className="rounded border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50 space-y-2">
            <div className="font-bold text-xs text-zinc-700 dark:text-zinc-300">동작 원리 해설</div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              사용자가 갤러리 목록에서 <code>{'<'}Link{'>'}</code>를 통해 진입하면 <code>@modal/(.)photos/[id]</code>가 인터셉트하여 기존 화면 위에 모달을 띄우지만,
              이 주소를 복사하여 새 탭에서 열거나 새로고침하면 본 <code>photos/[id]/page.tsx</code>가 직접 렌더링됩니다.
            </p>
          </div>
        </div>
      </DemoPlaygroundCard>

      <VerificationFooter currentPhotoId={id} isDirectPage={true} />
    </DemoContainer>
  )
}
