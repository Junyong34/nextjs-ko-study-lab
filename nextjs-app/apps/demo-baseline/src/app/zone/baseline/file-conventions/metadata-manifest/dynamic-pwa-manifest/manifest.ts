import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Next.js 스터디 랩 쇼핑몰 (PWA)',
    short_name: '스터디몰',
    description: 'Next.js 16 App Router 기반 고성능 이커머스 학습용 PWA',
    start_url: '/zone/baseline/file-conventions/metadata-manifest/dynamic-pwa-manifest',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#2563eb',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
