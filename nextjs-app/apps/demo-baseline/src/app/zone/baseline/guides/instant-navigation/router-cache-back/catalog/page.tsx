import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'
import { ServerRenderCard } from '../components/ServerRenderCard'

export const metadata: Metadata = getDemoMetadata('baseline', 'guides/instant-navigation/router-cache-back/catalog')

/** 동적 page: 요청마다 서버에서 새로 렌더되며 렌더 ID를 새로 만든다. */
export default function CatalogPage() {
  return <ServerRenderCard route="catalog" />
}
