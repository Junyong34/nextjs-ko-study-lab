import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'
import { CheckoutSegmentLayout } from './components/CheckoutSegmentLayout'

export const metadata: Metadata = getDemoMetadata('baseline', 'file-conventions/error/payment-error-boundary/checkout')

export default function Layout({ children }: { children: React.ReactNode }) {
  return <CheckoutSegmentLayout>{children}</CheckoutSegmentLayout>
}
