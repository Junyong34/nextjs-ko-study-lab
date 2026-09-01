import { DemoIframe } from '@study/docs-render'
import { DemoPageHeader } from '@study/ui'
import type { Demo } from '@/lib/docs'
import { DemoBackButton } from './DemoBackButton'
import { DemoViewTracker } from './DemoViewTracker'
import { LearningCompletionControl } from '@/components/learning-progress/LearningCompletionControl'

export function DemoViewer({
  demo,
  docUrl,
  docTitle,
  backUrl,
  backLabel,
  siblingDemos,
  docSlug,
}: {
  demo: Demo
  docUrl: string
  docTitle: string
  backUrl: string
  backLabel: string
  siblingDemos: Demo[]
  docSlug?: string
}) {
  const iframeSrc = `/zone/${demo.zone}/${demo.url}`
  const getDemoHref = docSlug
    ? (targetUrl: string) => `/demo/${docSlug}?run=${encodeURIComponent(targetUrl)}`
    : undefined

  return (
    <div className="space-y-6">
      <DemoViewTracker zone={demo.zone} demoUrl={demo.url} demoTitle={demo.title} />

      <DemoPageHeader
        title={demo.title}
        zone={demo.zone}
        status={demo.status}
        url={demo.url}
        docUrl={docUrl}
        docTitle={docTitle}
        backUrl={backUrl}
        backLabel={backLabel}
        customBackButton={<DemoBackButton fallbackUrl={backUrl} fallbackLabel={backLabel} />}
        siblingDemos={siblingDemos}
        currentDemoUrl={demo.url}
        getDemoHref={getDemoHref}
      />

      <LearningCompletionControl
        kind="demo"
        itemKey={demo.url}
        label="이 데모를 학습 완료로 표시"
      />

      <div className="w-full">
        <DemoIframe
          variant="standalone"
          src={iframeSrc}
          label={iframeSrc}
          title={demo.title}
          externalHref={iframeSrc}
          initialHeight={600}
          minHeight={400}
        />
      </div>
    </div>
  )
}
