export interface Order {
  id: string
  item: string
  amount: number
}

export interface OrderLookupResult {
  status: 200 | 401
  authorizationReceived: string | null
  orders?: Order[]
  error?: string
}

export interface DebugHeader {
  key: string
  value: string
}
