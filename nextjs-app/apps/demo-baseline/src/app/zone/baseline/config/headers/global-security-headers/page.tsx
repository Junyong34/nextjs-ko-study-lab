import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'
import { HeadersSecurityLab } from './components/HeadersSecurityLab'

export const metadata: Metadata = getDemoMetadata('baseline', 'config/headers/global-security-headers')

export default function DemoPage() {
  return <HeadersSecurityLab />
}
