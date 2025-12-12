// AUTO-GENERATED - DO NOT EDIT
// Run: node scripts/generate-ds.js

import { useDesignSystem } from './DesignSystemContext'

export function Greeting(props) {
  const ds = useDesignSystem()
  return <ds.Greeting {...props} />
}
