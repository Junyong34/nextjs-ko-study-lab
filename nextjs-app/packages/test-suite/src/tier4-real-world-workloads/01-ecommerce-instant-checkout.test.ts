import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { computeExpectedActualMatch } from '../utils/test-helpers.ts'

describe('Tier 4: Scenario 1 - E-Commerce Instant Checkout Flow', () => {
  it('should execute end-to-end instant checkout with server actions, transition state, and verification', async () => {
    // 1. Initial State
    interface CartItem {
      sku: string
      name: string
      price: number
      quantity: number
    }
    const cart: CartItem[] = [
      { sku: 'PROD-101', name: 'Running Shoes', price: 129000, quantity: 1 },
      { sku: 'PROD-202', name: 'Cotton Socks', price: 9000, quantity: 2 },
    ]
    const coupon = { code: 'WELCOME10', discountRate: 0.1 }

    // 2. Client-side Calculation
    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
    const discount = Math.round(subtotal * coupon.discountRate)
    const expectedFinalPrice = subtotal - discount
    assert.strictEqual(subtotal, 147000)
    assert.strictEqual(discount, 14700)
    assert.strictEqual(expectedFinalPrice, 132300)

    // 3. Simulated Server Action Execution with Closure Capture
    const checkoutServerAction = async (orderPayload: {
      items: CartItem[]
      couponCode: string
      expectedTotal: number
    }) => {
      // Invariant checks on server
      const calculatedSubtotal = orderPayload.items.reduce((acc, i) => acc + i.price * i.quantity, 0)
      const serverDiscount = orderPayload.couponCode === 'WELCOME10' ? Math.round(calculatedSubtotal * 0.1) : 0
      const serverTotal = calculatedSubtotal - serverDiscount

      if (serverTotal !== orderPayload.expectedTotal) {
        throw new Error('PRICE_MISMATCH_REJECTED')
      }

      return {
        orderId: 'ORD-2026-88991',
        status: 'PAID',
        chargedAmount: serverTotal,
        processedAt: new Date().toISOString(),
      }
    }

    // 4. Client transition execution
    let isPending = true
    const orderResult = await checkoutServerAction({
      items: cart,
      couponCode: coupon.code,
      expectedTotal: expectedFinalPrice,
    })
    isPending = false

    assert.strictEqual(isPending, false)
    assert.strictEqual(orderResult.orderId, 'ORD-2026-88991')
    assert.strictEqual(orderResult.status, 'PAID')

    // 5. Dynamic ExpectedActualPanel Verification
    const isMatched = computeExpectedActualMatch(expectedFinalPrice, orderResult.chargedAmount)
    assert.strictEqual(isMatched, true, 'Charged amount must match expected total in verification panel')
  })
})
