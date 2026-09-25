import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'file-conventions/layout/root-and-nested/clothing/tops')

import React from 'react'
import { PageProbe } from '../../components/PageProbe'

export default function ClothingTopsPage() {
  return <PageProbe pageFile="root-and-nested/clothing/tops/page.tsx">상의 목록입니다. 의류 layout 안에 상의 하위 layout이 한 겹 더 들어갑니다.</PageProbe>
}
