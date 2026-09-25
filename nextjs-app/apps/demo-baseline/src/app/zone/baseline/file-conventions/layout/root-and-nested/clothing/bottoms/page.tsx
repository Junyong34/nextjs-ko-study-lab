import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'file-conventions/layout/root-and-nested/clothing/bottoms')

import React from 'react'
import { PageProbe } from '../../components/PageProbe'

export default function ClothingBottomsPage() {
  return <PageProbe pageFile="root-and-nested/clothing/bottoms/page.tsx">하의 목록입니다. 이 폴더에는 layout.tsx가 없어서 의류 layout만 감쌉니다.</PageProbe>
}
