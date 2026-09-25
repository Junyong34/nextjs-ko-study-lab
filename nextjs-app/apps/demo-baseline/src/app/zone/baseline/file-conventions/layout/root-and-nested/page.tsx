import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'file-conventions/layout/root-and-nested')

import React from 'react'
import { PageProbe } from './components/PageProbe'

export default function RootAndNestedIndexPage() {
  return <PageProbe pageFile="root-and-nested/page.tsx">데모 첫 화면입니다. 이 경로 위에는 루트 layout과 데모 layout만 있습니다.</PageProbe>
}
