import type { DemoGroup, DemoKey, DemoMeta } from './data'

export type NextjsDemoGroup = Exclude<DemoGroup, 'generic'>

export type FilterGroup = 'all' | NextjsDemoGroup

export interface VisualizeFilterOption {
  key: FilterGroup
  label: string
  count: number
}

export type { DemoGroup, DemoKey, DemoMeta }
