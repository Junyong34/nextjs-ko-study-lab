import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'layouts-and-pages/route-groups-layouts')

import { redirect } from 'next/navigation'

export default function RouteGroupsIndexPage() {
  redirect('/zone/baseline/layouts-and-pages/route-groups-layouts/products')
}
