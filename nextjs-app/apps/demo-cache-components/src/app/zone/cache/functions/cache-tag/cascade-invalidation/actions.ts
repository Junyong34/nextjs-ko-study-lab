'use server'

import { revalidateTag } from 'next/cache'
import { TAGS } from './tags'

export async function purgeCategoryTagAction() {
  revalidateTag(TAGS.category, 'max')
}

export async function purgeProductsTagAction() {
  revalidateTag(TAGS.products, 'max')
}
