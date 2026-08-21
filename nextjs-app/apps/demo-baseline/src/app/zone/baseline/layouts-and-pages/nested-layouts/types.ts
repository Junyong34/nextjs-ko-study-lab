export type RenderingMode = 'nested-layout' | 'no-layout'

export interface Product {
  id: string
  name: string
  category: 'all' | 'shoes' | 'clothing' | 'electronics'
  price: number
  stock: number
  categoryLabel: string
  keywords: string[]
}

export type CategoryKey = 'all' | 'shoes' | 'clothing' | 'electronics'

export interface CategoryInfo {
  key: CategoryKey
  name: string
  description: string
}
