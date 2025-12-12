import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'
import { Greeting } from './Greeting'

interface DesignSystemContextValue {
  Greeting: typeof Greeting
}

const DesignSystemContext = createContext<DesignSystemContextValue | null>(null)

interface DesignSystemProviderProps {
  children: ReactNode
}

export function DesignSystemProvider({ children }: DesignSystemProviderProps) {
  const value: DesignSystemContextValue = {
    Greeting,
  }

  return (
    <DesignSystemContext.Provider value={value}>
      {children}
    </DesignSystemContext.Provider>
  )
}

export function useDesignSystem() {
  const context = useContext(DesignSystemContext)
  if (!context) {
    throw new Error('useDesignSystem must be used within a DesignSystemProvider')
  }
  return context
}

export { DesignSystemContext }
