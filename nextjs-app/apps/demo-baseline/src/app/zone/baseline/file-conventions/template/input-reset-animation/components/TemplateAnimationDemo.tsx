'use client'
import React from 'react'
import Link from 'next/link'
import { DemoResetButton } from '@study/demo-kit'
import { resetInputResetState } from '../hooks/useInputResetStore'

export function TemplateAnimationDemo() {
  const BASE_PATH = '/zone/baseline/file-conventions/template/input-reset-animation'

  return (
    <div className="space-y-4 rounded-lg bg-white p-4 text-sm dark:bg-zinc-950">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 dark:border-zinc-800">
        <div>
          <h4 className="font-bold text-zinc-900 dark:text-zinc-100">상품 문의 폼 &ndash; 탭 전환 실습</h4>
          <p className="text-xs text-zinc-500">
            위 보라색 template 박스 안의 &ldquo;이 사이즈 재고 있나요?&rdquo; 입력에 문구를 적고, 아래 버튼으로
            문의 탭을 전환하며 폼과 애니메이션이 매번 초기화되는지 확인하세요. 초록색 layout 박스의 입력은
            대조군으로, 같은 방식(비제어 입력)이지만 탭을 옮겨도 유지됩니다.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href={`${BASE_PATH}/option-a`}
          className="rounded bg-purple-600 px-4 py-2 text-xs font-semibold text-white hover:bg-purple-700 transition-colors"
        >
          사이즈 문의 탭 진입 (/option-a) →
        </Link>
        <Link
          href={`${BASE_PATH}/option-b`}
          className="rounded bg-purple-600 px-4 py-2 text-xs font-semibold text-white hover:bg-purple-700 transition-colors"
        >
          색상 문의 탭 진입 (/option-b) →
        </Link>
      </div>

      <div className="flex justify-end border-t pt-3 dark:border-zinc-800">
        <DemoResetButton onReset={() => resetInputResetState()} label="관측 기록 초기화" />
      </div>
    </div>
  )
}
