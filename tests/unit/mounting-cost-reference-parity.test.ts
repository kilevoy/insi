import { mountingCostReference } from '@/domain/mounting-cost/model/mounting-cost-reference.generated'

describe('mounting reference parity smoke', () => {
  it('contains source workbook snapshot and region coefficients', () => {
    expect(mountingCostReference.snapshot.sourceWorkbook).toBe('Матрица 2026 СМР.xlsx')
    expect(mountingCostReference.snapshot.sourceSheets.length).toBeGreaterThan(0)
    expect(mountingCostReference.regionCoefficientByKey['sverdlovsk-tyumen']).toBeGreaterThan(1)
  })

  it('contains references for sections 1..13', () => {
    expect(mountingCostReference.section1Geology.sectionKey).toContain('section-1')
    expect(mountingCostReference.section2Project.sectionKey).toContain('section-2')
    expect(mountingCostReference.section3Earthworks.sectionKey).toContain('section-3')
    expect(mountingCostReference.section4Concrete.sectionKey).toContain('section-4')
    expect(mountingCostReference.section5FloorsByType['slab-150'].sectionKey).toContain('section-5')
    expect(mountingCostReference.section6MetalByFrameType.sort.sectionKey).toContain('section-6')
    expect(mountingCostReference.section7Walls.sectionKey).toContain('section-7')
    expect(mountingCostReference.section8RoofPanels.sectionKey).toContain('section-8')
    expect(mountingCostReference.section9Openings.windows.sectionKey).toContain('section-9')
    expect(mountingCostReference.section10WaterSewer.sectionKey).toContain('section-10')
    expect(mountingCostReference.section11Heating.sectionKey).toContain('section-11')
    expect(mountingCostReference.section12Electrical.sectionKey).toContain('section-12')
    expect(mountingCostReference.section13AdditionalWorks.sectionKey).toContain('section-13')
  })
})
