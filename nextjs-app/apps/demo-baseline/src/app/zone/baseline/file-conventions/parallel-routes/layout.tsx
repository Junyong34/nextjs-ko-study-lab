import type { ReactNode } from 'react'
import { ParallelPracticeFrame } from './components/ParallelPracticeFrame'
export default function Layout({ children, analytics, team }: { children: ReactNode; analytics: ReactNode; team: ReactNode }) {
  return <ParallelPracticeFrame analytics={analytics} team={team}>{children}</ParallelPracticeFrame>
}
