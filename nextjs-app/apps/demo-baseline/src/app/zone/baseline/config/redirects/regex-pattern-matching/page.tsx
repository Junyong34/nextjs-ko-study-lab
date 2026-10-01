import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'
import { RedirectsRegexLab } from './components/RedirectsRegexLab'

export const metadata: Metadata = getDemoMetadata('baseline', 'config/redirects/regex-pattern-matching')

export default function DemoPage() {
  return <RedirectsRegexLab />
}
