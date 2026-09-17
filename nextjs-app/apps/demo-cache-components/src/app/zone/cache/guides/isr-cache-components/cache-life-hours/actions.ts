'use server'

import { revalidateTag } from 'next/cache'

export async function purgeHeroBannerCacheAction() {
  revalidateTag('guides-isr-cache-components-cache-life-hours:hero-banner', 'max')
}
