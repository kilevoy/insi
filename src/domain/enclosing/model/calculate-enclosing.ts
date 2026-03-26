import { enclosingInputSchema, type EnclosingInput } from './enclosing-input'
import type {
  EnclosingCalculationResult,
  EnclosingFastenerMetalSelection,
  EnclosingSpecificationRow,
} from './enclosing-output'
import {
  ENCLOSING_CLASS_KEYS,
  enclosingAccessoriesReference,
  enclosingFastenerReference,
  enclosingPanelPriceRubPerM2,
} from './enclosing-reference.generated'

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180
}

function roundRub(value: number): number {
  return Math.round(value)
}

function normalizeText(value: string): string {
  return value.trim().toLowerCase()
}

function isGableRoof(roofType: string): boolean {
  const normalized = normalizeText(roofType)
  return normalized.includes('двуск') || normalized.includes('gable')
}

function resolveRoofAreaM2(input: EnclosingInput): number {
  const angleRad = toRadians(input.roofSlopeDeg)
  const cosine = Math.max(Math.cos(angleRad), 0.2)
  return (input.spanM * input.buildingLengthM) / cosine
}

function resolveWallAreaGrossM2(input: EnclosingInput): number {
  const perimeterArea = 2 * (input.spanM + input.buildingLengthM) * input.buildingHeightM
  if (!isGableRoof(input.roofType)) {
    return perimeterArea
  }

  const riseM = (input.spanM / 2) * Math.tan(toRadians(input.roofSlopeDeg))
  return perimeterArea + input.spanM * riseM
}

function resolveNearestThickness(availableThicknesses: number[], requestedThicknessMm: number): number {
  return availableThicknesses
    .slice()
    .sort((left, right) => left - right)
    .reduce((best, current) => {
      const bestDelta = Math.abs(best - requestedThicknessMm)
      const currentDelta = Math.abs(current - requestedThicknessMm)
      if (currentDelta < bestDelta) {
        return current
      }
      if (currentDelta === bestDelta) {
        return Math.min(best, current)
      }
      return best
    })
}

function resolvePricedThickness(
  table: Record<number, number>,
  requestedThicknessMm: number,
): { requestedThicknessMm: number; resolvedThicknessMm: number; unitPriceRubPerM2: number } {
  const thicknesses = Object.keys(table).map(Number)
  const resolvedThicknessMm = table[requestedThicknessMm]
    ? requestedThicknessMm
    : resolveNearestThickness(thicknesses, requestedThicknessMm)

  return {
    requestedThicknessMm,
    resolvedThicknessMm,
    unitPriceRubPerM2: table[resolvedThicknessMm] ?? table[thicknesses[0] ?? 0] ?? 0,
  }
}

function resolveFastenerMetal(
  table: Record<number, number>,
  requestedThicknessMm: number,
): EnclosingFastenerMetalSelection {
  const thicknesses = Object.keys(table).map(Number)
  const resolvedThicknessMm = table[requestedThicknessMm]
    ? requestedThicknessMm
    : resolveNearestThickness(thicknesses, requestedThicknessMm)

  return {
    requestedThicknessMm,
    resolvedThicknessMm,
    lengthMm: table[resolvedThicknessMm] ?? 0,
  }
}

function buildSpecificationRows(
  requestedWallThicknessMm: number,
  requestedRoofThicknessMm: number,
  wallAreaNetM2: number,
  roofAreaM2: number,
): { rows: EnclosingSpecificationRow[]; notes: string[] } {
  const rows: EnclosingSpecificationRow[] = []
  const notes: string[] = []

  for (const classKey of ENCLOSING_CLASS_KEYS) {
    const catalog = enclosingPanelPriceRubPerM2[classKey]
    const wall = resolvePricedThickness(catalog.wallZLock, requestedWallThicknessMm)
    const roof = resolvePricedThickness(catalog.roofK, requestedRoofThicknessMm)

    const classLabel = classKey === 'class-1-gost' ? 'Класс 1' : 'Класс 2'
    const wallStandard = classKey === 'class-1-gost' ? 'ГОСТ 32603-2021, класс 1' : 'ГОСТ 32603-2021, класс 2'
    const roofStandard =
      classKey === 'class-1-gost' ? 'ГОСТ 32603-2021, класс 1' : 'ТУ 5284-001-37144780-2012'
    const densityKgPerM3 = classKey === 'class-1-gost' ? 105 : 95

    if (wall.requestedThicknessMm !== wall.resolvedThicknessMm) {
      notes.push(
        `Для ${classLabel.toLowerCase()} стеновая толщина ${wall.requestedThicknessMm} мм заменена на ближайшую ${wall.resolvedThicknessMm} мм.`,
      )
    }
    if (roof.requestedThicknessMm !== roof.resolvedThicknessMm) {
      notes.push(
        `Для ${classLabel.toLowerCase()} кровельная толщина ${roof.requestedThicknessMm} мм заменена на ближайшую ${roof.resolvedThicknessMm} мм.`,
      )
    }

    rows.push({
      key: `${classKey}-wall-zlock`,
      classKey,
      classLabel,
      panelType: 'Стеновая трехслойная сэндвич-панель с видимым креплением Z-Lock',
      mark: 'МП ТСП-Z',
      workingWidthMm: '1000 / 1160 / 1190',
      unit: 'м2',
      thicknessMm: wall.resolvedThicknessMm,
      standard: wallStandard,
      densityKgPerM3,
      areaM2: wallAreaNetM2,
      unitPriceRubPerM2: wall.unitPriceRubPerM2,
      totalRub: roundRub(wallAreaNetM2 * wall.unitPriceRubPerM2),
    })

    rows.push({
      key: `${classKey}-roof-k`,
      classKey,
      classLabel,
      panelType: 'Кровельная трехслойная сэндвич-панель',
      mark: 'МП ТСП-К',
      workingWidthMm: '1000',
      unit: 'м2',
      thicknessMm: roof.resolvedThicknessMm,
      standard: roofStandard,
      densityKgPerM3,
      areaM2: roofAreaM2,
      unitPriceRubPerM2: roof.unitPriceRubPerM2,
      totalRub: roundRub(roofAreaM2 * roof.unitPriceRubPerM2),
    })
  }

  return { rows, notes }
}

export function calculateEnclosing(rawInput: EnclosingInput): EnclosingCalculationResult {
  const input = enclosingInputSchema.parse(rawInput)

  const wallAreaGrossM2 = resolveWallAreaGrossM2(input)
  const roofAreaM2 = resolveRoofAreaM2(input)
  const openingsAreaM2 = Math.max(0, input.openingsAreaM2)
  const wallAreaNetM2 = Math.max(0, wallAreaGrossM2 - openingsAreaM2)

  const { rows: specificationRows, notes } = buildSpecificationRows(
    input.wallPanelThicknessMm,
    input.roofPanelThicknessMm,
    wallAreaNetM2,
    roofAreaM2,
  )

  const class1Rub = specificationRows
    .filter((row) => row.classKey === 'class-1-gost')
    .reduce((sum, row) => sum + row.totalRub, 0)
  const class2Rub = specificationRows
    .filter((row) => row.classKey === 'class-2-tu')
    .reduce((sum, row) => sum + row.totalRub, 0)

  const metalWall = resolveFastenerMetal(
    enclosingFastenerReference.metalHarpoonToSteelUpTo12_5mm.wallZLockLengthMmByThickness,
    input.wallPanelThicknessMm,
  )
  const metalRoof = resolveFastenerMetal(
    enclosingFastenerReference.metalHarpoonToSteelUpTo12_5mm.roofKLengthMmByThickness,
    input.roofPanelThicknessMm,
  )

  if (metalWall.requestedThicknessMm !== metalWall.resolvedThicknessMm) {
    notes.push(
      `Для крепежа по металлу стен использована ближайшая толщина ${metalWall.resolvedThicknessMm} мм вместо ${metalWall.requestedThicknessMm} мм.`,
    )
  }
  if (metalRoof.requestedThicknessMm !== metalRoof.resolvedThicknessMm) {
    notes.push(
      `Для крепежа по металлу кровли использована ближайшая толщина ${metalRoof.resolvedThicknessMm} мм вместо ${metalRoof.requestedThicknessMm} мм.`,
    )
  }

  return {
    snapshot: {
      sourceWorkbook: 'Прайс-лист №12.1 40 55 (14.08.2025), стр. 28',
      sourceSheets: ['Панели МВ (класс 1/класс 2)', 'Метизы (табл. 18 техкаталога 22.07.2025)'],
      status: 'in-progress',
      note: 'SECRET FIX исключен из расчета в соответствии с заданием.',
    },
    geometry: {
      wallAreaGrossM2,
      wallAreaNetM2,
      roofAreaM2,
      openingsAreaM2,
    },
    specificationRows,
    totals: {
      class1Rub,
      class2Rub,
    },
    fasteners: {
      metal: {
        source: 'Harpoon, табл. 18: крепление к подконструкциям до 12.5 мм',
        wallZLock: metalWall,
        roofK: metalRoof,
      },
    },
    accessories: {
      flatSheetMultiplier: enclosingAccessoriesReference.flatSheetMultiplier,
      formula: enclosingAccessoriesReference.formula,
    },
    notes,
  }
}
