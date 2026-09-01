import type { Metadata } from 'next'
import { LearningProgressScreen } from './components/LearningProgressScreen'
import { buildPageMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = buildPageMetadata({
  title: '학습 기록',
  description: '완료로 표시한 Next.js 학습 문서와 데모 기록을 확인합니다.',
  path: '/study-progress',
  // 학습자 개인 진행 상태를 보여주는 유틸리티 화면이라 검색 결과 노출 가치가 없음
  noIndex: true,
})

export default async function StudyProgressPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>
}) {
  const { tab } = await searchParams
  return <LearningProgressScreen tab={tab === 'demos' ? 'demos' : 'documents'} />
}
