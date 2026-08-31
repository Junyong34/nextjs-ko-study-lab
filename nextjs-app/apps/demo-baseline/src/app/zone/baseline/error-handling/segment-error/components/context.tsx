'use client'

import React, { createContext, useContext, useState } from 'react'

export type FlowStage = 'order' | 'payment_ready' | 'errored' | 'recovered' | 'completed'

interface PaymentFlowContextValue {
  stage: FlowStage
  setStage: (stage: FlowStage) => void
  errorMsg: string | null
  setErrorMsg: (msg: string | null) => void
}

const PaymentFlowContext = createContext<PaymentFlowContextValue>({
  stage: 'order',
  setStage: () => {},
  errorMsg: null,
  setErrorMsg: () => {},
})

export function PaymentFlowProvider({ children }: { children: React.ReactNode }) {
  const [stage, setStage] = useState<FlowStage>('order')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  return (
    <PaymentFlowContext.Provider value={{ stage, setStage, errorMsg, setErrorMsg }}>
      {children}
    </PaymentFlowContext.Provider>
  )
}

export function usePaymentFlow() {
  return useContext(PaymentFlowContext)
}
