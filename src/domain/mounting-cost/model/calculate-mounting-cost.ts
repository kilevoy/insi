import { mountingCostInputSchema, type MountingCostInput, type MountingPriceTier } from './mounting-cost-input'
import { mountingCostReference } from './mounting-cost-reference.generated'
import type { MountingCostCalculationResult, MountingCostSectionItem } from './mounting-cost-output'
import { selectMountingPriceTierByFrame, selectTierByUpperBounds } from './select-mounting-price-tier'

function roundRub(value: number): number {
  return Math.round(value)
}

function tonsFromKg(valueKg: number): number {
  return valueKg / 1000
}

interface TieredSectionReference {
  sectionKey: string
  sectionTitle: string
  itemCode: string
  itemTitle: string
  unit: string
  basis: string
  tierUpperBoundQuantity: Record<'tier-1' | 'tier-2' | 'tier-3' | 'tier-4', number | null>
  unitPriceByTierRubPerUnit: Record<'tier-1' | 'tier-2' | 'tier-3' | 'tier-4', number>
}

interface FixedSectionReference {
  sectionKey: string
  sectionTitle: string
  itemCode: string
  itemTitle: string
  unit: string
  basis: string
  unitPriceRubPerUnit: number
}

function buildTieredSection(
  quantity: number,
  reference: TieredSectionReference,
  forcedTier?: MountingPriceTier,
  tierBasisQuantity: number = quantity,
) {
  const tier = selectTierByUpperBounds(tierBasisQuantity, reference.tierUpperBoundQuantity, forcedTier)
  const unitPriceRub = reference.unitPriceByTierRubPerUnit[tier]
  const totalRub = roundRub(quantity * unitPriceRub)

  return {
    tier,
    section: {
      key: reference.sectionKey,
      title: reference.sectionTitle,
      subtotalRub: totalRub,
      items: [
        {
          code: reference.itemCode,
          title: reference.itemTitle,
          unit: reference.unit,
          quantity,
          unitPriceRub,
          totalRub,
          basis: reference.basis,
        },
      ],
    },
  }
}

function buildFixedItem(
  quantity: number,
  reference: FixedSectionReference,
  titleOverride?: string,
): MountingCostSectionItem {
  const totalRub = roundRub(quantity * reference.unitPriceRubPerUnit)
  return {
    code: reference.itemCode,
    title: titleOverride ?? reference.itemTitle,
    unit: reference.unit,
    quantity,
    unitPriceRub: reference.unitPriceRubPerUnit,
    totalRub,
    basis: reference.basis,
  }
}

function pushSingleTieredSection(
  sections: MountingCostCalculationResult['sections'],
  appliedTierNotes: string[],
  sectionLabel: string,
  include: boolean,
  quantity: number,
  reference: TieredSectionReference,
  forcedTier?: MountingPriceTier,
  tierBasisQuantity?: number,
) {
  if (!include || quantity <= 0) {
    return
  }

  const resolved = buildTieredSection(quantity, reference, forcedTier, tierBasisQuantity ?? quantity)
  sections.push(resolved.section)
  appliedTierNotes.push(`${sectionLabel}=${resolved.tier}`)
}

export function calculateMountingCost(rawInput: MountingCostInput): MountingCostCalculationResult {
  const input = mountingCostInputSchema.parse(rawInput)
  const sections: MountingCostCalculationResult['sections'] = []
  const appliedTierNotes: string[] = []

  pushSingleTieredSection(
    sections,
    appliedTierNotes,
    'геология',
    input.includeGeology,
    1,
    mountingCostReference.section1Geology,
    input.mountingPriceTier,
    input.buildingAreaM2,
  )

  pushSingleTieredSection(
    sections,
    appliedTierNotes,
    'проект',
    input.includeProject,
    1,
    mountingCostReference.section2Project,
    input.mountingPriceTier,
    input.buildingAreaM2,
  )

  pushSingleTieredSection(
    sections,
    appliedTierNotes,
    'земля',
    input.includeEarthworks,
    input.buildingAreaM2,
    mountingCostReference.section3Earthworks,
    input.mountingPriceTier,
  )

  pushSingleTieredSection(
    sections,
    appliedTierNotes,
    'бетон',
    input.includeConcrete,
    input.buildingAreaM2,
    mountingCostReference.section4Concrete,
    input.mountingPriceTier,
  )

  pushSingleTieredSection(
    sections,
    appliedTierNotes,
    'полы',
    input.includeFloors,
    input.buildingAreaM2,
    mountingCostReference.section5FloorsByType[input.floorType],
    input.mountingPriceTier,
  )

  if (input.includeMetal) {
    const metalItems: MountingCostSectionItem[] = []
    const metalTierNotes: string[] = []

    if (input.blackStructuresTotalMassKg > 0) {
      const blackTier = selectMountingPriceTierByFrame(
        'sort',
        input.blackStructuresTotalMassKg,
        input.mountingPriceTier,
      )
      const blackSection = buildTieredSection(
        tonsFromKg(input.blackStructuresTotalMassKg),
        mountingCostReference.section6MetalByFrameType.sort,
        blackTier,
      )
      metalItems.push(...blackSection.section.items)
      metalTierNotes.push(`черняк=${blackSection.tier}`)
    }

    if (input.lstkStructuresTotalMassKg > 0) {
      const lstkTier = selectMountingPriceTierByFrame(
        'lstk',
        input.lstkStructuresTotalMassKg,
        input.mountingPriceTier,
      )
      const lstkSection = buildTieredSection(
        tonsFromKg(input.lstkStructuresTotalMassKg),
        mountingCostReference.section6MetalByFrameType.lstk,
        lstkTier,
      )
      metalItems.push(...lstkSection.section.items)
      metalTierNotes.push(`лстк=${lstkSection.tier}`)
    }

    if (metalItems.length === 0 && input.metalStructuresTotalMassKg > 0) {
      const fallbackTier = selectMountingPriceTierByFrame(
        'sort',
        input.metalStructuresTotalMassKg,
        input.mountingPriceTier,
      )
      const fallbackSection = buildTieredSection(
        tonsFromKg(input.metalStructuresTotalMassKg),
        mountingCostReference.section6MetalByFrameType.sort,
        fallbackTier,
      )
      metalItems.push(...fallbackSection.section.items)
      metalTierNotes.push(`черняк=${fallbackSection.tier}`)
    }

    if (metalItems.length > 0) {
      const subtotalRub = metalItems.reduce((sum, item) => sum + item.totalRub, 0)
      sections.push({
        key: 'section-6-metal',
        title: mountingCostReference.section6MetalByFrameType.sort.sectionTitle,
        subtotalRub,
        items: metalItems,
      })
      appliedTierNotes.push(`металл(${metalTierNotes.join(', ')})`)
    }
  }

  pushSingleTieredSection(
    sections,
    appliedTierNotes,
    'стены',
    input.includeWalls,
    input.wallAreaM2,
    mountingCostReference.section7Walls,
    input.mountingPriceTier,
  )

  if (input.includeRoof) {
    const roofItems: MountingCostSectionItem[] = []
    const roofTierNotes: string[] = []

    if (input.roofAreaM2 > 0) {
      const roofPanels = buildTieredSection(
        input.roofAreaM2,
        mountingCostReference.section8RoofPanels,
        input.mountingPriceTier,
      )
      roofItems.push(...roofPanels.section.items)
      roofTierNotes.push(`кровля=${roofPanels.tier}`)
    }

    const roofFenceAndSnowLength = input.roofFenceLengthM + input.snowGuardLengthM
    if (roofFenceAndSnowLength > 0) {
      const fenceAndSnow = buildTieredSection(
        roofFenceAndSnowLength,
        mountingCostReference.section8RoofFenceAndSnowGuards,
        input.mountingPriceTier,
        input.roofAreaM2,
      )
      roofItems.push(
        buildFixedItem(
          fenceAndSnow.section.items[0].quantity,
          {
            ...mountingCostReference.section8RoofFenceAndSnowGuards,
            unitPriceRubPerUnit: fenceAndSnow.section.items[0].unitPriceRub,
          },
          'Ограждение кровли и снегозадержатели',
        ),
      )
      roofTierNotes.push(`аксессуары=${fenceAndSnow.tier}`)
    }

    if (input.drainageLengthM > 0) {
      const drainage = buildTieredSection(
        input.drainageLengthM,
        mountingCostReference.section8RoofDrainage,
        input.mountingPriceTier,
        input.roofAreaM2,
      )
      roofItems.push(
        buildFixedItem(
          drainage.section.items[0].quantity,
          {
            ...mountingCostReference.section8RoofDrainage,
            unitPriceRubPerUnit: drainage.section.items[0].unitPriceRub,
          },
          'Водоотведение кровли',
        ),
      )
      roofTierNotes.push(`водоотведение=${drainage.tier}`)
    }

    if (roofItems.length > 0) {
      const subtotalRub = roofItems.reduce((sum, item) => sum + item.totalRub, 0)
      sections.push({
        key: 'section-8-roof',
        title: mountingCostReference.section8RoofPanels.sectionTitle,
        subtotalRub,
        items: roofItems,
      })
      appliedTierNotes.push(`кровля(${roofTierNotes.join(', ')})`)
    }
  }

  if (input.includeOpenings) {
    const openingItems: MountingCostSectionItem[] = []
    const openingReference = mountingCostReference.section9Openings

    if (input.doubleDoorAreaM2 > 0) {
      openingItems.push(buildFixedItem(input.doubleDoorAreaM2, openingReference.doubleDoor))
    }
    if (input.singleDoorCount > 0) {
      openingItems.push(buildFixedItem(input.singleDoorCount, openingReference.singleDoor))
    }
    if (input.entranceBlockAreaM2 > 0) {
      openingItems.push(buildFixedItem(input.entranceBlockAreaM2, openingReference.entranceBlock))
    }
    if (input.tambourDoorAreaM2 > 0) {
      openingItems.push(buildFixedItem(input.tambourDoorAreaM2, openingReference.tambourDoor))
    }
    if (input.windowsAreaM2 > 0) {
      openingItems.push(buildFixedItem(input.windowsAreaM2, openingReference.windows))
    }
    if (input.gatesAreaM2 > 0) {
      openingItems.push(buildFixedItem(input.gatesAreaM2, openingReference.gates))
    }

    if (openingItems.length > 0) {
      sections.push({
        key: 'section-9-openings',
        title: openingReference.windows.sectionTitle,
        subtotalRub: openingItems.reduce((sum, item) => sum + item.totalRub, 0),
        items: openingItems,
      })
    }
  }

  const needWaterAndSewer = input.hasWaterSupply || input.hasSewerage
  pushSingleTieredSection(
    sections,
    appliedTierNotes,
    'вк',
    needWaterAndSewer,
    input.buildingAreaM2,
    mountingCostReference.section10WaterSewer,
    input.mountingPriceTier,
  )

  pushSingleTieredSection(
    sections,
    appliedTierNotes,
    'отопление',
    input.hasHeating,
    input.buildingAreaM2,
    mountingCostReference.section11Heating,
    input.mountingPriceTier,
  )

  pushSingleTieredSection(
    sections,
    appliedTierNotes,
    'электрика',
    input.hasElectricalWorks,
    input.buildingAreaM2,
    mountingCostReference.section12Electrical,
    input.mountingPriceTier,
  )

  if (input.includeAdditionalWorks && input.additionalWorksVolumeM3 > 0) {
    const item = buildFixedItem(
      input.additionalWorksVolumeM3,
      mountingCostReference.section13AdditionalWorks,
    )
    sections.push({
      key: mountingCostReference.section13AdditionalWorks.sectionKey,
      title: mountingCostReference.section13AdditionalWorks.sectionTitle,
      subtotalRub: item.totalRub,
      items: [item],
    })
  }

  const subtotalRub = sections.reduce((sum, section) => sum + section.subtotalRub, 0)
  const regionCoefficient = mountingCostReference.regionCoefficientByKey[input.regionForMountingCost]
  const totalRub = roundRub(subtotalRub * regionCoefficient)

  const enabledSectionCount = sections.length
  const note =
    `Расчёт включает ${enabledSectionCount} раздел(ов) из матрицы 2026. ` +
    `Tier: ${appliedTierNotes.length > 0 ? appliedTierNotes.join(', ') : 'без tier-секций'}.`

  return {
    snapshot: mountingCostReference.snapshot,
    sections,
    subtotalRub,
    regionCoefficient,
    totalRub,
    note,
  }
}
