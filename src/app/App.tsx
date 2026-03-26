import { CalculatorPage } from '@/pages/calculator/ui/calculator-page'

export type DomainTab = 'purlin' | 'column' | 'summary' | 'enclosing' | 'mounting' | 'methodology'

export function App() {
  return <CalculatorPage initialDomain="column" />
}
