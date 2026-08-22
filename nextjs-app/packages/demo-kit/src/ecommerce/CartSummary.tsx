"use client"
import React from "react"
import type { CartItem } from "./types"

interface CartSummaryProps {
  items: CartItem[]
  onQuantityChange?: (productId: string, delta: number) => void
  onRemoveItem?: (productId: string) => void
  onCheckout?: () => void
  className?: string
}

export function CartSummary({
  items,
  onQuantityChange,
  onRemoveItem,
  onCheckout,
  className = ""
}: CartSummaryProps) {
  const totalAmount = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const totalOriginal = items.reduce((sum, item) => sum + item.product.originalPrice * item.quantity, 0)
  const totalDiscount = totalOriginal - totalAmount
  const shippingFee = totalAmount >= 50000 || totalAmount === 0 ? 0 : 3000

  return (
    <div className={`rounded-lg border border-zinc-200 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-950 ${className}`}>
      <div className="flex items-center justify-between border-b border-zinc-200 pb-3 dark:border-zinc-800">
        <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
          장바구니 내역 ({items.reduce((s, i) => s + i.quantity, 0)}개)
        </h4>
        <span className="text-xs text-zinc-500 font-mono">
          {shippingFee === 0 ? "무료배송 적용" : "5만원 이상 무료배송"}
        </span>
      </div>

      {/* 품목 리스트 */}
      <div className="divide-y divide-zinc-100 dark:divide-zinc-800 my-2 max-h-56 overflow-y-auto">
        {items.length === 0 ? (
          <div className="py-8 text-center text-xs text-zinc-400">장바구니가 비어 있습니다.</div>
        ) : (
          items.map(item => (
            <div key={item.product.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-zinc-900 truncate dark:text-zinc-100">
                  {item.product.name}
                </div>
                <div className="text-zinc-500 font-mono">
                  {item.product.price.toLocaleString()}원 × {item.quantity}개 = {(item.product.price * item.quantity).toLocaleString()}원
                </div>
              </div>

              {/* 수량 조절 버튼 */}
              <div className="flex items-center gap-1">
                {onQuantityChange && (
                  <>
                    <button
                      type="button"
                      onClick={() => onQuantityChange(item.product.id, -1)}
                      className="w-6 h-6 rounded border border-zinc-200 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 cursor-pointer font-bold"
                    >
                      -
                    </button>
                    <span className="w-6 text-center font-mono font-bold text-zinc-800 dark:text-zinc-200">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => onQuantityChange(item.product.id, 1)}
                      className="w-6 h-6 rounded border border-zinc-200 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 cursor-pointer font-bold"
                    >
                      +
                    </button>
                  </>
                )}
                {onRemoveItem && (
                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.product.id)}
                    className="ml-1 text-zinc-400 hover:text-rose-500 cursor-pointer font-bold text-sm"
                    aria-label="삭제"
                  >
                    삭제
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* 정산 요약 */}
      {items.length > 0 && (
        <div className="border-t border-zinc-200 pt-3 space-y-1.5 text-xs dark:border-zinc-800">
          <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
            <span>상품 금액</span>
            <span>{totalOriginal.toLocaleString()}원</span>
          </div>
          {totalDiscount > 0 && (
            <div className="flex justify-between text-rose-600 dark:text-rose-400">
              <span>상품 할인</span>
              <span>-{totalDiscount.toLocaleString()}원</span>
            </div>
          )}
          <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
            <span>배송비</span>
            <span>{shippingFee === 0 ? "0원 (무료)" : `${shippingFee.toLocaleString()}원`}</span>
          </div>
          <div className="flex justify-between font-bold text-sm text-zinc-900 border-t border-dashed border-zinc-200 pt-2 dark:text-zinc-100 dark:border-zinc-800">
            <span>최종 결제 금액</span>
            <span className="text-blue-600 dark:text-blue-400 font-extrabold text-base">
              {(totalAmount + shippingFee).toLocaleString()}원
            </span>
          </div>

          {onCheckout && (
            <button
              type="button"
              onClick={onCheckout}
              className="w-full mt-3 rounded-lg bg-blue-600 py-2.5 font-bold text-xs text-white shadow-sm hover:bg-blue-700 transition cursor-pointer"
            >
              주문서 작성 및 결제하기 ({(totalAmount + shippingFee).toLocaleString()}원)
            </button>
          )}
        </div>
      )}
    </div>
  )
}
