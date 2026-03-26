import type { EnclosingClassKey } from './enclosing-reference.generated'

export interface EnclosingSpecificationRow {
  key: string
  classKey: EnclosingClassKey
  classLabel: string
  panelType: string
  mark: string
  workingWidthMm: string
  unit: string
  thicknessMm: number
  standard: string
  densityKgPerM3: number
  areaM2: number
  unitPriceRubPerM2: number
  totalRub: number
}

export interface EnclosingFastenerMetalSelection {
  requestedThicknessMm: number
  resolvedThicknessMm: number
  lengthMm: number
}

export interface EnclosingCalculationResult {
  snapshot: {
    sourceWorkbook: string
    sourceSheets: readonly string[]
    status: 'in-progress' | 'parity-verified'
    note: string
  }
  geometry: {
    wallAreaGrossM2: number
    wallAreaNetM2: number
    roofAreaM2: number
    openingsAreaM2: number
  }
  specificationRows: EnclosingSpecificationRow[]
  totals: {
    class1Rub: number
    class2Rub: number
  }
  fasteners: {
    metal: {
      source: string
      wallZLock: EnclosingFastenerMetalSelection
      roofK: EnclosingFastenerMetalSelection
    }
  }
  accessories: {
    flatSheetMultiplier: number
    formula: string
  }
  notes: string[]
}
