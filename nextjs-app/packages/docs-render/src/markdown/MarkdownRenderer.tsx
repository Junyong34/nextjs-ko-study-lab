'use client'

import React from 'react'
import { DemoFrame } from '../demo/DemoFrame'
import { DocDemoList, type DemoItem } from '../demo/DocDemoList'
import { CodeBlock } from '../code/CodeBlock'
import { parseDemoBlock } from './parse/demo-block'
import { renderInline } from './parse/inline'
import { slugify } from './parse/slugify'
import { resolveAssetUrl } from './resolve/asset-url'
import {
  Alert,
  Blockquote,
  Figure,
  Heading,
  HorizontalRule,
  ListItem,
  OfficialDocLink,
  Paragraph,
  Table,
  matchAlert,
  type HeadingLevel,
} from './nodes'

export interface MarkdownRendererProps {
  /** 렌더링할 마크다운 원문 */
  content: string
  /** 문서와 연관된 데모 목록 (demos.yaml에서 온 것) */
  demos?: DemoItem[]
  /** 현재 문서의 경로 (예: "1-getting-started/caching.md") */
  docPath?: string
  /** 문서 하단에 관련 데모 목록을 붙일지 (기본값: true) */
  showDemoList?: boolean
  className?: string
}

/** 본문에서 걷어내는 메타 링크 줄. 목차는 사이드바가 그리므로 본문에 중복될 필요가 없다. */
const META_LINE_PREFIXES = ['상위 메뉴:', '상위 목차:', '전체 목차:']

const HEADING_MARKS: Array<{ mark: string; level: HeadingLevel }> = [
  { mark: '#### ', level: 4 },
  { mark: '### ', level: 3 },
  { mark: '## ', level: 2 },
  { mark: '# ', level: 1 },
]

/**
 * 경량 마크다운 렌더러입니다.
 *
 * 줄 단위 스캐너가 블록을 알아보고 `nodes/`의 컴포넌트로 넘깁니다.
 * 파싱은 `parse/`, 경로 변환은 `resolve/`, 구문 강조는 `code/`가 맡습니다.
 */
export function MarkdownRenderer({
  content,
  demos = [],
  docPath,
  showDemoList = true,
  className = '',
}: MarkdownRendererProps) {
  const relatedDemos = docPath ? demos.filter((d) => d.doc === docPath) : demos

  const lines = content.split('\n')
  const elements: React.ReactNode[] = []
  let idx = 0

  let inCodeBlock = false
  let codeBlockLang = ''
  let codeBlockLines: string[] = []

  let inTable = false
  let tableLines: string[] = []

  const flushTable = () => {
    if (tableLines.length >= 2) {
      elements.push(<Table key={`table-${idx++}`} lines={tableLines} docPath={docPath} />)
    }
    tableLines = []
    inTable = false
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()

    // 1. 코드펜스
    if (trimmed.startsWith('```')) {
      if (inTable) flushTable()

      if (!inCodeBlock) {
        inCodeBlock = true
        codeBlockLang = trimmed.slice(3).trim()
        codeBlockLines = []
        continue
      }

      inCodeBlock = false
      const fullCode = codeBlockLines.join('\n')

      if (codeBlockLang === 'demo') {
        const demoConfig = parseDemoBlock(fullCode)
        const matchedDemo = demos.find((d) => d.url === demoConfig.path)
        const zone = demoConfig.zone || matchedDemo?.zone

        elements.push(
          <DemoFrame
            key={`demo-${demoConfig.path || idx++}`}
            path={demoConfig.path}
            zone={zone}
            mode={demoConfig.mode}
            height={demoConfig.height}
            caption={demoConfig.caption}
          />,
        )
      } else {
        elements.push(<CodeBlock key={`code-${idx++}`} code={fullCode} language={codeBlockLang} />)
      }
      continue
    }

    if (inCodeBlock) {
      codeBlockLines.push(line)
      continue
    }

    // 2. 한 줄을 통째로 차지하는 이미지
    const imgBlockMatch = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/)
    if (imgBlockMatch) {
      if (inTable) flushTable()
      elements.push(
        <Figure
          key={`fig-${idx++}`}
          src={resolveAssetUrl(imgBlockMatch[2], docPath)}
          alt={imgBlockMatch[1]}
        />,
      )
      continue
    }

    // 3. 표
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      inTable = true
      tableLines.push(trimmed)
      continue
    } else if (inTable) {
      flushTable()
    }

    // 4. 헤딩 — 원본의 네 벌 복붙을 표 순회로 접었다
    const heading = HEADING_MARKS.find((h) => trimmed.startsWith(h.mark))
    if (heading) {
      const headingText = trimmed.slice(heading.mark.length).trim()
      const { primary, alias } = slugify(headingText)
      elements.push(
        <Heading key={`h${heading.level}-${idx++}`} level={heading.level} id={primary} alias={alias}>
          {renderInline(headingText, docPath)}
        </Heading>,
      )
      continue
    }

    // 5. 인용문과 경고 블록
    if (trimmed.startsWith('>')) {
      const bqContent = trimmed.replace(/^>\s?/, '')
      const alert = matchAlert(bqContent)

      if (alert) {
        elements.push(
          <Alert key={`alert-${alert.variant}-${idx++}`} variant={alert.variant}>
            {renderInline(alert.text, docPath)}
          </Alert>,
        )
      } else {
        elements.push(
          <Blockquote key={`bq-${idx++}`}>{renderInline(bqContent, docPath)}</Blockquote>,
        )
      }
      continue
    }

    // 6. 순서 없는 목록
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const listContent = trimmed.slice(2).trim()

      if (META_LINE_PREFIXES.some((p) => listContent.startsWith(p))) {
        continue
      }

      const officialDocMatch = listContent.match(/^공식\s*문서:\s*\[([^\]]+)\]\(([^)]+)\)/)
      if (officialDocMatch) {
        elements.push(<OfficialDocLink key={`official-doc-${idx++}`} href={officialDocMatch[2]} />)
        continue
      }

      elements.push(
        <ListItem key={`li-${idx++}`}>{renderInline(listContent, docPath)}</ListItem>,
      )
      continue
    }

    // 7. 순서 있는 목록
    const olMatch = trimmed.match(/^(\d+)\.\s+(.*)/)
    if (olMatch) {
      elements.push(
        <ListItem key={`ol-${idx++}`} ordered>
          {renderInline(olMatch[2], docPath)}
        </ListItem>,
      )
      continue
    }

    // 8. 구분선
    if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
      elements.push(<HorizontalRule key={`hr-${idx++}`} />)
      continue
    }

    // 9. 빈 줄
    if (!trimmed) continue

    // 10. 그 밖엔 문단
    elements.push(<Paragraph key={`p-${idx++}`}>{renderInline(line, docPath)}</Paragraph>)
  }

  if (inTable) {
    flushTable()
  }

  return (
    <article className={`space-y-1 font-sans ${className}`}>
      {elements}
      {showDemoList && relatedDemos.length > 0 && <DocDemoList demos={relatedDemos} />}
    </article>
  )
}
