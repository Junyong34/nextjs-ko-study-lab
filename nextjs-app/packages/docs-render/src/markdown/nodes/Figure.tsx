import React from 'react'

export interface FigureProps {
  src: string
  alt: string
}

/** 한 줄을 통째로 차지하는 이미지. alt가 있으면 캡션으로도 쓴다. */
export function Figure({ src, alt }: FigureProps) {
  return (
    <figure className="my-6">
      <img
        src={src}
        alt={alt}
        className="w-full max-w-3xl mx-auto rounded-xl border border-zinc-200/80 shadow-xs dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900"
        loading="lazy"
      />
      {alt && (
        <figcaption className="mt-2.5 text-center text-xs text-zinc-500 dark:text-zinc-400">
          {alt}
        </figcaption>
      )}
    </figure>
  )
}
