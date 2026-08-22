import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getAllFiles, NEXTJS_APP_ROOT, REPO_ROOT } from '../utils/test-helpers.ts'

export interface StaticMatchedOccurrence {
  filePath: string
  relativeFilePath: string
  lineNumber: number
  lineContent: string
}

export interface AuditStaticMatchedResult {
  totalFilesScanned: number
  cleanFilesCount: number
  flaggedFilesCount: number
  totalOccurrences: number
  occurrences: StaticMatchedOccurrence[]
  flaggedFiles: string[]
}

export function runStaticMatchedAudit(): AuditStaticMatchedResult {
  const targetDirs = [
    path.join(NEXTJS_APP_ROOT, 'apps/demo-baseline/src/app/zone/baseline'),
    path.join(NEXTJS_APP_ROOT, 'apps/demo-cache-components/src/app/zone/cache'),
  ]

  const candidateFiles: string[] = []
  for (const dir of targetDirs) {
    if (fs.existsSync(dir)) {
      const allFiles = getAllFiles(dir, ['.tsx', '.ts', '.jsx', '.js'])
      const footerFiles = allFiles.filter((f) => path.basename(f) === 'VerificationFooter.tsx')
      candidateFiles.push(...footerFiles)
    }
  }

  const occurrences: StaticMatchedOccurrence[] = []
  const flaggedFilesSet = new Set<string>()

  // Regex pattern matching hardcoded isMatched={true} or isMatched: true
  const staticMatchedRegex = /isMatched\s*=\s*\{\s*true\s*\}|isMatched\s*:\s*true/g

  for (const file of candidateFiles) {
    const content = fs.readFileSync(file, 'utf-8')
    const lines = content.split(/\r?\n/)
    let hasFlag = false

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      if (staticMatchedRegex.test(line)) {
        staticMatchedRegex.lastIndex = 0
        hasFlag = true
        occurrences.push({
          filePath: file,
          relativeFilePath: path.relative(REPO_ROOT, file),
          lineNumber: i + 1,
          lineContent: line.trim(),
        })
      }
    }

    if (hasFlag) {
      flaggedFilesSet.add(file)
    }
  }

  const flaggedFiles = Array.from(flaggedFilesSet)
  return {
    totalFilesScanned: candidateFiles.length,
    cleanFilesCount: candidateFiles.length - flaggedFiles.length,
    flaggedFilesCount: flaggedFiles.length,
    totalOccurrences: occurrences.length,
    occurrences,
    flaggedFiles,
  }
}

// Direct CLI execution
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const isStrict = process.argv.includes('--strict')
  console.log(`\n============================================================`)
  console.log(`  Static isMatched={true} Literal Audit Runner`)
  console.log(`============================================================`)
  
  const result = runStaticMatchedAudit()
  
  console.log(`\n[Audit Metrics]`)
  console.log(`- Total VerificationFooter.tsx files scanned: ${result.totalFilesScanned}`)
  console.log(`- Clean (Dynamic / Non-literal) files:        ${result.cleanFilesCount}`)
  console.log(`- Flagged (Static isMatched={true}) files:    ${result.flaggedFilesCount}`)
  console.log(`- Total static occurrences:                  ${result.totalOccurrences}`)
  
  if (result.flaggedFilesCount > 0) {
    console.log(`\n[Sample Flagged Files (first 10)]`)
    for (const occ of result.occurrences.slice(0, 10)) {
      console.log(`  - ${occ.relativeFilePath}:${occ.lineNumber} -> ${occ.lineContent}`)
    }
    if (result.occurrences.length > 10) {
      console.log(`  ... and ${result.occurrences.length - 10} more occurrences.`)
    }
  }

  if (isStrict && result.flaggedFilesCount > 0) {
    console.error(`\n❌ [STRICT FAILURE] ${result.flaggedFilesCount} files contain hardcoded isMatched={true} literals.`)
    process.exit(1)
  } else {
    console.log(`\n✅ Static isMatched audit run complete. (Mode: ${isStrict ? 'Strict' : 'Audit Report'})`)
    process.exit(0)
  }
}
