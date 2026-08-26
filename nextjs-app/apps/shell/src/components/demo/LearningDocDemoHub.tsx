'use client'

import { DocDemoHub, type DocDemoHubProps } from '@study/ui'
import { useLearningProgress } from '@/components/learning-progress/LearningProgressProvider'

export function LearningDocDemoHub(props: DocDemoHubProps) {
  const { isCompleted } = useLearningProgress()
  const learningCompletedUrls = props.demos
    .filter((demo) => demo.status === 'done' && isCompleted('demo', demo.url))
    .map((demo) => demo.url)

  return <DocDemoHub {...props} learningCompletedUrls={learningCompletedUrls} />
}
