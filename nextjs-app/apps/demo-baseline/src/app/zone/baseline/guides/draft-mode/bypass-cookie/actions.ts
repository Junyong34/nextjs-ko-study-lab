'use server'

import { draftMode } from 'next/headers'

export async function enableDraftBypassAction() {
  ;(await draftMode()).enable()
}

export async function disableDraftBypassAction() {
  ;(await draftMode()).disable()
}
