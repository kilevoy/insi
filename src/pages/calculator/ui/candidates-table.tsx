import type { CandidateResult } from '@/domain/common/model/candidate-result'

interface CandidatesTableProps {
  title?: string
  candidates: CandidateResult[]
  limit?: number
  selectedIndex?: number
}

export function CandidatesTable({ title, candidates, limit, selectedIndex }: CandidatesTableProps) {
  const displayList = limit ? candidates.slice(0, limit) : candidates

  if (displayList.length === 0) {
    return (
      <div className="candidates-section">
        {title && <h3 className="results-section-title">{title}</h3>}
        <div className="results-empty">РќРµС‚ РїРѕРґС…РѕРґСЏС‰РёС… РїСЂРѕС„РёР»РµР№ РґР»СЏ Р·Р°РґР°РЅРЅС‹С… РЅР°РіСЂСѓР·РѕРє</div>
      </div>
    )
  }

  return (
    <div className="candidates-section">
      {title && <h3 className="results-section-title">{title}</h3>}
      <div className="candidates-list">
        {displayList.map((candidate, index) => {
          const isWarning = candidate.utilization > 0.95
          const isNoteOnly = candidate.utilization === 0 && candidate.note
          const isSelected = selectedIndex === index

          return (
            <div
              key={index}
              className={`candidate-row ${isNoteOnly ? 'candidate-row--note' : ''} ${
                isSelected ? 'candidate-row--selected' : ''
              }`}
            >
              {!isNoteOnly ? (
                <>
                  <div className="candidate-rank">{index + 1}</div>
                  <div className="candidate-profile">
                    <strong>{candidate.profile}</strong>
                    <span>{candidate.steelGrade}</span>
                  </div>

                  <div className="candidate-stats">
                    {candidate.priceTonRub !== undefined && candidate.priceTonRub > 0 && (
                      <div className="candidate-stat">
                        <span className="stat-label">Р¦РµРЅР°/С‚</span>
                        <strong>{Math.round(candidate.priceTonRub).toLocaleString('ru-RU')} в‚Ѕ</strong>
                      </div>
                    )}

                    {candidate.utilization > 0 && (
                      <div className="candidate-stat">
                        <span className="stat-label">РСЃРїРѕР»СЊР·РѕРІР°РЅРёРµ</span>
                        <div className="utilization-mini-bar">
                          <div
                            className="utilization-fill"
                            style={{
                              width: `${Math.min(candidate.utilization * 100, 100)}%`,
                              backgroundColor: isWarning ? 'var(--warning)' : 'var(--success)',
                            }}
                          />
                          <strong className={isWarning ? 'text-warning' : ''}>
                            {(candidate.utilization * 100).toFixed(1)}%
                          </strong>
                        </div>
                      </div>
                    )}

                    {candidate.stepMm !== undefined && candidate.stepMm > 0 && (
                      <div className="candidate-stat">
                        <span className="stat-label">РЁР°Рі</span>
                        <strong>{candidate.stepMm} РјРј</strong>
                      </div>
                    )}

                    {candidate.totalMassKg > 0 && (
                      <div className="candidate-stat">
                        <span className="stat-label">РњР°СЃСЃР°</span>
                        <strong>{Math.round(candidate.totalMassKg).toLocaleString('ru-RU')} РєРі</strong>
                      </div>
                    )}

                    {candidate.estimatedCostRub !== undefined && candidate.estimatedCostRub > 0 && (
                      <div className="candidate-stat">
                        <span className="stat-label">Р¦РµРЅР°</span>
                        <strong>{Math.round(candidate.estimatedCostRub).toLocaleString('ru-RU')} в‚Ѕ</strong>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="candidate-profile" style={{ gridColumn: '1 / -1' }}>
                  <strong>{candidate.profile}</strong>
                  <p className="candidate-note-text">{candidate.note}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
