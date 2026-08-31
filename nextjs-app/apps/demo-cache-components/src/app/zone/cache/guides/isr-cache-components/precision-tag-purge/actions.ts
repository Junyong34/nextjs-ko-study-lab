'use server'

import { revalidateTag } from 'next/cache'

export async function purgeProduct101Action() {
  revalidateTag('product-101', 'max')
}

export async function purgeCategoryElectronicsAction() {
  revalidateTag('category-electronics', 'max')
}
