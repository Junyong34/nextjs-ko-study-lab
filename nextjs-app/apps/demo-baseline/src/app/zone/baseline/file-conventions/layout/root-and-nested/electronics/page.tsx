import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'file-conventions/layout/root-and-nested/electronics')

import React from 'react'
import { PageProbe } from '../components/PageProbe'

export default function ElectronicsPage() {
  return <PageProbe pageFile="root-and-nested/electronics/page.tsx">전자기기 목록입니다. 의류 폴더 밖이라 의류·상의 layout이 적용되지 않습니다.</PageProbe>
}
