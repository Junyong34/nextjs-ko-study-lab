'use client'
import { createContext, useContext, useState, type ReactNode } from 'react'
const SearchState = createContext({ note: '', setNote: (_value: string) => {} })
export const useSearchLayoutState = () => useContext(SearchState)
export function SearchLayoutState({ children }: { children: ReactNode }) {
  const [note, setNote] = useState('')
  return <SearchState.Provider value={{ note, setNote }}>{children}</SearchState.Provider>
}
