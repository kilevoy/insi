import { calculatePurlin } from '@/domain/purlin/model/calculate-purlin'
import { buildPurlinDerivedContext } from '@/domain/purlin/model/purlin-derived-context'
import { defaultPurlinInput } from '@/domain/purlin/model/purlin-input'
import { calculateMp390FamilyCandidates } from '@/domain/purlin/model/purlin-lstk-mp390'

describe('purlin MP390 selection', () => {
  it('matches the default workbook recommendations for all MP390 families', () => {
    const derivedContext = buildPurlinDerivedContext(defaultPurlinInput)
    const candidates = calculateMp390FamilyCandidates(defaultPurlinInput, derivedContext)

    expect(candidates).toHaveLength(3)
    expect(candidates[0]).toMatchObject({
      family: 'MP390 / 2TPS',
      profile: '2ТПС 245х65х2',
      stepMm: 2340,
    })
    expect(candidates[0]?.totalMassKg).toBeCloseTo(8228.592, 10)

    expect(candidates[1]).toMatchObject({
      family: 'MP390 / 2PS',
      profile: '2ПС 245х65х1,5',
      stepMm: 1825,
    })
    expect(candidates[1]?.unitMassKg).toBeCloseTo(9.19, 10)
    expect(candidates[1]?.totalMassKg).toBeCloseTo(7719.6, 10)

    expect(candidates[2]).toMatchObject({
      family: 'MP390 / Z',
      profile: 'Z 350х2',
      stepMm: 2395,
    })
    expect(candidates[2]?.unitMassKg).toBeCloseTo(8.9, 10)
    expect(candidates[2]?.totalMassKg).toBeCloseTo(6063.2, 10)
  })

  it('surfaces the transferred MP390 candidates through the aggregate purlin calculation', () => {
    const result = calculatePurlin(defaultPurlinInput)

    expect(result.lstkMp390Top).toHaveLength(3)
    expect(result.lstkMp390Top[0]?.family).toBe('MP390 / 2TPS')
    expect(result.lstkMp390Top[0]?.stepMm).toBe(2340)
    expect(result.lstkMp390Top[1]?.family).toBe('MP390 / 2PS')
    expect(result.lstkMp390Top[2]?.family).toBe('MP390 / Z')
  })
})
