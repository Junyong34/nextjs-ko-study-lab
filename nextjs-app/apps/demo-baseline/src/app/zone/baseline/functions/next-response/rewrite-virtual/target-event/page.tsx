import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata(
  'baseline',
  'functions/next-response/rewrite-virtual/target-event',
)

import React from 'react'
import { headers } from 'next/headers'
import { DemoContainer } from '@study/demo-kit'
import { TargetEventContent } from '../components/TargetEventContent'
import { VerificationFooter } from '../components/VerificationFooter'
import type { RouteAccessMode } from '../types'

export default async function TargetEventPage({
  searchParams,
}: {
  searchParams: Promise<{ via?: string }>
}) {
  const headersList = await headers()
  const rewriteOrigin = headersList.get('x-rewrite-origin')
  const { via } = await searchParams

  const mode: RouteAccessMode = rewriteOrigin ? 'rewrite' : via === 'redirect' ? 'redirect' : 'direct'

  return (
    <DemoContainer className="space-y-6">
      <TargetEventContent mode={mode} />
      <VerificationFooter variant="result" mode={mode} originPath={rewriteOrigin} />
    </DemoContainer>
  )
}
