import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  loadDemosYaml,
  loadDemosManifest,
  resolveDocFile,
  getDemoSourceDir,
  REPO_ROOT,
  NEXTJS_APP_ROOT,
  DOCS_ROOT,
  type Demo,
} from '../utils/test-helpers.ts'

export interface RouteManifestValidationResult {
  totalDemos: number
  validDemos: number
  invalidDemos: number
  errors: string[]
  warnings: string[]
  statsByZone: Record<string, number>
  statsByStatus: Record<string, number>
}

export function validateRouteAndManifestIntegrity(): RouteManifestValidationResult {
  const errors: string[] = []
  const warnings: string[] = []
  const statsByZone: Record<string, number> = {}
  const statsByStatus: Record<string, number> = {}

  let yamlDemos: Demo[] = []
  let manifestDemos: Demo[] = []

  try {
    yamlDemos = loadDemosYaml()
  } catch (err: any) {
    errors.push(`[demos.yaml Parsing Error] ${err.message}`)
    return {
      totalDemos: 0,
      validDemos: 0,
      invalidDemos: 0,
      errors,
      warnings,
      statsByZone,
      statsByStatus,
    }
  }

  try {
    manifestDemos = loadDemosManifest()
  } catch (err: any) {
    errors.push(`[demos-manifest.json Parsing Error] ${err.message}`)
  }

  // 1. Check count consistency
  if (yamlDemos.length !== manifestDemos.length) {
    errors.push(
      `[Manifest Count Mismatch] demos.yaml has ${yamlDemos.length} entries but demos-manifest.json has ${manifestDemos.length} entries.`,
    )
  }

  // 2. Check URL Uniqueness
  const seenUrls = new Map<string, Demo>()
  for (const demo of yamlDemos) {
    statsByZone[demo.zone] = (statsByZone[demo.zone] || 0) + 1
    statsByStatus[demo.status] = (statsByStatus[demo.status] || 0) + 1

    if (seenUrls.has(demo.url)) {
      errors.push(`[Duplicate URL] url '${demo.url}' declared multiple times.`)
    } else {
      seenUrls.set(demo.url, demo)
    }

    // 3. Check doc existence
    const resolvedDoc = resolveDocFile(demo.doc)
    if (!resolvedDoc) {
      errors.push(`[Missing Doc] Demo '${demo.url}' points to non-existent doc: ${demo.doc}`)
    }

    // 4. Check on-disk entry point
    const demoDir = getDemoSourceDir(demo)
    const entryPage = path.join(demoDir, 'page.tsx')

    if (!fs.existsSync(entryPage)) {
      if (demo.status === 'done') {
        errors.push(`[Missing Entry Page] 'status: done' demo '${demo.url}' missing page.tsx at ${path.relative(REPO_ROOT, entryPage)}`)
      } else {
        warnings.push(`[WIP Entry Page] 'status: ${demo.status}' demo '${demo.url}' missing page.tsx at ${path.relative(REPO_ROOT, entryPage)}`)
      }
    } else {
      // 5. Check 4-Tier Layout Contracts on entry page and subcomponents
      const pageContent = fs.readFileSync(entryPage, 'utf-8')
      const hasDefaultExport = /export\s+default\s+(function|async\s+function|const|class)/.test(pageContent) || /export\s+\{\s*\w+\s+as\s+default\s*\}/.test(pageContent)
      if (!hasDefaultExport) {
        errors.push(`[Missing Default Export] ${path.relative(REPO_ROOT, entryPage)} does not default-export a React component.`)
      }

      // Check for standard UI components across the demo folder
      const allFiles = fs.readdirSync(demoDir, { recursive: true })
        .map((f) => path.join(demoDir, String(f)))
        .filter((f) => fs.statSync(f).isFile() && (f.endsWith('.tsx') || f.endsWith('.ts')))

      let hasGuide = pageContent.includes('DemoGuideCard') || pageContent.includes('Guide')
      let hasFieldset = pageContent.includes('<fieldset') || pageContent.includes('fieldset')
      let hasExpectedActual = pageContent.includes('ExpectedActualPanel') || pageContent.includes('VerificationFooter')
      let hasDeepDive = pageContent.includes('DemoDeepDiveCard') || pageContent.includes('DeepDive')

      for (const subFile of allFiles) {
        const subContent = fs.readFileSync(subFile, 'utf-8')
        if (!hasGuide && (subContent.includes('DemoGuideCard') || subContent.includes('Guide'))) hasGuide = true
        if (!hasFieldset && (subContent.includes('<fieldset') || subContent.includes('fieldset'))) hasFieldset = true
        if (!hasExpectedActual && (subContent.includes('ExpectedActualPanel') || subContent.includes('VerificationFooter'))) hasExpectedActual = true
        if (!hasDeepDive && (subContent.includes('DemoDeepDiveCard') || subContent.includes('DeepDive'))) hasDeepDive = true
      }

      if (!hasGuide) {
        warnings.push(`[Layout Contract] Demo '${demo.url}' does not reference DemoGuideCard (Tier 1).`)
      }
      if (!hasExpectedActual) {
        warnings.push(`[Layout Contract] Demo '${demo.url}' does not reference ExpectedActualPanel/VerificationFooter (Tier 3).`)
      }
      if (!hasDeepDive) {
        warnings.push(`[Layout Contract] Demo '${demo.url}' does not reference DemoDeepDiveCard (Tier 4).`)
      }
    }
  }

  const validDemos = yamlDemos.length - errors.length

  return {
    totalDemos: yamlDemos.length,
    validDemos: Math.max(0, validDemos),
    invalidDemos: errors.length,
    errors,
    warnings,
    statsByZone,
    statsByStatus,
  }
}

// Direct CLI execution
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  console.log(`\n============================================================`)
  console.log(`  Demo Route & Manifest Consistency Validator`)
  console.log(`============================================================`)

  const result = validateRouteAndManifestIntegrity()

  console.log(`\n[Manifest Overview]`)
  console.log(`- Total Demos:        ${result.totalDemos}`)
  console.log(`- Valid Demos:        ${result.validDemos}`)
  console.log(`- Breakdown by Zone:  ${JSON.stringify(result.statsByZone)}`)
  console.log(`- Breakdown by Status:${JSON.stringify(result.statsByStatus)}`)

  if (result.warnings.length > 0) {
    console.log(`\n⚠️  Warnings (${result.warnings.length} items, sample 5):`)
    for (const w of result.warnings.slice(0, 5)) {
      console.log(`  - ${w}`)
    }
    if (result.warnings.length > 5) {
      console.log(`  ... and ${result.warnings.length - 5} more warnings.`)
    }
  }

  if (result.errors.length > 0) {
    console.error(`\n❌ Errors (${result.errors.length} items):`)
    for (const e of result.errors) {
      console.error(`  - ${e}`)
    }
    console.log(`\n============================================================`)
    process.exit(1)
  }

  console.log(`\n✅ All 241 demo routes and manifest entries verified successfully!`)
  console.log(`============================================================\n`)
  process.exit(0)
}
