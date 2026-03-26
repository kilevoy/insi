import type { ColumnType } from '@/domain/column/model/column-input'
import {
  COLUMN_SELECTION_MODE_OPTIONS,
  COLUMN_TYPE_OPTIONS,
  DEFAULT_PROFILE_SHEET,
  DEFAULT_ROOF_COVERING,
  DEFAULT_UNIFIED_CITY,
  DEFAULT_WALL_COVERING,
  FLOOR_TYPE_OPTIONS,
  PRESENCE_OPTIONS,
  PROFILE_SHEET_OPTIONS,
  PURLIN_SELECTION_MODE_OPTIONS,
  PURLIN_SPECIFICATION_SOURCE_OPTIONS,
  ROOF_TYPE_OPTIONS,
  SNOW_BAG_MODE_OPTIONS,
  SPAN_MODE_OPTIONS,
  SPANS_COUNT_OPTIONS,
  SUPPORT_CRANE_CAPACITY_OPTIONS,
  SUPPORT_CRANE_COUNT_OPTIONS,
  TERRAIN_OPTIONS,
  UNIFIED_CITY_OPTIONS,
  UNIFIED_COVERING_OPTIONS,
} from './unified-input-options'

export interface UnifiedInputState {
  city: string
  responsibilityLevel: string
  roofType: (typeof ROOF_TYPE_OPTIONS)[number]
  spanM: number
  buildingLengthM: number
  buildingHeightM: number
  roofSlopeDeg: number
  frameStepM: number
  fakhverkStepM: number
  spansCount: (typeof SPANS_COUNT_OPTIONS)[number]
  perimeterBracing: (typeof PRESENCE_OPTIONS)[number]
  terrainType: (typeof TERRAIN_OPTIONS)[number]
  floorType: (typeof FLOOR_TYPE_OPTIONS)[number]
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

  roofCoveringType: string
  wallCoveringType: string
  profileSheet: string
  wallProfileSheet: string

  snowBagMode: (typeof SNOW_BAG_MODE_OPTIONS)[number]
  heightDifferenceM: number
  adjacentBuildingSizeM: number
  manualMaxStepMm: number
  manualMinStepMm: number
  maxUtilizationRatio: number
  tiesSetting: string
  braceSpacingM: number
  snowRetentionPurlin: (typeof PRESENCE_OPTIONS)[number]
  barrierPurlin: (typeof PRESENCE_OPTIONS)[number]

  columnType: ColumnType
  columnSelectionMode: (typeof COLUMN_SELECTION_MODE_OPTIONS)[number]
  purlinSpecificationSource: (typeof PURLIN_SPECIFICATION_SOURCE_OPTIONS)[number]
  purlinSelectionMode: (typeof PURLIN_SELECTION_MODE_OPTIONS)[number]
  selectedSortPurlinIndex: number
  selectedLstkPurlinIndex: number
  extraLoadPercent: number
  supportCraneMode: (typeof PRESENCE_OPTIONS)[number]
  supportCraneSingleSpanMode: (typeof SPAN_MODE_OPTIONS)[number]
  supportCraneCapacity: string
  supportCraneCount: (typeof SUPPORT_CRANE_COUNT_OPTIONS)[number]
  supportCraneRailLevelM: number
  hangingCraneMode: (typeof PRESENCE_OPTIONS)[number]
  hangingCraneSingleSpanMode: (typeof SPAN_MODE_OPTIONS)[number]
  hangingCraneCapacityT: number
  selectedProfileExtreme: number
  selectedProfileFachwerk: number
  selectedProfileMiddle: number
  isManualMode: boolean

  iBeamS255PriceRubPerKg: number
  iBeamS355PriceRubPerKg: number
  tubeS245PriceRubPerKg: number
  tubeS345PriceRubPerKg: number
  channelS245PriceRubPerKg: number
  channelS345PriceRubPerKg: number
  lstkMp350PriceRubPerKg: number
  lstkMp390PriceRubPerKg: number
}

function normalizeLegacyText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function normalizeCatalogValue(
  value: unknown,
  options: readonly string[],
  fallback: string,
  normalize: (text: string) => string = (text) => text.toLowerCase(),
): string {
  const text = normalizeLegacyText(value)
  if (text === '') {
    return fallback
  }

  const normalizedValue = normalize(text)
  return options.find((option) => normalize(option) === normalizedValue) ?? fallback
}

function normalizeTerrainType(value: unknown): UnifiedInputState['terrainType'] {
  const text = normalizeLegacyText(value).toUpperCase()

  if (text === 'A' || text === 'А') {
    return 'А'
  }

  if (text === 'B' || text === 'В') {
    return 'В'
  }

  if (text === 'C' || text === 'С') {
    return 'С'
  }

  return defaultUnifiedInput.terrainType
}

function normalizeRoofType(value: unknown): UnifiedInputState['roofType'] {
  const text = normalizeLegacyText(value).toLowerCase()

  if (text.includes('односкат') || text.includes('mono')) {
    return 'односкатная'
  }

  if (text.includes('двускат') || text.includes('gable')) {
    return 'двускатная'
  }

  return defaultUnifiedInput.roofType
}

function normalizeSpansCount(value: unknown): UnifiedInputState['spansCount'] {
  const text = normalizeLegacyText(value).toLowerCase()

  if (text === '1' || text.includes('один') || text.includes('single')) {
    return 'один'
  }

  if (text.includes('более') || text.includes('несколь') || text.includes('multi')) {
    return 'более одного'
  }

  return defaultUnifiedInput.spansCount
}

function normalizeColumnType(value: unknown): UnifiedInputState['columnType'] {
  const text = normalizeLegacyText(value).toLowerCase()

  if (text.includes('крайн')) {
    return COLUMN_TYPE_OPTIONS[0]
  }

  if (text.includes('фахверк')) {
    return COLUMN_TYPE_OPTIONS[1]
  }

  if (text.includes('средн') || text.includes('middle')) {
    return COLUMN_TYPE_OPTIONS[2]
  }

  return defaultUnifiedInput.columnType
}

function normalizePresenceMode(value: unknown): (typeof PRESENCE_OPTIONS)[number] {
  const text = normalizeLegacyText(value).toLowerCase()

  if (text === 'есть' || text === 'on' || text === 'true') {
    return 'есть'
  }

  return 'нет'
}

function normalizeSnowBagMode(value: unknown): UnifiedInputState['snowBagMode'] {
  const text = normalizeLegacyText(value).toLowerCase()

  if (text === '' || text === 'нет' || text === 'no' || text === 'false') {
    return 'нет'
  }

  if (text.includes('вдоль') || text.includes('along')) {
    return 'вдоль здания'
  }

  if (
    text.includes('попер') ||
    text.includes('across') ||
    text === 'есть' ||
    text === 'yes' ||
    text === 'true'
  ) {
    return 'поперёк здания'
  }

  return defaultUnifiedInput.snowBagMode
}

function normalizePurlinSpecificationSource(
  value: unknown,
): UnifiedInputState['purlinSpecificationSource'] {
  const text = normalizeLegacyText(value).toLowerCase()

  if (text.includes('lstk')) {
    return 'lstk'
  }

  return 'sort'
}

function normalizePurlinSelectionMode(value: unknown): UnifiedInputState['purlinSelectionMode'] {
  const text = normalizeLegacyText(value).toLowerCase()

  if (text.includes('manual') || text.includes('руч')) {
    return 'manual'
  }

  return 'auto'
}

function normalizeSpanMode(value: unknown): UnifiedInputState['supportCraneSingleSpanMode'] {
  const text = normalizeLegacyText(value).toLowerCase()

  if (text === 'нет' || text === 'no' || text === 'false') {
    return 'нет'
  }

  return 'да'
}

function normalizeSupportCraneCount(value: unknown): UnifiedInputState['supportCraneCount'] {
  const text = normalizeLegacyText(value).toLowerCase()

  if (text === 'два' || text === '2' || text.includes('two')) {
    return 'два'
  }

  return 'один'
}

function normalizeSupportCraneCapacity(value: unknown): string {
  return normalizeCatalogValue(
    value,
    SUPPORT_CRANE_CAPACITY_OPTIONS,
    defaultUnifiedInput.supportCraneCapacity,
    (text) => text.replace(/\s+/g, '').replace(',', '.'),
  )
}

function normalizeBoundedInteger(value: unknown, fallback: number): number {
  const numeric = Number(value)
  return Number.isFinite(numeric) ? Math.max(0, Math.trunc(numeric)) : fallback
}

function normalizeBoolean(value: unknown, fallback: boolean): boolean {
  if (typeof value === 'boolean') {
    return value
  }
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase()
    if (normalized === 'true' || normalized === '1' || normalized === 'yes' || normalized === 'да') {
      return true
    }
    if (normalized === 'false' || normalized === '0' || normalized === 'no' || normalized === 'нет') {
      return false
    }
  }
  return fallback
}

function normalizeNonNegativeNumber(value: unknown, fallback: number): number {
  const numeric = Number(value)
  if (!Number.isFinite(numeric)) {
    return fallback
  }
  return Math.max(0, numeric)
}

export const defaultUnifiedInput: UnifiedInputState = {
  city: DEFAULT_UNIFIED_CITY,
  responsibilityLevel: '1',
  roofType: 'двускатная',
  spanM: 24,
  buildingLengthM: 60,
  buildingHeightM: 10,
  roofSlopeDeg: 6,
  frameStepM: 6,
  fakhverkStepM: 6,
  spansCount: 'один',
  perimeterBracing: 'нет',
  terrainType: 'В',
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

  roofCoveringType: DEFAULT_ROOF_COVERING,
  wallCoveringType: DEFAULT_WALL_COVERING,
  profileSheet: DEFAULT_PROFILE_SHEET,
  wallProfileSheet: DEFAULT_PROFILE_SHEET,

  snowBagMode: 'нет',
  heightDifferenceM: 4.5,
  adjacentBuildingSizeM: 9.5,
  manualMaxStepMm: 0,
  manualMinStepMm: 0,
  maxUtilizationRatio: 0.8,
  tiesSetting: 'нет',
  braceSpacingM: 3,
  snowRetentionPurlin: 'нет',
  barrierPurlin: 'нет',

  columnType: COLUMN_TYPE_OPTIONS[0],
  columnSelectionMode: 'engineering',
  purlinSpecificationSource: 'sort',
  purlinSelectionMode: 'auto',
  selectedSortPurlinIndex: 0,
  selectedLstkPurlinIndex: 0,
  extraLoadPercent: 15,
  supportCraneMode: 'нет',
  supportCraneSingleSpanMode: 'да',
  supportCraneCapacity: SUPPORT_CRANE_CAPACITY_OPTIONS.find((item) => item === '5') ?? SUPPORT_CRANE_CAPACITY_OPTIONS[0] ?? '5',
  supportCraneCount: 'один',
  supportCraneRailLevelM: 3.5,
  hangingCraneMode: 'нет',
  hangingCraneSingleSpanMode: 'да',
  hangingCraneCapacityT: 2,
  selectedProfileExtreme: 0,
  selectedProfileFachwerk: 0,
  selectedProfileMiddle: 0,
  isManualMode: false,

  iBeamS255PriceRubPerKg: 148.8,
  iBeamS355PriceRubPerKg: 155.88,
  tubeS245PriceRubPerKg: 130.2,
  tubeS345PriceRubPerKg: 141,
  channelS245PriceRubPerKg: 170,
  channelS345PriceRubPerKg: 180,
  lstkMp350PriceRubPerKg: 170,
  lstkMp390PriceRubPerKg: 170,
}

export function normalizeLoadedInput(raw: unknown): UnifiedInputState {
  const parsed = (raw && typeof raw === 'object' ? raw : {}) as Partial<UnifiedInputState>

  return {
    ...defaultUnifiedInput,
    ...parsed,
    city: normalizeCatalogValue(parsed.city, UNIFIED_CITY_OPTIONS, defaultUnifiedInput.city),
    roofType: normalizeRoofType(parsed.roofType),
    spansCount: normalizeSpansCount(parsed.spansCount),
    perimeterBracing: normalizePresenceMode(parsed.perimeterBracing),
    terrainType: normalizeTerrainType(parsed.terrainType),
    floorType: normalizeCatalogValue(
      parsed.floorType,
      FLOOR_TYPE_OPTIONS,
      defaultUnifiedInput.floorType,
    ) as UnifiedInputState['floorType'],
    includeGeology: normalizeBoolean(parsed.includeGeology, defaultUnifiedInput.includeGeology),
    includeProject: normalizeBoolean(parsed.includeProject, defaultUnifiedInput.includeProject),
    includeEarthworks: normalizeBoolean(parsed.includeEarthworks, defaultUnifiedInput.includeEarthworks),
    includeConcrete: normalizeBoolean(parsed.includeConcrete, defaultUnifiedInput.includeConcrete),
    includeFloors: normalizeBoolean(parsed.includeFloors, defaultUnifiedInput.includeFloors),
    includeMetal: normalizeBoolean(parsed.includeMetal, defaultUnifiedInput.includeMetal),
    includeWalls: normalizeBoolean(parsed.includeWalls, defaultUnifiedInput.includeWalls),
    includeRoof: normalizeBoolean(parsed.includeRoof, defaultUnifiedInput.includeRoof),
    includeOpenings: normalizeBoolean(parsed.includeOpenings, defaultUnifiedInput.includeOpenings),
    includeAdditionalWorks: normalizeBoolean(
      parsed.includeAdditionalWorks,
      defaultUnifiedInput.includeAdditionalWorks,
    ),
    hasWaterSupply: normalizeBoolean(parsed.hasWaterSupply, defaultUnifiedInput.hasWaterSupply),
    hasSewerage: normalizeBoolean(parsed.hasSewerage, defaultUnifiedInput.hasSewerage),
    hasHeating: normalizeBoolean(parsed.hasHeating, defaultUnifiedInput.hasHeating),
    hasElectricalWorks: normalizeBoolean(
      parsed.hasElectricalWorks,
      defaultUnifiedInput.hasElectricalWorks,
    ),
    roofFenceLengthM: normalizeNonNegativeNumber(
      parsed.roofFenceLengthM,
      defaultUnifiedInput.roofFenceLengthM,
    ),
    snowGuardLengthM: normalizeNonNegativeNumber(
      parsed.snowGuardLengthM,
      defaultUnifiedInput.snowGuardLengthM,
    ),
    drainageLengthM: normalizeNonNegativeNumber(
      parsed.drainageLengthM,
      defaultUnifiedInput.drainageLengthM,
    ),
    doubleDoorAreaM2: normalizeNonNegativeNumber(
      parsed.doubleDoorAreaM2,
      defaultUnifiedInput.doubleDoorAreaM2,
    ),
    singleDoorCount: normalizeNonNegativeNumber(
      parsed.singleDoorCount,
      defaultUnifiedInput.singleDoorCount,
    ),
    entranceBlockAreaM2: normalizeNonNegativeNumber(
      parsed.entranceBlockAreaM2,
      defaultUnifiedInput.entranceBlockAreaM2,
    ),
    tambourDoorAreaM2: normalizeNonNegativeNumber(
      parsed.tambourDoorAreaM2,
      defaultUnifiedInput.tambourDoorAreaM2,
    ),
    windowsAreaM2: normalizeNonNegativeNumber(parsed.windowsAreaM2, defaultUnifiedInput.windowsAreaM2),
    gatesAreaM2: normalizeNonNegativeNumber(parsed.gatesAreaM2, defaultUnifiedInput.gatesAreaM2),
    additionalWorksVolumeM3: normalizeNonNegativeNumber(
      parsed.additionalWorksVolumeM3,
      defaultUnifiedInput.additionalWorksVolumeM3,
    ),
    roofCoveringType: normalizeCatalogValue(
      parsed.roofCoveringType,
      UNIFIED_COVERING_OPTIONS,
      defaultUnifiedInput.roofCoveringType,
    ),
    wallCoveringType: normalizeCatalogValue(
      parsed.wallCoveringType,
      UNIFIED_COVERING_OPTIONS,
      defaultUnifiedInput.wallCoveringType,
    ),
    profileSheet: normalizeCatalogValue(parsed.profileSheet, PROFILE_SHEET_OPTIONS, defaultUnifiedInput.profileSheet),
    wallProfileSheet: normalizeCatalogValue(parsed.wallProfileSheet, PROFILE_SHEET_OPTIONS, defaultUnifiedInput.wallProfileSheet),
    snowBagMode: normalizeSnowBagMode(parsed.snowBagMode),
    tiesSetting: defaultUnifiedInput.tiesSetting,
    braceSpacingM: Number.isFinite(Number(parsed.braceSpacingM)) && Number(parsed.braceSpacingM) > 0
      ? Number(parsed.braceSpacingM)
      : defaultUnifiedInput.braceSpacingM,
    snowRetentionPurlin: normalizePresenceMode(parsed.snowRetentionPurlin),
    barrierPurlin: normalizePresenceMode(parsed.barrierPurlin),
    columnType: normalizeColumnType(parsed.columnType),
    columnSelectionMode: defaultUnifiedInput.columnSelectionMode,
    purlinSpecificationSource: normalizePurlinSpecificationSource(parsed.purlinSpecificationSource),
    purlinSelectionMode: normalizePurlinSelectionMode(parsed.purlinSelectionMode),
    supportCraneMode: normalizePresenceMode(parsed.supportCraneMode),
    supportCraneSingleSpanMode: normalizeSpanMode(parsed.supportCraneSingleSpanMode),
    supportCraneCapacity: normalizeSupportCraneCapacity(parsed.supportCraneCapacity),
    supportCraneCount: normalizeSupportCraneCount(parsed.supportCraneCount),
    hangingCraneMode: normalizePresenceMode(parsed.hangingCraneMode),
    hangingCraneSingleSpanMode: normalizeSpanMode(parsed.hangingCraneSingleSpanMode),
    isManualMode: parsed.isManualMode === true,
    selectedProfileExtreme: normalizeBoundedInteger(parsed.selectedProfileExtreme, defaultUnifiedInput.selectedProfileExtreme),
    selectedProfileFachwerk: normalizeBoundedInteger(parsed.selectedProfileFachwerk, defaultUnifiedInput.selectedProfileFachwerk),
    selectedProfileMiddle: normalizeBoundedInteger(parsed.selectedProfileMiddle, defaultUnifiedInput.selectedProfileMiddle),
    selectedSortPurlinIndex: normalizeBoundedInteger(parsed.selectedSortPurlinIndex, defaultUnifiedInput.selectedSortPurlinIndex),
    selectedLstkPurlinIndex: normalizeBoundedInteger(parsed.selectedLstkPurlinIndex, defaultUnifiedInput.selectedLstkPurlinIndex),
  }
}
