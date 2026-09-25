import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'file-conventions/layout/root-and-nested/clothing')

import React from 'react'
import { PageProbe } from '../components/PageProbe'

export default function ClothingPage() {
  return <PageProbe pageFile="root-and-nested/clothing/page.tsx">의류 카테고리 목록입니다. clothing/layout.tsx가 이 page를 감쌉니다.</PageProbe>
}
