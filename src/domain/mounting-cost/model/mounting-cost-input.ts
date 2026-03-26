import { z } from 'zod'

export const MOUNTING_REGIONS = [
  'chelyabinsk-oblast',
  'sverdlovsk-tyumen',
  'hmao',
  'yanao',
  'volga-fo',
  'south-fo',
] as const

export const MOUNTING_PRICE_TIERS = ['tier-1', 'tier-2', 'tier-3', 'tier-4'] as const
export const MOUNTING_FLOOR_TYPES = ['slab-150', 'slab-200'] as const

export type MountingRegionKey = (typeof MOUNTING_REGIONS)[number]
export type MountingPriceTier = (typeof MOUNTING_PRICE_TIERS)[number]
export type MountingFloorType = (typeof MOUNTING_FLOOR_TYPES)[number]

export const mountingCostInputSchema = z.object({
  city: z.string().min(1),
  responsibilityLevel: z.string().min(1),
  roofType: z.string().min(1),
  spanM: z.number().positive(),
  buildingLengthM: z.number().positive(),
  buildingHeightM: z.number().positive(),
  roofSlopeDeg: z.number().nonnegative(),
  frameStepM: z.number().positive(),
  fakhverkStepM: z.number().positive(),
  terrainType: z.string().min(1),

  iBeamS255PriceRubPerKg: z.number().positive(),
  iBeamS355PriceRubPerKg: z.number().positive(),
  tubeS245PriceRubPerKg: z.number().positive(),
  tubeS345PriceRubPerKg: z.number().positive(),
  channelS245PriceRubPerKg: z.number().positive(),
  channelS345PriceRubPerKg: z.number().positive(),
  lstkMp350PriceRubPerKg: z.number().positive(),
  lstkMp390PriceRubPerKg: z.number().positive(),

  regionForMountingCost: z.enum(MOUNTING_REGIONS),
  floorType: z.enum(MOUNTING_FLOOR_TYPES).default('slab-150'),
  mountingPriceTier: z.enum(MOUNTING_PRICE_TIERS).optional(),

  includeGeology: z.boolean().default(true),
  includeProject: z.boolean().default(true),
  includeEarthworks: z.boolean().default(true),
  includeConcrete: z.boolean().default(true),
  includeFloors: z.boolean().default(true),
  includeMetal: z.boolean().default(true),
  includeWalls: z.boolean().default(true),
  includeRoof: z.boolean().default(true),
  includeOpenings: z.boolean().default(false),
  includeAdditionalWorks: z.boolean().default(false),
  hasWaterSupply: z.boolean().default(false),
  hasSewerage: z.boolean().default(false),
  hasHeating: z.boolean().default(false),
  hasElectricalWorks: z.boolean().default(false),

  buildingAreaM2: z.number().nonnegative(),
  wallAreaM2: z.number().nonnegative(),
  roofAreaM2: z.number().nonnegative(),
  roofFenceLengthM: z.number().nonnegative(),
  snowGuardLengthM: z.number().nonnegative(),
  drainageLengthM: z.number().nonnegative(),

  doubleDoorAreaM2: z.number().nonnegative(),
  singleDoorCount: z.number().nonnegative(),
  entranceBlockAreaM2: z.number().nonnegative(),
  tambourDoorAreaM2: z.number().nonnegative(),
  windowsAreaM2: z.number().nonnegative(),
  gatesAreaM2: z.number().nonnegative(),
  additionalWorksVolumeM3: z.number().nonnegative(),

  lstkStructuresTotalMassKg: z.number().nonnegative(),
  blackStructuresTotalMassKg: z.number().nonnegative(),
  columnTotalMassKg: z.number().nonnegative(),
  purlinTotalMassKg: z.number().nonnegative(),
  metalStructuresTotalMassKg: z.number().nonnegative(),
})

export type MountingCostInput = z.infer<typeof mountingCostInputSchema>
