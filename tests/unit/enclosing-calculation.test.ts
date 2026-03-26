import { calculateEnclosing } from '@/domain/enclosing/model/calculate-enclosing'
import { mapUnifiedInputToEnclosingInput } from '@/domain/enclosing/model/enclosing-mapper'

describe('enclosing calculation', () => {
  it('calculates geometry and panel totals for both classes', () => {
    const result = calculateEnclosing({
      roofType: 'двускатная',
      spanM: 24,
      buildingLengthM: 60,
      buildingHeightM: 10,
      roofSlopeDeg: 6,
      wallPanelThicknessMm: 100,
      roofPanelThicknessMm: 150,
      openingsAreaM2: 189,
    })

    expect(result.geometry.wallAreaGrossM2).toBeCloseTo(1710.27, 2)
    expect(result.geometry.wallAreaNetM2).toBeCloseTo(1521.27, 2)
    expect(result.geometry.roofAreaM2).toBeCloseTo(1447.93, 2)

    expect(result.specificationRows).toHaveLength(4)
    expect(result.specificationRows[0]?.panelType).toContain('Стеновая')
    expect(result.specificationRows[0]?.mark).toBe('МП ТСП-Z')
    expect(result.specificationRows[0]?.workingWidthMm).toBe('1000 / 1160 / 1190')
    expect(result.specificationRows[0]?.unit).toBe('м2')
    expect(result.specificationRows[0]?.unitPriceRubPerM2).toBe(3905)
    expect(result.specificationRows[0]?.totalRub).toBe(5940559)
    expect(result.specificationRows[1]?.unitPriceRubPerM2).toBe(4705)
    expect(result.specificationRows[1]?.totalRub).toBe(6812520)

    expect(result.totals.class1Rub).toBe(12753079)
    expect(result.totals.class2Rub).toBe(11117912)

    expect(result.fasteners.metal.wallZLock.lengthMm).toBe(140)
    expect(result.fasteners.metal.roofK.lengthMm).toBe(240)
    expect((result.fasteners as Record<string, unknown>).concrete).toBeUndefined()
  })

  it('maps unified input to enclosing input and resolves openings area', () => {
    const mapped = mapUnifiedInputToEnclosingInput({
      roofType: 'двускатная',
      spanM: 24,
      buildingLengthM: 60,
      buildingHeightM: 10,
      roofSlopeDeg: 6,
      wallCoveringType: 'С-П 120 мм',
      roofCoveringType: 'С-П 170 мм',
      doubleDoorAreaM2: 12,
      singleDoorCount: 4,
      entranceBlockAreaM2: 8,
      tambourDoorAreaM2: 6,
      windowsAreaM2: 120,
      gatesAreaM2: 35,
    })

    expect(mapped.wallPanelThicknessMm).toBe(120)
    expect(mapped.roofPanelThicknessMm).toBe(170)
    expect(mapped.openingsAreaM2).toBe(189)
  })

  it('falls back to nearest available class-2 roof thickness when exact value is not priced', () => {
    const result = calculateEnclosing({
      roofType: 'двускатная',
      spanM: 24,
      buildingLengthM: 60,
      buildingHeightM: 10,
      roofSlopeDeg: 6,
      wallPanelThicknessMm: 100,
      roofPanelThicknessMm: 60,
      openingsAreaM2: 0,
    })

    const class2RoofRow = result.specificationRows.find((row) => row.key === 'class-2-tu-roof-k')
    expect(class2RoofRow?.thicknessMm).toBe(80)
    expect(result.notes.some((note) => note.includes('80'))).toBe(true)
  })

  it('supports unified input versions without opening fields', () => {
    const mapped = mapUnifiedInputToEnclosingInput({
      roofType: 'двускатная',
      spanM: 24,
      buildingLengthM: 60,
      buildingHeightM: 10,
      roofSlopeDeg: 6,
      wallCoveringType: 'С-П 100 мм',
      roofCoveringType: 'С-П 150 мм',
    })

    expect(mapped.openingsAreaM2).toBe(0)
    expect(mapped.wallPanelThicknessMm).toBe(100)
    expect(mapped.roofPanelThicknessMm).toBe(150)
  })
})
