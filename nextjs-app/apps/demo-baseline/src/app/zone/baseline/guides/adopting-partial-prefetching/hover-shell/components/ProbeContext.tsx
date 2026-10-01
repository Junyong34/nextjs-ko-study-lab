'use client'

import { createContext, useContext } from 'react'

// 하위 페이지의 Link가 hover를 기록할 수 있게 layout의 관측 훅을 내려준다.
export const ProbeContext = createContext<{ recordHover: (label: string) => void }>({ recordHover: () => {} })

export const useProbeContext = () => useContext(ProbeContext)
