import { calculateColumn } from '@/domain/column/model/calculate-column'
import { defaultColumnInput } from '@/domain/column/model/column-input'
import { calculatePurlin } from '@/domain/purlin/model/calculate-purlin'
import { defaultPurlinInput } from '@/domain/purlin/model/purlin-input'

describe('domain contracts', () => {
  it('returns a purlin workbook-derived snapshot', () => {
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
})
