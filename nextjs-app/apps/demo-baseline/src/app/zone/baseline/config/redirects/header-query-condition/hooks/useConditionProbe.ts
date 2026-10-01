'use client'
import { useRef, useState, useTransition } from 'react'
import { probeConditionAction } from '../actions'
import { judge } from '../lib/judge'
import { applyPreset, type PresetMode } from '../lib/presets'
import { EMPTY_INPUT } from '../lib/request'
import type { ConditionRuleId, ProbeEntry, ProbeInput } from '../types'

const MAX_HISTORY = 8

export function useConditionProbe() {
  const [input, setInput] = useState<ProbeInput>(EMPTY_INPUT)
  const [history, setHistory] = useState<ProbeEntry[]>([])
  const [isPending, startTransition] = useTransition()
  const seq = useRef(0)

  const update = <K extends keyof ProbeInput>(key: K, value: ProbeInput[K]) => setInput((prev) => ({ ...prev, [key]: value }))
  const selectRule = (rule: ConditionRuleId) => setInput({ ...EMPTY_INPUT, rule })
  const preset = (mode: PresetMode) => setInput((prev) => applyPreset(prev.rule, mode))

  const send = () => {
    const snapshot = input
    startTransition(async () => {
      const outcome = await probeConditionAction(snapshot)
      const entry: ProbeEntry = { id: ++seq.current, input: snapshot, outcome, verdict: judge(outcome) }
      setHistory((prev) => [entry, ...prev].slice(0, MAX_HISTORY))
    })
  }

  const reset = () => {
    setInput(EMPTY_INPUT)
    setHistory([])
  }

  return { input, history, isPending, update, selectRule, preset, send, reset }
}
