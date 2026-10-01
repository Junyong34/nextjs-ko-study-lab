import React from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { TENANTS, getTenant } from '../lib/tenants'

/** 등록된 테넌트는 빌드 때 미리 만들고, 그 밖의 값은 아래 getTenant 검사에서 404 가 된다. */
export function generateStaticParams() {
  return TENANTS.map((t) => ({ tenant: t.id }))
}

/** 테넌트마다 다른 <title>. 루트 layout 의 title.template 이 뒤에 붙는다. */
export async function generateMetadata({ params }: { params: Promise<{ tenant: string }> }): Promise<Metadata> {
  const tenant = getTenant((await params).tenant)
  return tenant ? { title: `${tenant.name} 브랜딩` } : {}
}

/** 테넌트 설정을 조회해 CSS 변수로 주입하는 래퍼. 이 요소 바깥에는 값이 새지 않는다. */
export default async function TenantLayout({ children, params }: { children: React.ReactNode; params: Promise<{ tenant: string }> }) {
  const tenant = getTenant((await params).tenant)
  if (!tenant) notFound()

  return (
    <div
      data-tenant-root
      data-tenant={tenant.id}
      className="rounded-md border border-zinc-200 p-3 dark:border-zinc-800"
      style={{ '--brand-primary': tenant.primary, '--brand-accent': tenant.accent } as React.CSSProperties}
    >
      {children}
    </div>
  )
}
