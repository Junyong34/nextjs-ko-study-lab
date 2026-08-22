"use client"
import React from "react"
import type { Product } from "./types"

interface ProductCardProps {
  product: Product
  onAddToCart?: (product: Product) => void
  onToggleWishlist?: (product: Product) => void
  isWishlisted?: boolean
  className?: string
}

export function ProductCard({
  product,
  onAddToCart,
  onToggleWishlist,
  isWishlisted = false,
  className = ""
}: ProductCardProps) {
  const isOutOfStock = product.stock <= 0

  return (
    <div className={`group relative flex flex-col rounded-lg border border-zinc-200 bg-white p-4 shadow-xs transition hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700 ${className}`}>
      {/* 뱃지 영역 */}
      <div className="flex items-center justify-between gap-1 mb-2">
        <div className="flex items-center gap-1.5">
          {product.isBest && (
            <span className="rounded bg-rose-500 px-1.5 py-0.5 text-[10px] font-bold text-white">BEST</span>
          )}
          {product.isNew && (
            <span className="rounded bg-emerald-500 px-1.5 py-0.5 text-[10px] font-bold text-white">NEW</span>
          )}
          <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">{product.categoryName}</span>
        </div>
        {onToggleWishlist && (
          <button
            type="button"
            onClick={() => onToggleWishlist(product)}
            className={`text-[11px] font-bold rounded px-1.5 py-0.5 border cursor-pointer transition ${
              isWishlisted
                ? "border-rose-300 bg-rose-50 text-rose-600 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-300"
                : "border-zinc-200 text-zinc-500 hover:border-zinc-300 dark:border-zinc-700 dark:text-zinc-400"
            }`}
            aria-label="위시리스트 토글"
          >
            {isWishlisted ? "찜됨" : "찜하기"}
          </button>
        )}
      </div>

      {/* 상품명 */}
      <h4 className="font-bold text-sm text-zinc-900 line-clamp-1 dark:text-zinc-100 group-hover:text-blue-600 transition">
        {product.name}
      </h4>
      <p className="text-xs text-zinc-500 line-clamp-2 mt-1 mb-3 dark:text-zinc-400">{product.description}</p>

      {/* 가격 및 할인 정보 */}
      <div className="mt-auto pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-end justify-between">
        <div>
          {product.discountRate > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-zinc-400 line-through">
                {product.originalPrice.toLocaleString()}원
              </span>
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                {product.discountRate}% OFF
              </span>
            </div>
          )}
          <div className="text-base font-extrabold text-zinc-900 dark:text-zinc-100">
            {product.price.toLocaleString()}
            <span className="text-xs font-normal text-zinc-600 dark:text-zinc-400 ml-0.5">원</span>
          </div>
        </div>

        {/* 장바구니 버튼 / 품절 뱃지 */}
        {isOutOfStock ? (
          <span className="rounded bg-zinc-100 px-2.5 py-1 text-xs font-bold text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500">
            일시품절
          </span>
        ) : onAddToCart ? (
          <button
            type="button"
            onClick={() => onAddToCart(product)}
            className="rounded bg-blue-600 px-3 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-blue-700 active:scale-95 transition cursor-pointer"
          >
            담기
          </button>
        ) : (
          <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
            재고 {product.stock}개
          </span>
        )}
      </div>
    </div>
  )
}
