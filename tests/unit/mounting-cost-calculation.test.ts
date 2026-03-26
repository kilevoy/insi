import { calculateMountingCost } from '@/domain/mounting-cost/model/calculate-mounting-cost'

function buildBaseInput() {
  return {
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
    regionForMountingCost: 'sverdlovsk-tyumen' as const,
    floorType: 'slab-150' as const,
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
  }
}

describe('mounting cost calculation', () => {
  it('calculates deterministic total for base enabled sections', () => {
    const result = calculateMountingCost(buildBaseInput())

    expect(result.sections).toHaveLength(8)
    const metalSection = result.sections.find((section) => section.key === 'section-6-metal')
    expect(metalSection?.items.length).toBe(2)
    expect(result.subtotalRub).toBeGreaterThan(0)
    expect(result.totalRub).toBeGreaterThan(result.subtotalRub)
  })

  it('can include all optional sections', () => {
    const result = calculateMountingCost({
      ...buildBaseInput(),
      includeOpenings: true,
      includeAdditionalWorks: true,
      hasWaterSupply: true,
      hasSewerage: true,
      hasHeating: true,
      hasElectricalWorks: true,
      roofFenceLengthM: 120,
      snowGuardLengthM: 95,
      drainageLengthM: 110,
      doubleDoorAreaM2: 12,
      singleDoorCount: 4,
      entranceBlockAreaM2: 8,
      tambourDoorAreaM2: 6,
      windowsAreaM2: 120,
      gatesAreaM2: 35,
      additionalWorksVolumeM3: 15,
    })

    expect(result.sections.length).toBeGreaterThanOrEqual(13)
    expect(result.sections.some((section) => section.key === 'section-9-openings')).toBe(true)
    expect(result.sections.some((section) => section.key === 'section-10-water-sewer')).toBe(true)
    expect(result.sections.some((section) => section.key === 'section-11-heating')).toBe(true)
    expect(result.sections.some((section) => section.key === 'section-12-electrical')).toBe(true)
    expect(result.sections.some((section) => section.key === 'section-13-additional-works')).toBe(true)
  })
})
