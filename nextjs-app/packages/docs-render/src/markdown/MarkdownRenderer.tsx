import React from 'react'
import { CodeBlock } from '../code/CodeBlock'
import { DocDemoList, type DemoItem } from '../demo/DocDemoList'
import { DemoLinkCard } from '../demo/DemoLinkCard'
import { parseDemoBlock } from './parse/demo-block'
import { slugify } from './parse/slugify'
import { renderInline } from './parse/inline'
import { resolveAssetUrl } from './resolve/asset-url'
import { Heading, Figure, Table, Alert, matchAlert, Details } from './nodes'
import {
  Paragraph,
  Blockquote,
  UnorderedList,
  OrderedList,
  ListItem,
} from './nodes/blocks'

export interface MarkdownRendererProps {
  content: string
  demos?: DemoItem[]
  docPath?: string
  showDemoList?: boolean
  className?: string
}

const META_LINE_PREFIXES = ['- 공식 문서:', '- 상위 메뉴:', '- 전체 목차:']

const HEADING_MARKS: Array<{ mark: string; level: 1 | 2 | 3 | 4 }> = [
  { mark: '#### ', level: 4 },
  { mark: '### ', level: 3 },
  { mark: '## ', level: 2 },
  { mark: '# ', level: 1 },
]

/**
 * 경량 마크다운 렌더러입니다.
 *
 * 줄 단위 스캐너가 블록을 알아보고 `nodes/`의 컴포넌트로 넘깁니다.
 * 파싱은 `parse/`, 경로 변환은 `resolve/`, 구문 강조 및 파일명 헤더는 `code/`가 맡습니다.
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
  let codeBlockFilename = ''
  let codeBlockLines: string[] = []

  let inTable = false
  let tableLines: string[] = []

  let inDetails = false
  let detailsSummary = ''
  let detailsLines: string[] = []

  let listType: 'ordered' | 'unordered' | null = null
  let listItems: React.ReactNode[] = []

  const flushTable = () => {
    if (tableLines.length >= 2) {
      elements.push(<Table key={`table-${idx++}`} lines={tableLines} docPath={docPath} />)
    }
    tableLines = []
    inTable = false
  }

  const flushList = () => {
    if (listItems.length > 0 && listType) {
      if (listType === 'ordered') {
        elements.push(
          <OrderedList key={`ol-${idx++}`}>{listItems}</OrderedList>,
        )
      } else {
        elements.push(
          <UnorderedList key={`ul-${idx++}`}>{listItems}</UnorderedList>,
        )
      }
    }
    listType = null
    listItems = []
  }

  const flushDetails = () => {
    const contentNodes: React.ReactNode[] = []
    const contentText = detailsLines.join('\n').trim()
    if (contentText) {
      const paragraphs = contentText.split(/\n\s*\n/)
      paragraphs.forEach((p, pIdx) => {
        const cleanP = p.trim()
        if (cleanP) {
          contentNodes.push(
            <p key={`details-p-${pIdx}`} className={pIdx > 0 ? 'mt-2' : ''}>
              {renderInline(cleanP, docPath)}
            </p>,
          )
        }
      })
    }

    elements.push(
      <Details key={`details-${idx++}`} summary={detailsSummary || '정답 보기'}>
        {contentNodes.length > 0 ? contentNodes : null}
      </Details>,
    )

    inDetails = false
    detailsSummary = ''
    detailsLines = []
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()

    // 1. 코드펜스
    if (trimmed.startsWith('```')) {
      if (inTable) flushTable()
      if (inDetails) flushDetails()
      if (listType) flushList()

      if (!inCodeBlock) {
        inCodeBlock = true
        const rawFence = trimmed.slice(3).trim()
        
        let lang = rawFence
        let fenceFilename = ''

        // ```tsx filename="app/page.tsx" or ```tsx title="app/page.tsx" or ```tsx app/page.tsx
        const filenameAttrMatch = rawFence.match(/^(?:([a-zA-Z0-9_\-]+)\s+)?(?:filename|title)=["']?([^"'\s]+)["']?/)
        if (filenameAttrMatch) {
          lang = filenameAttrMatch[1] || ''
          fenceFilename = filenameAttrMatch[2] || ''
        } else {
          const parts = rawFence.split(/\s+/)
          if (parts.length >= 2 && parts[1].includes('.')) {
            lang = parts[0]
            fenceFilename = parts[1]
          }
        }

        codeBlockLang = lang || 'text'
        codeBlockFilename = fenceFilename
        codeBlockLines = []
        continue
      }

      inCodeBlock = false
      let finalCode = codeBlockLines.join('\n')
      let finalFilename = codeBlockFilename

      // 파일명이 지정되지 않았고 코드 첫 줄이 파일명 주석인 경우 (예: // app/page.tsx, /* app/globals.css */) 스마트 추출
      if (!finalFilename && codeBlockLines.length > 0) {
        const firstLine = codeBlockLines[0].trim()
        const commentMatch = firstLine.match(/^(?:\/\/|\/\*|#)\s*([a-zA-Z0-9_\-\./\[\]]+\.[a-zA-Z0-9]+)(?:\s*\*\/)?$/)
        if (commentMatch) {
          finalFilename = commentMatch[1]
          // 첫 줄 주석을 코드 본문에서 깔끔하게 제거하여 파일명 헤더로 승격
          finalCode = codeBlockLines.slice(1).join('\n')
        }
      }

      if (codeBlockLang === 'demo') {
        // 코드펜스는 본문에 예제를 심지 않는다. 링크 카드만 그린다 (규칙 16).
        const demoConfig = parseDemoBlock(finalCode)
        const matchedDemo = demos.find((d) => d.url === demoConfig.path)

        elements.push(
          <DemoLinkCard
            key={`demo-${demoConfig.path || idx++}`}
            path={demoConfig.path}
            title={matchedDemo?.title}
            caption={demoConfig.caption}
          />,
        )
      } else {
        elements.push(
          <CodeBlock
            key={`code-${idx++}`}
            code={finalCode}
            language={codeBlockLang}
            filename={finalFilename}
          />,
        )
      }
      continue
    }

    if (inCodeBlock) {
      codeBlockLines.push(line)
      continue
    }

    // 2. <details> 블록 파싱 (연습 문제 정답 및 접기 영역)
    const singleLineDetailsMatch = trimmed.match(
      /^<details>\s*<summary>(.*?)<\/summary>(.*?)<\/details>$/i,
    )
    if (singleLineDetailsMatch) {
      if (inTable) flushTable()
      if (inDetails) flushDetails()
      if (listType) flushList()

      const summaryText = singleLineDetailsMatch[1].trim() || '정답 보기'
      const bodyText = singleLineDetailsMatch[2].trim()

      elements.push(
        <Details key={`details-${idx++}`} summary={summaryText}>
          {bodyText ? <p>{renderInline(bodyText, docPath)}</p> : null}
        </Details>,
      )
      continue
    }

    if (trimmed.startsWith('<details')) {
      if (inTable) flushTable()
      if (inDetails) flushDetails()
      if (listType) flushList()

      inDetails = true
      detailsSummary = ''
      detailsLines = []

      const summaryMatch = trimmed.match(/<summary>(.*?)<\/summary>/i)
      if (summaryMatch) {
        detailsSummary = summaryMatch[1].trim()
        const afterSummary = trimmed
          .replace(/^<details[^>]*>/i, '')
          .replace(/<summary>.*?<\/summary>/i, '')
          .trim()
        if (afterSummary) {
          detailsLines.push(afterSummary)
        }
      }
      continue
    }

    if (inDetails) {
      if (!detailsSummary) {
        const summaryMatch = trimmed.match(/<summary>(.*?)<\/summary>/i)
        if (summaryMatch) {
          detailsSummary = summaryMatch[1].trim()
          const afterSummary = trimmed.replace(/<summary>.*?<\/summary>/i, '').trim()
          if (afterSummary) {
            detailsLines.push(afterSummary)
          }
          continue
        }
      }

      if (trimmed.includes('</details>')) {
        const beforeClose = trimmed.replace(/<\/details>/i, '').trim()
        if (beforeClose) {
          detailsLines.push(beforeClose)
        }
        flushDetails()
        continue
      }

      detailsLines.push(line)
      continue
    }

    // 3. 한 줄을 통째로 차지하는 이미지
    const imgBlockMatch = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/)
    if (imgBlockMatch) {
      if (inTable) flushTable()
      if (listType) flushList()
      elements.push(
        <Figure
          key={`fig-${idx++}`}
          src={resolveAssetUrl(imgBlockMatch[2], docPath)}
          alt={imgBlockMatch[1]}
        />,
      )
      continue
    }

    // 4. 표
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      if (listType) flushList()
      inTable = true
      tableLines.push(trimmed)
      continue
    } else if (inTable) {
      flushTable()
    }

    // 5. 헤딩 — 원본의 네 벌 복붙을 표 순회로 접었다
    const heading = HEADING_MARKS.find((h) => trimmed.startsWith(h.mark))
    if (heading) {
      if (listType) flushList()
      const headingText = trimmed.slice(heading.mark.length).trim()
      const { primary, alias } = slugify(headingText)
      elements.push(
        <Heading key={`h${heading.level}-${idx++}`} level={heading.level} id={primary} alias={alias}>
          {renderInline(headingText, docPath)}
        </Heading>,
      )
      continue
    }

    // 6. 인용문과 경고 블록
    if (trimmed.startsWith('>')) {
      if (listType) flushList()
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

    // 7. 복수 선택 목록 (- [ ] 또는 - [x] -> 번호 있는 목록 1, 2, 3, 4로 렌더링)
    const taskMatch = trimmed.match(/^-\s+\[([ xX])\]\s+(.*)$/)
    if (taskMatch) {
      if (inTable) flushTable()
      if (inDetails) flushDetails()
      if (listType !== 'ordered') flushList()
      listType = 'ordered'

      listItems.push(
        <ListItem key={`ol-${idx++}`}>{renderInline(taskMatch[2], docPath)}</ListItem>,
      )
      continue
    }

    // 8. 순서 없는 목록
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const listContent = trimmed.slice(2).trim()

      if (META_LINE_PREFIXES.some((p) => listContent.startsWith(p))) {
        continue
      }

      if (inTable) flushTable()
      if (inDetails) flushDetails()
      if (listType !== 'unordered') flushList()
      listType = 'unordered'

      listItems.push(
        <ListItem key={`li-${idx++}`}>{renderInline(listContent, docPath)}</ListItem>,
      )
      continue
    }

    // 9. 순서 있는 목록 (1. 또는 A.)
    const olMatch = trimmed.match(/^(\d+|[A-Z])\.\s+(.+)$/)
    if (olMatch) {
      if (inTable) flushTable()
      if (inDetails) flushDetails()
      if (listType !== 'ordered') flushList()
      listType = 'ordered'

      listItems.push(
        <ListItem key={`ol-${idx++}`}>{renderInline(olMatch[2], docPath)}</ListItem>,
      )
      continue
    }

    // 10. 수평선
    if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
      if (listType) flushList()
      elements.push(<hr key={`hr-${idx++}`} className="my-6 border-zinc-200 dark:border-zinc-800" />)
      continue
    }

    // 11. 빈 줄
    if (!trimmed) {
      if (listType) flushList()
      continue
    }

    // 12. 그 밖엔 문단
    if (listType) flushList()
    elements.push(<Paragraph key={`p-${idx++}`}>{renderInline(line, docPath)}</Paragraph>)
  }

  if (inTable) {
    flushTable()
  }

  if (inDetails) {
    flushDetails()
  }

  if (listType) {
    flushList()
  }

  return (
    <article className={`space-y-1 font-sans ${className}`}>
      {elements}
      {showDemoList && relatedDemos.length > 0 && <DocDemoList demos={relatedDemos} />}
    </article>
  )
}
