import React from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DemoEmptyState } from '@study/ui'
import {
  getDemos,
  getDemoByUrl,
  getDemosByDoc,
  getManifest,
  getDocBySlug,
  findDocForDemo,
} from '@/lib/docs'
import { LearningDocDemoHub } from '@/components/demo/LearningDocDemoHub'
import { DemoViewer } from '@/components/demo/DemoViewer'

interface DemoPageProps {
  params: Promise<{
    slug: string[]
  }>
  searchParams?: Promise<{
    run?: string
  }>
}

export async function generateStaticParams() {
  const demos = getDemos()
  const manifest = getManifest()

  const demoParams = demos.map((demo) => ({
    slug: demo.url.split('/'),
  }))

  const docParams = (manifest.docs || [])
    .filter((doc) => doc.slug && doc.slug.length > 0)
    .map((doc) => ({
      slug: doc.slug,
    }))

  // 중복 slug 제거
  const seen = new Set<string>()
  const result: Array<{ slug: string[] }> = []

  for (const item of [...demoParams, ...docParams]) {
    const key = item.slug.join('/')
    if (!seen.has(key)) {
      seen.add(key)
      result.push(item)
    }
  }

  return result
}

export async function generateMetadata({ params, searchParams }: DemoPageProps): Promise<Metadata> {
  const { slug } = await params
  const { run } = (await searchParams) || {}
  const slugStr = slug.join('/')

  const directDemo = getDemoByUrl(slugStr)
  if (directDemo) {
    return {
      title: `${directDemo.title} - 실습 데모`,
      description: `${directDemo.title} 실습 데모 - Next.js App Router 학습`,
    }
  }

  const doc = getDocBySlug(slug)
  if (doc) {
    if (run) {
      const runningDemo = getDemoByUrl(run)
      if (runningDemo) {
        return {
          title: `${runningDemo.title} - ${doc.title} 데모`,
          description: `${doc.title} - ${runningDemo.title} 실습 데모`,
        }
      }
    }
    return {
      title: `${doc.title} 실습 데모`,
      description: `${doc.title} 관련 인터랙티브 실습 예제 목록`,
    }
  }

  return { title: '데모를 찾을 수 없습니다' }
}

export default async function DemoPage({ params, searchParams }: DemoPageProps) {
  const { slug } = await params
  const { run } = (await searchParams) || {}
  const slugStr = slug.join('/')
  const manifest = getManifest()

  // 1. 직접 데모 URL 접근인 경우 (예: /demo/server-actions/basic)
  const directDemo = getDemoByUrl(slugStr)
  if (directDemo) {
    const matchedDoc = findDocForDemo(manifest, directDemo.doc)
    const siblingDemos = matchedDoc ? getDemosByDoc(matchedDoc.path) : [directDemo]
    const docSlug = matchedDoc ? matchedDoc.slug.join('/') : ''
    const backUrl = docSlug ? `/demo/${docSlug}` : '/demo'
    const backLabel = matchedDoc ? `${matchedDoc.title} 데모 목록` : '전체 데모 목록'
    return (
      <DemoViewer
        demo={directDemo}
        docUrl={matchedDoc?.url ?? '/'}
        docTitle={matchedDoc?.title ?? directDemo.doc}
        backUrl={backUrl}
        backLabel={backLabel}
        siblingDemos={siblingDemos}
      />
    )
  }

  // 2. 문서 슬러그 기준 데모 메뉴 접근인 경우 (예: /demo/getting-started/caching)
  const doc = getDocBySlug(slug)
  if (!doc) {
    notFound()
  }

  const docDemos = getDemosByDoc(doc.path)
  const docSlug = doc.slug.join('/')
  const category =
    doc.slug.length > 1
      ? doc.slug
          .slice(0, -1)
          .map((s) => s.replace(/-/g, ' '))
          .join(' > ')
      : undefined

  // 2-A. 등록된 데모가 없는 문서인 경우 -> Empty State 노출
  if (docDemos.length === 0) {
    return (
      <DemoEmptyState
        docTitle={doc.title}
        category={category}
        docUrl={doc.url}
      />
    )
  }

  // 2-B. 특정 데모 실행 쿼리(?run=...)가 지정된 경우 -> 데모 실행 뷰어 노출
  if (run) {
    const runningDemo = docDemos.find((d) => d.url === run) || getDemoByUrl(run) || docDemos[0]
    const backUrl = `/demo/${docSlug}`
    const backLabel = `${doc.title} 데모 목록`

    return (
      <DemoViewer
        demo={runningDemo}
        docUrl={doc.url}
        docTitle={doc.title}
        backUrl={backUrl}
        backLabel={backLabel}
        siblingDemos={docDemos}
        docSlug={docSlug}
      />
    )
  }

  // 2-C. 해당 문서의 데모 메인 페이지 (데모 카드 목록 허브)
  return (
    <LearningDocDemoHub
      docTitle={doc.title}
      category={category}
      docUrl={doc.url}
      docSlug={docSlug}
      demos={docDemos}
    />
  )
}
