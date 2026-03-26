import { calculateColumn } from '@/domain/column/model/calculate-column'
import { defaultColumnInput } from '@/domain/column/model/column-input'
import { calculateMountingCost } from '@/domain/mounting-cost/model/calculate-mounting-cost'
import { calculatePurlin } from '@/domain/purlin/model/calculate-purlin'
import { defaultPurlinInput } from '@/domain/purlin/model/purlin-input'

describe('domain contracts', () => {
  it('returns a purlin workbook-derived snapshot', { timeout: 20000 }, () => {
    const result = calculatePurlin(defaultPurlinInput)

    expect(result.snapshot.sourceWorkbook).toBe('calculator_final_release.xlsx')
    expect(result.derivedContext.windLoadKpa).toBe(0.3)
    expect(result.derivedContext.snowLoadKpa).toBe(1.2)
    expect(result.autoMaxStepMm).toBe(2550)
    expect(result.sortSteelTop10).toHaveLength(10)
    expect(result.sortSteelTop10[0]?.profile).toBe('пр.180х140х4')
  })

  it('returns a column scaffold snapshot', () => {
    const result = calculateColumn(defaultColumnInput)

    expect(result.snapshot.sourceWorkbook).toBe('column_calculator_final_release.xlsx')
    expect(result.snapshot.status).toBe('in-progress')
    expect(result.derivedContext.windLoadKpa).toBe(0.3)
    expect(result.derivedContext.snowLoadKpa).toBe(2.45)
    expect(result.topCandidates.length).toBeGreaterThanOrEqual(1)
    expect((result.topCandidates[0]?.estimatedCostRub ?? Number.POSITIVE_INFINITY)).toBeLessThanOrEqual(
      result.topCandidates[1]?.estimatedCostRub ?? Number.POSITIVE_INFINITY,
    )
    expect(result.topCandidatesByType.extreme.length).toBeGreaterThanOrEqual(1)
    expect(result.specification.groups).toHaveLength(3)
    expect(result.specification.totalMassKg).toBeGreaterThan(0)
  })

  it('returns an expanded mounting snapshot', () => {
    const result = calculateMountingCost({
      city: 'Екатеринбург',
      responsibilityLevel: '1',
      roofType: 'двускатная',
      spanM: 24,
      buildingLengthM: 60,
      buildingHeightM: 10,
      roofSlopeDeg: 6,
      frameStepM: 6,
      fakhverkStepM: 6,
      terrainType: 'В',
      iBeamS255PriceRubPerKg: 148.8,
      iBeamS355PriceRubPerKg: 155.88,
      tubeS245PriceRubPerKg: 130.2,
      tubeS345PriceRubPerKg: 141,
      channelS245PriceRubPerKg: 170,
      channelS345PriceRubPerKg: 180,
      lstkMp350PriceRubPerKg: 170,
      lstkMp390PriceRubPerKg: 170,
      regionForMountingCost: 'sverdlovsk-tyumen',
      floorType: 'slab-150',
      includeGeology: true,
      includeProject: true,
      includeEarthworks: true,
      includeConcrete: true,
      includeFloors: true,
      includeMetal: true,
      includeWalls: true,
      includeRoof: true,
      includeOpenings: false,
      includeAdditionalWorks: false,
      hasWaterSupply: false,
      hasSewerage: false,
      hasHeating: false,
      hasElectricalWorks: false,
      buildingAreaM2: 1440,
      wallAreaM2: 1900,
      roofAreaM2: 1500,
      roofFenceLengthM: 0,
      snowGuardLengthM: 0,
      drainageLengthM: 0,
      doubleDoorAreaM2: 0,
      singleDoorCount: 0,
      entranceBlockAreaM2: 0,
      tambourDoorAreaM2: 0,
      windowsAreaM2: 0,
      gatesAreaM2: 0,
      additionalWorksVolumeM3: 0,
      lstkStructuresTotalMassKg: 4000,
      blackStructuresTotalMassKg: 20000,
      columnTotalMassKg: 15000,
      purlinTotalMassKg: 9000,
      metalStructuresTotalMassKg: 24000,
    })

    expect(result.snapshot.sourceWorkbook).toBe('Матрица 2026 СМР.xlsx')
    expect(result.sections).toHaveLength(8)
    expect(result.sections[0]?.items.length).toBeGreaterThanOrEqual(1)
    expect(result.totalRub).toBeGreaterThan(result.subtotalRub)
  })
})
