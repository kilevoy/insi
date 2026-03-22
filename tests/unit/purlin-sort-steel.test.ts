import { calculatePurlin } from '@/domain/purlin/model/calculate-purlin'
import { buildPurlinDerivedContext } from '@/domain/purlin/model/purlin-derived-context'
import { defaultPurlinInput } from '@/domain/purlin/model/purlin-input'
import { calculateSortSteelTopCandidates } from '@/domain/purlin/model/purlin-sort-steel'

describe('purlin sort steel ranking', () => {
  it('matches the default workbook top-10 for sort steel', () => {
    const derivedContext = buildPurlinDerivedContext(defaultPurlinInput)
    const candidates = calculateSortSteelTopCandidates(defaultPurlinInput, derivedContext)

    expect(candidates).toHaveLength(10)
    expect(candidates[0]).toMatchObject({
      profile: 'пр.180х140х4',
      steelGrade: 'С345',
      stepMm: 2550,
    })
    expect(candidates[0]?.totalMassKg).toBeCloseTo(13120.14, 10)
    expect(candidates[0]?.objectiveValue).toBeCloseTo(219.53245, 10)

    expect(candidates[1]).toMatchObject({
      profile: 'кв.160х4',
      steelGrade: 'С345',
      stepMm: 2550,
    })
    expect(candidates[1]?.totalMassKg).toBeCloseTo(13188.12, 10)
    expect(candidates[1]?.objectiveValue).toBeCloseTo(220.46045, 10)

    expect(candidates[2]).toMatchObject({
      profile: 'кв.140х5',
      steelGrade: 'С345',
      stepMm: 2410,
    })
    expect(candidates[2]?.totalMassKg).toBeCloseTo(14343.78, 10)
    expect(candidates[2]?.objectiveValue).toBeCloseTo(239.45659, 10)
  })

  it('surfaces the transferred sort steel ranking through the aggregate calculation', () => {
    const result = calculatePurlin(defaultPurlinInput)

    expect(result.sortSteelTop10).toHaveLength(10)
    expect(result.sortSteelTop10[0]).toMatchObject({
      profile: 'пр.180х140х4',
      steelGrade: 'С345',
      stepMm: 2550,
    })
  })
})

describe('purlin sort steel input normalization', () => {
  it('treats whitespace-padded numeric/toggle settings as semantic equivalents', () => {
    const baselineContext = buildPurlinDerivedContext(defaultPurlinInput)
    const baseline = calculateSortSteelTopCandidates(defaultPurlinInput, baselineContext)

    const scenario = {
      ...defaultPurlinInput,
      tiesSetting: `  ${defaultPurlinInput.tiesSetting}  `,
    }
    const context = buildPurlinDerivedContext(scenario)
    const candidates = calculateSortSteelTopCandidates(scenario, context)

    expect(candidates).toHaveLength(baseline.length)
    expect(candidates[0]?.profile).toBe(baseline[0]?.profile)
    expect(candidates[0]?.stepMm).toBe(baseline[0]?.stepMm)
    expect(candidates[0]?.objectiveValue).toBeCloseTo(baseline[0]?.objectiveValue ?? 0, 10)
  })
})

