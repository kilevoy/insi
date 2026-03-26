import { mountingCostInputSchema } from '@/domain/mounting-cost/model/mounting-cost-input'

const validPayload = {
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
  includeOpenings: true,
  includeAdditionalWorks: true,
  hasWaterSupply: true,
  hasSewerage: true,
  hasHeating: true,
  hasElectricalWorks: true,
  buildingAreaM2: 1440,
  wallAreaM2: 1900,
  roofAreaM2: 1500,
  roofFenceLengthM: 100,
  snowGuardLengthM: 80,
  drainageLengthM: 120,
  doubleDoorAreaM2: 12,
  singleDoorCount: 4,
  entranceBlockAreaM2: 10,
  tambourDoorAreaM2: 8,
  windowsAreaM2: 140,
  gatesAreaM2: 35,
  additionalWorksVolumeM3: 20,
  lstkStructuresTotalMassKg: 4000,
  blackStructuresTotalMassKg: 20000,
  columnTotalMassKg: 15000,
  purlinTotalMassKg: 9000,
  metalStructuresTotalMassKg: 24000,
}

describe('mounting cost input schema', () => {
  it('accepts valid full payload', () => {
    const parsed = mountingCostInputSchema.parse(validPayload)

    expect(parsed.metalStructuresTotalMassKg).toBe(24000)
    expect(parsed.includeGeology).toBe(true)
    expect(parsed.hasElectricalWorks).toBe(true)
    expect(parsed.doubleDoorAreaM2).toBe(12)
  })
})
