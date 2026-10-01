import { notFound } from 'next/navigation'
import { TenantStorefront } from '../components/TenantStorefront'
import { getTenant } from '../lib/tenants'

export default async function TenantPage({ params }: { params: Promise<{ tenant: string }> }) {
  const tenant = getTenant((await params).tenant)
  if (!tenant) notFound()
  return <TenantStorefront tenant={tenant} />
}
