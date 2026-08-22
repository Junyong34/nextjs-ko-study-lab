export interface DeliveryStatus {
  trackingId: string
  status: 'payment_done' | 'preparing' | 'in_transit' | 'delivered'
  statusLabel: string
  updatedAt: string
  currentLocation: string
  pollCount: number
}
