import React from 'react'
import { ExternalLink } from 'lucide-react'
import { NextLogo, GitHubIcon } from '../../brand'

export interface FooterLinksProps {
  /** 화면에 표시할 기준 버전 (예: "v16.3.2") */
  version: string
  /** 해당 버전의 릴리스 노트 URL */
  releaseUrl: string
  /** 저장소 URL */
  repoUrl: string
}

/** 푸터의 외부 링크 두 개 — 릴리스 노트, 저장소. */
export function FooterLinks({ version, releaseUrl, repoUrl }: FooterLinksProps) {
  return (
    <>
      <a
        href={releaseUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1 font-mono text-zinc-600 hover:text-zinc-900 transition dark:text-zinc-400 dark:hover:text-zinc-100"
      >
        <NextLogo className="h-3.5 w-3.5 fill-current text-zinc-400" />
        {/* 텍스트를 한 노드로 만든다. 나누면 React가 <!-- --> 마커를 끼워 DOM이 달라진다 */}
        <span>{`Next.js ${version}`}</span>
        <ExternalLink className="h-3 w-3 text-zinc-400" />
      </a>

      <a
        href={repoUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1.5 font-medium text-zinc-600 hover:text-zinc-900 transition dark:text-zinc-400 dark:hover:text-zinc-100"
      >
        <GitHubIcon className="h-3.5 w-3.5 fill-current" />
        <span>GitHub 저장소</span>
        <ExternalLink className="h-3 w-3 text-zinc-400" />
      </a>
    </>
  )
}
