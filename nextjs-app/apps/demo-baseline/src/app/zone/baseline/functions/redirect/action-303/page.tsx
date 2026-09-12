import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'
import { DemoContainer } from '@study/demo-kit'
import { RedirectAction303Demo } from './components/RedirectAction303Demo'
import { RedirectDeepDive } from './components/RedirectDeepDive'
import { RedirectGuide } from './components/RedirectGuide'

export const metadata: Metadata = getDemoMetadata('baseline', 'functions/redirect/action-303')

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <RedirectGuide />
      <RedirectAction303Demo />
      <RedirectDeepDive />
    </DemoContainer>
  )
}
