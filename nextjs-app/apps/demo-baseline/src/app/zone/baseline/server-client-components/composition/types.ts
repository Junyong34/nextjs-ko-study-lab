export interface ProductDetail {
  id: string
  name: string
  price: number
  renderedAt: string
  specs: {
    label: string
    value: string
  }[]
  serverSecretNote: string
}
