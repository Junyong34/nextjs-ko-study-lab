'use server'

import { draftMode } from 'next/headers'

export async function enableDraftAction() {
  ;(await draftMode()).enable()
}

export async function disableDraftAction() {
  ;(await draftMode()).disable()
}
