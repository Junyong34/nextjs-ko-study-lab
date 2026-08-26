import type { Metadata } from 'next'
import { LearningProgressScreen } from './components/LearningProgressScreen'

export const metadata: Metadata = {
  title: '학습 기록',
  description: '완료로 표시한 Next.js 학습 문서와 데모 기록을 확인합니다.',
}

export default async function StudyProgressPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>
}) {
  const { tab } = await searchParams
  return <LearningProgressScreen tab={tab === 'demos' ? 'demos' : 'documents'} />
}
