#!/usr/bin/env node

/**
 * Generates DS.jsx and DS.d.ts from component exports in DesignSystemContext.tsx
 * 
 * Usage: node scripts/generate-ds.js
 * 
 * This reads the DesignSystemContextValue interface to find component names,
 * then generates:
 *   - DS.jsx: Runtime wrappers that inject via context
 *   - DS.d.ts: Type declarations that re-export from source (for go-to-definition)
 */

import { readFileSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const contextsDir = join(__dirname, '../src/contexts')

const contextFile = readFileSync(join(contextsDir, 'DesignSystemContext.tsx'), 'utf-8')

// Extract component names from DesignSystemContextValue interface
const interfaceMatch = contextFile.match(/interface DesignSystemContextValue \{([^}]+)\}/)
if (!interfaceMatch) {
  console.error('Could not find DesignSystemContextValue interface')
  process.exit(1)
}

const componentLines = interfaceMatch[1].trim().split('\n')
const components = componentLines
  .map(line => line.trim())
  .filter(line => line && !line.startsWith('//'))
  .map(line => {
    const match = line.match(/^(\w+):/)
    return match ? match[1] : null
  })
  .filter(Boolean)

console.log('Found components:', components)

// Extract import sources for each component
const importMap = {}
for (const comp of components) {
  const importMatch = contextFile.match(new RegExp(`import \\{ ${comp}[^}]* \\} from '([^']+)'`))
  if (importMatch) {
    importMap[comp] = importMatch[1]
  }
}

// Generate DS.jsx
const jsxContent = `// AUTO-GENERATED - DO NOT EDIT
// Run: node scripts/generate-ds.js

import { useDesignSystem } from './DesignSystemContext'

${components.map(comp => `export function ${comp}(props) {
  const ds = useDesignSystem()
  return <ds.${comp} {...props} />
}`).join('\n\n')}
`

// Generate DS.d.ts
const dtsContent = `// AUTO-GENERATED - DO NOT EDIT
// Run: node scripts/generate-ds.js

${components.map(comp => `export { ${comp} } from '${importMap[comp] || './Greeting'}'`).join('\n')}
`

writeFileSync(join(contextsDir, 'DS.jsx'), jsxContent)
writeFileSync(join(contextsDir, 'DS.d.ts'), dtsContent)

console.log('Generated DS.jsx and DS.d.ts')
