import { CalculatorPage } from '@/pages/calculator/ui/calculator-page'

export type DomainTab = 'purlin' | 'column' | 'summary'

export function App() {
  return <CalculatorPage initialDomain="column" />
}
