export interface Product {
  id: string
  name: string
  category: "electronics" | "fashion" | "books" | "living" | "sports"
  categoryName: string
  price: number
  originalPrice: number
  discountRate: number
  stock: number
  rating: number
  reviewCount: number
  imageUrl: string
  description: string
  tags: string[]
  isNew?: boolean
  isBest?: boolean
}

export interface CartItem {
  product: Product
  quantity: number
  selected: boolean
  selectedOption?: string
}

export interface Order {
  id: string
  orderNumber: string
  items: CartItem[]
  totalAmount: number
  discountAmount: number
  shippingFee: number
  finalAmount: number
  status: "PAYMENT_PENDING" | "PAID" | "PREPARING" | "SHIPPING" | "DELIVERED" | "CANCELLED"
  statusName: string
  recipient: {
    name: string
    phone: string
    address: string
    zipCode: string
  }
  paymentMethod: "CARD" | "TOSS_PAY" | "KAKAO_PAY" | "TRANSFER"
  createdAt: string
}

export interface Coupon {
  id: string
  code: string
  name: string
  discountType: "PERCENT" | "FIXED"
  discountValue: number
  minOrderAmount: number
  expiresAt: string
}

export interface UserSession {
  userId: string
  email: string
  name: string
  role: "CUSTOMER" | "VIP" | "SELLER" | "ADMIN"
  tier: "BRONZE" | "SILVER" | "GOLD" | "PLATINUM"
  points: number
  token?: string
}
