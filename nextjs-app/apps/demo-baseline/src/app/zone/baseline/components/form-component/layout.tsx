import type { ReactNode } from 'react'
import { SearchLayoutState } from './components/SearchLayoutState'
export default function Layout({ children }: { children: ReactNode }) {
  return <SearchLayoutState>{children}</SearchLayoutState>
}
