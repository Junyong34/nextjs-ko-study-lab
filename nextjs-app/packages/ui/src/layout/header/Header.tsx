import React from 'react'
import { SITE } from '../../site'
import { HeaderBrand } from './HeaderBrand'
import { HeaderNav } from './HeaderNav'

/** 상단 고정 헤더. 검색 팔레트와 테마 토글은 아직 없습니다 (06. 6절). */
export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/95 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/95">
      <div className="mx-auto flex h-14 sm:h-16 max-w-[90rem] items-center justify-between px-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 sm:gap-6 min-w-0">
          <HeaderBrand version={SITE.version} />
        </div>
        <HeaderNav officialDocsUrl={SITE.officialDocsUrl} repoUrl={SITE.repoUrl} />
      </div>
    </header>
  )
}
