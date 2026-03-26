import type { MountingPriceTier } from './mounting-cost-input'
import { mountingCostReference } from './mounting-cost-reference.generated'

function tonsFromKg(valueKg: number): number {
  return valueKg / 1000
}

export function selectTierByUpperBounds(
  quantity: number,
  tierUpperBound: Record<MountingPriceTier, number | null>,
  forcedTier?: MountingPriceTier,
): MountingPriceTier {
  if (forcedTier) {
    return forcedTier
  }
  const tierOrder: MountingPriceTier[] = ['tier-1', 'tier-2', 'tier-3', 'tier-4']
  for (const tier of tierOrder) {
    const upperBound = tierUpperBound[tier]
    if (upperBound === null || quantity <= upperBound) {
      return tier
    }
  }

  return 'tier-4'
}

export function selectMountingPriceTierByFrame(
  frameType: 'lstk' | 'sort',
  massKg: number,
  forcedTier?: MountingPriceTier,
): MountingPriceTier {
  const totalTons = tonsFromKg(massKg)
  const frameReference = mountingCostReference.section6MetalByFrameType[frameType]
  return selectTierByUpperBounds(totalTons, frameReference.tierUpperBoundQuantity, forcedTier)
}
