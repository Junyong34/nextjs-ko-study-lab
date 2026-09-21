'use server'

import { revalidateTag } from 'next/cache'
import { TAGS } from './tags'

export async function purgeByProductTagAction() {
  revalidateTag(TAGS.product, 'max')
}

export async function purgeByCategoryTagAction() {
  revalidateTag(TAGS.category, 'max')
}

export async function purgeByBrandTagAction() {
  revalidateTag(TAGS.brand, 'max')
}
