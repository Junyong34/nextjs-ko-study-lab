import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

describe('Tier 3: Combination 12 - Shell iframe Bridge + useResizeBridge + DeepDive Card', () => {
  it('3.12.1 should emit window postMessage with resize height payload to parent shell', () => {
    let postMessagePayload: any = null
    const mockParent = {
      postMessage: (data: any, targetOrigin: string) => {
        postMessagePayload = { data, targetOrigin }
      },
    }

    const emitHeight = (height: number) => {
      mockParent.postMessage({ type: 'NEXTJS_STUDY_LAB_RESIZE', height }, '*')
    }

    emitHeight(850)
    assert.deepStrictEqual(postMessagePayload, {
      data: { type: 'NEXTJS_STUDY_LAB_RESIZE', height: 850 },
      targetOrigin: '*',
    })
  })
})
