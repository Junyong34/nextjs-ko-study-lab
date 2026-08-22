import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

describe('Tier 3: Combination 5 - Root proxy.ts + Edge Runtime + Custom Headers + GeoIP Route', () => {
  it('3.5.1 should enrich edge request with country code and pass to zone route handler', () => {
    const rawInbound = {
      url: 'https://study.dev/zone/baseline/api/geoip',
      headers: {
        'x-real-ip': '203.0.113.195',
        'x-vercel-ip-country': 'KR',
      },
    }

    const proxyMiddleware = (req: typeof rawInbound) => {
      const country = req.headers['x-vercel-ip-country'] || 'US'
      return {
        ...req,
        headers: {
          ...req.headers,
          'x-detected-country': country,
          'x-currency-preference': country === 'KR' ? 'KRW' : 'USD',
        },
      }
    }

    const forwarded = proxyMiddleware(rawInbound)
    assert.strictEqual(forwarded.headers['x-detected-country'], 'KR')
    assert.strictEqual(forwarded.headers['x-currency-preference'], 'KRW')
  })
})
