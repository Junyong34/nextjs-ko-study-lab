export interface Item {
  id: string
  name: string
  price: number
  status: 'in_stock' | 'sold_out'
}
