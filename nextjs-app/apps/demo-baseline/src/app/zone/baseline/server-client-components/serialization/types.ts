export interface SerializablePayload {
  primitiveString: string
  primitiveNumber: number
  primitiveBoolean: boolean
  plainObject: {
    sku: string
    stock: number
    inStock: boolean
  }
  arrayData: string[]
  dateString: string
  nullValue: null
  serverActionName: string
}
