'use client'
import React, { use } from 'react'
import { useRouter } from 'next/navigation'

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

export default function InterceptedPhotoModal({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const photo = PHOTOS_DB[id] || {
    title: `상품 사진 #${id}`,
    category: '일반 카테고리',
    price: 100000,
    desc: '인터셉트 모달로 로드된 이미지입니다.',
    color: 'from-zinc-600 to-zinc-800',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-lg rounded-xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b pb-3 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="rounded bg-indigo-100 px-2 py-0.5 font-mono text-[10px] font-bold text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
              (.)photos/[id] 인터셉트 모달
            </span>
            <span className="text-xs text-zinc-500 font-mono">ID: {id}</span>
          </div>
          <button
            onClick={() => router.back()}
            className="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 cursor-pointer text-sm"
          >
            ✕ 닫기
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div className={`h-40 w-full rounded-lg bg-gradient-to-br ${photo.color} flex items-center justify-center text-white shadow-inner p-4 text-center`}>
            <div>
              <div className="text-lg font-bold">{photo.title}</div>
              <div className="text-xs opacity-80 mt-1 font-mono">NEXT.JS INTERCEPTED ROUTE OVERLAY</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-zinc-500">{photo.category}</span>
              <span className="text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                {photo.price.toLocaleString()}원
              </span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
              {photo.desc}
            </p>
          </div>

          <div className="rounded bg-zinc-100 p-3 font-mono text-[11px] text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
            <div className="font-bold text-zinc-500 mb-0.5">라우팅 상태:</div>
            <div>• URL 경로: <code>.../photos/{id}</code> (주소창 변경됨)</div>
            <div>• 배경 뷰: 메인 갤러리 피드 컨텍스트 유지</div>
            <div>• 뒤로 가기 / 닫기 클릭 시 모달만 언마운트</div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => router.back()}
              className="rounded bg-zinc-900 px-4 py-1.5 text-xs font-bold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer"
            >
              확인 및 모달 닫기 (router.back)
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
