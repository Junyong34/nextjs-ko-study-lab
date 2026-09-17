'use server'

import { revalidateTag } from 'next/cache'

export async function purgeLegacyCacheAction() {
  revalidateTag('guides-migrating-cache-components-unstable-to-use-cache:legacy-product', 'max')
}

export async function purgeModernCacheAction() {
  revalidateTag('guides-migrating-cache-components-unstable-to-use-cache:modern-product', 'max')
}
