import type { MountingCostInput, MountingRegionKey } from './mounting-cost-input'

interface UnifiedInputLike {
  city: string
  responsibilityLevel: string
  roofType: string
  spanM: number
  buildingLengthM: number
  buildingHeightM: number
  roofSlopeDeg: number
  frameStepM: number
  fakhverkStepM: number
  terrainType: string
  floorType: 'slab-150' | 'slab-200'
  includeGeology: boolean
  includeProject: boolean
  includeEarthworks: boolean
  includeConcrete: boolean
  includeFloors: boolean
  includeMetal: boolean
  includeWalls: boolean
  includeRoof: boolean
  includeOpenings: boolean
  includeAdditionalWorks: boolean
  hasWaterSupply: boolean
  hasSewerage: boolean
  hasHeating: boolean
  hasElectricalWorks: boolean
  roofFenceLengthM: number
  snowGuardLengthM: number
  drainageLengthM: number
  doubleDoorAreaM2: number
  singleDoorCount: number
  entranceBlockAreaM2: number
  tambourDoorAreaM2: number
  windowsAreaM2: number
  gatesAreaM2: number
  additionalWorksVolumeM3: number
  snowRetentionPurlin: 'есть' | 'нет'
  barrierPurlin: 'есть' | 'нет'

  iBeamS255PriceRubPerKg: number
  iBeamS355PriceRubPerKg: number
  tubeS245PriceRubPerKg: number
  tubeS345PriceRubPerKg: number
  channelS245PriceRubPerKg: number
  channelS345PriceRubPerKg: number
  lstkMp350PriceRubPerKg: number
  lstkMp390PriceRubPerKg: number
}

interface MountingComputedMasses {
  columnTotalMassKg: number
  purlinTotalMassKg: number
  metalStructuresTotalMassKg: number
  lstkStructuresTotalMassKg: number
  blackStructuresTotalMassKg: number
}

function normalizeText(value: string): string {
  return value.trim().toLowerCase()
}

function inferRegionForMountingCost(city: string): MountingRegionKey {
  const normalizedCity = normalizeText(city)

  if (normalizedCity.includes('челябинск')) {
    return 'chelyabinsk-oblast'
  }

  if (
    normalizedCity.includes('екатеринбург') ||
    normalizedCity.includes('тюмень') ||
    normalizedCity.includes('каменск-уральский')
  ) {
    return 'sverdlovsk-tyumen'
  }

  if (
    normalizedCity.includes('сургут') ||
    normalizedCity.includes('нижневартовск') ||
    normalizedCity.includes('ханты-мансийск')
  ) {
    return 'hmao'
  }

  if (
    normalizedCity.includes('салехард') ||
    normalizedCity.includes('надым') ||
    normalizedCity.includes('новый уренгой') ||
    normalizedCity.includes('ноябрьск')
  ) {
    return 'yanao'
  }

  if (
    normalizedCity.includes('уфа') ||
    normalizedCity.includes('самара') ||
    normalizedCity.includes('казань') ||
    normalizedCity.includes('пермь') ||
    normalizedCity.includes('нижний новгород')
  ) {
    return 'volga-fo'
  }

  if (
    normalizedCity.includes('краснодар') ||
    normalizedCity.includes('ростов') ||
    normalizedCity.includes('волгоград') ||
    normalizedCity.includes('астрахань') ||
    normalizedCity.includes('ставрополь')
  ) {
    return 'south-fo'
  }

  return 'sverdlovsk-tyumen'
}

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180
}

function resolveBuildingAreaM2(input: UnifiedInputLike): number {
  return input.spanM * input.buildingLengthM
}

function resolveRoofAreaM2(input: UnifiedInputLike): number {
  const angleRad = toRadians(input.roofSlopeDeg)
  const cosine = Math.max(Math.cos(angleRad), 0.2)
  return (input.spanM * input.buildingLengthM) / cosine
}

function resolveWallAreaM2(input: UnifiedInputLike): number {
  const perimeterArea = 2 * (input.spanM + input.buildingLengthM) * input.buildingHeightM
  if (normalizeText(input.roofType).includes('двуск')) {
    const riseM = (input.spanM / 2) * Math.tan(toRadians(input.roofSlopeDeg))
    return perimeterArea + input.spanM * riseM
  }
  return perimeterArea
}

export function mapUnifiedInputToMountingCostInput(
  input: UnifiedInputLike,
  computedMasses: MountingComputedMasses,
): MountingCostInput {
  const buildingAreaM2 = resolveBuildingAreaM2(input)
  const roofAreaM2 = resolveRoofAreaM2(input)
  const wallAreaM2 = resolveWallAreaM2(input)

  return {
    city: input.city,
    responsibilityLevel: input.responsibilityLevel,
    roofType: input.roofType,
    spanM: input.spanM,
    buildingLengthM: input.buildingLengthM,
    buildingHeightM: input.buildingHeightM,
    roofSlopeDeg: input.roofSlopeDeg,
    frameStepM: input.frameStepM,
    fakhverkStepM: input.fakhverkStepM,
    terrainType: input.terrainType,

    iBeamS255PriceRubPerKg: input.iBeamS255PriceRubPerKg,
    iBeamS355PriceRubPerKg: input.iBeamS355PriceRubPerKg,
    tubeS245PriceRubPerKg: input.tubeS245PriceRubPerKg,
    tubeS345PriceRubPerKg: input.tubeS345PriceRubPerKg,
    channelS245PriceRubPerKg: input.channelS245PriceRubPerKg,
    channelS345PriceRubPerKg: input.channelS345PriceRubPerKg,
    lstkMp350PriceRubPerKg: input.lstkMp350PriceRubPerKg,
    lstkMp390PriceRubPerKg: input.lstkMp390PriceRubPerKg,

    regionForMountingCost: inferRegionForMountingCost(input.city),
    floorType: input.floorType,
    includeGeology: input.includeGeology,
    includeProject: input.includeProject,
    includeEarthworks: input.includeEarthworks,
    includeConcrete: input.includeConcrete,
    includeFloors: input.includeFloors,
    includeMetal: input.includeMetal,
    includeWalls: input.includeWalls,
    includeRoof: input.includeRoof,
    includeOpenings: input.includeOpenings,
    includeAdditionalWorks: input.includeAdditionalWorks,
    hasWaterSupply: input.hasWaterSupply,
    hasSewerage: input.hasSewerage,
    hasHeating: input.hasHeating,
    hasElectricalWorks: input.hasElectricalWorks,
    buildingAreaM2,
    wallAreaM2,
    roofAreaM2,
    roofFenceLengthM: input.roofFenceLengthM,
    snowGuardLengthM: input.snowGuardLengthM,
    drainageLengthM: input.drainageLengthM,
    doubleDoorAreaM2: input.doubleDoorAreaM2,
    singleDoorCount: input.singleDoorCount,
    entranceBlockAreaM2: input.entranceBlockAreaM2,
    tambourDoorAreaM2: input.tambourDoorAreaM2,
    windowsAreaM2: input.windowsAreaM2,
    gatesAreaM2: input.gatesAreaM2,
    additionalWorksVolumeM3: input.additionalWorksVolumeM3,
    lstkStructuresTotalMassKg: computedMasses.lstkStructuresTotalMassKg,
    blackStructuresTotalMassKg: computedMasses.blackStructuresTotalMassKg,
    columnTotalMassKg: computedMasses.columnTotalMassKg,
    purlinTotalMassKg: computedMasses.purlinTotalMassKg,
    metalStructuresTotalMassKg: computedMasses.metalStructuresTotalMassKg,
  }
}
