import fs from 'fs'
import path from 'path'
import { remainingPhase2And3Demos } from './generate-all-phase2-3-demos'

const BASE_DIR = '/Users/devpark/workspace/devpark/nextjs-ko-study-lab-phase-1/nextjs-app'
const DEMOS_YAML = path.join(BASE_DIR, 'packages/demos/demos.yaml')

// Existing 40 demos from before
const existingYaml = fs.readFileSync(DEMOS_YAML, 'utf-8')

let newEntries = ''

for (const demo of remainingPhase2And3Demos) {
  if (!existingYaml.includes(`url: ${demo.url}`)) {
    newEntries += `
- url: ${demo.url}
  title: "${demo.title}"
  doc: ${demo.doc}
  zone: ${demo.zone}
  status: done
`
  }
}

fs.appendFileSync(DEMOS_YAML, newEntries)
console.log('Successfully updated demos.yaml with all remaining Phase 2 and Phase 3 demos!')
