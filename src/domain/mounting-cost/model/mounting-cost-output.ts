export interface MountingCostSectionItem {
  code: string
  title: string
  unit: string
  quantity: number
  unitPriceRub: number
  totalRub: number
  basis: string
}

export interface MountingCostSection {
  key: string
  title: string
  subtotalRub: number
  items: MountingCostSectionItem[]
}

export type MountingSnapshotStatus = 'scaffolded' | 'in-progress' | 'parity-verified'

export interface MountingCostCalculationResult {
  snapshot: {
    sourceWorkbook: string
    sourceSheets: readonly string[]
    status: MountingSnapshotStatus
    note: string
  }
  sections: MountingCostSection[]
  subtotalRub: number
  regionCoefficient: number
  totalRub: number
  note?: string
}
