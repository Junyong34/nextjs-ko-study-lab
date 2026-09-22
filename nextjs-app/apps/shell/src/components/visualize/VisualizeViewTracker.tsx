import { ContentViewTracker } from '@/components/analytics/ContentViewTracker'

export function VisualizeViewTracker({ demoKey, demoTitle, group }: { demoKey: string; demoTitle: string; group: string }) {
  return <ContentViewTracker contentId={demoKey} group={group} type="visualize" event={{ name: 'visualize_view', params: { demo_key: demoKey, demo_title: demoTitle, group } }} />
}
