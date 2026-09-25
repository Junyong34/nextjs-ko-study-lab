'use client'

import React, { use } from 'react'
import { ModalShell } from '../../../components/ModalShell'
import { NavigationVerification } from '../../../components/NavigationVerification'
import { getTargetItem } from '../../../target-items'

export default function InterceptedTargetModal({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const item = getTargetItem(id)

  return (
    <ModalShell item={item}>
      <NavigationVerification mode="modal" itemId={id} />
    </ModalShell>
  )
}
