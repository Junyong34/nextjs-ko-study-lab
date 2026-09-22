import { ContentViewTracker } from '@/components/analytics/ContentViewTracker'

export function DemoViewTracker({ zone, demoUrl, demoTitle }: { zone: string; demoUrl: string; demoTitle: string }) {
  return <ContentViewTracker contentId={demoUrl} group={zone} type="demo" event={{ name: 'demo_view', params: { zone, demo_url: demoUrl, demo_title: demoTitle } }} />
}
