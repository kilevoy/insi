import type { ColumnCalculationResult } from '@/domain/column/model/calculate-column'
import type { PurlinCalculationResult } from '@/domain/purlin/model/calculate-purlin'
import type { UnifiedInputState } from '../model/unified-input'

interface MethodologyPanelProps {
  input: UnifiedInputState
  purlinResult: PurlinCalculationResult | null
  columnResult: ColumnCalculationResult | null
}

function formatNumber(value: number, fractionDigits = 2): string {
  return value.toLocaleString('ru-RU', {
    minimumFractionDigits: 0,
    maximumFractionDigits: fractionDigits,
  })
}

function resolveRoofHeightFormula(roofType: string): string {
  return roofType === 'двускатная'
    ? 'H(x) = Hbase + min(x, Span - x) * tan(angle)'
    : 'H(x) = Hbase + x * tan(angle)'
}

function resolveCurrentGeometry(input: UnifiedInputState): string {
  return `${formatNumber(input.spanM, 2)} x ${formatNumber(input.buildingLengthM, 2)} x ${formatNumber(input.buildingHeightM, 2)} м`
}

function renderLoadSketch(title: string, subtitle: string, items: string[]) {
  return (
    <div className="methodology-sketch-card">
      <div className="methodology-sketch-head">
        <strong>{title}</strong>
        <span>{subtitle}</span>
      </div>

      <div className="methodology-sketch-body">
        <div className="methodology-sketch-roof">
          <span className="methodology-sketch-arrow methodology-sketch-arrow--left">↓ снег</span>
          <span className="methodology-sketch-arrow methodology-sketch-arrow--center">↓ покрытие</span>
          <span className="methodology-sketch-arrow methodology-sketch-arrow--right">→ ветер</span>
          <div className="methodology-sketch-rafters">
            <span />
            <span />
          </div>
          <div className="methodology-sketch-column methodology-sketch-column--left" />
          <div className="methodology-sketch-column methodology-sketch-column--right" />
          <div className="methodology-sketch-beam" />
        </div>

        <ul className="methodology-sketch-list">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export function MethodologyPanel({ input, purlinResult, columnResult }: MethodologyPanelProps) {
  const roofFormula = resolveRoofHeightFormula(input.roofType)
  const currentGeometry = resolveCurrentGeometry(input)

  return (
    <div className="tab-pane animate-in">
      <section className="results-section results-section--summary-sheet methodology-sheet">
        <div className="methodology-print-note">
          <div>
            <strong>Пояснительная записка</strong>
            <span>Методика предварительного подбора колонн и прогонов</span>
          </div>
          <div>
            <span>Город: {input.city}</span>
            <span>Геометрия: {currentGeometry}</span>
          </div>
        </div>

        <div className="methodology-header">
          <div>
            <h3 className="results-section-title">Методика подбора</h3>
            <p className="results-inline-note methodology-lead">
              Здесь собрана логика предварительного расчета: какие исходные параметры участвуют
              в подборе, по каким нагрузкам и критериям отсеиваются кандидаты, какие формулы
              и reference-таблицы используются и что именно попадает в итоговую спецификацию.
            </p>
          </div>

          <div className="methodology-actions">
            <div className="methodology-badges">
              <span className="methodology-badge">Excel parity</span>
              <span className="methodology-badge">Pure domain kernels</span>
              <span className="methodology-badge">СП 20 / workbook tables</span>
            </div>
            <button className="results-print-action" onClick={() => window.print()}>
              Печать / PDF
            </button>
          </div>
        </div>

        <div className="summary-hero summary-hero--methodology">
          <div className="summary-metric-card summary-metric-card--accent">
            <span>Исходный кейс</span>
            <strong>{`${input.city} / ур. отв ${input.responsibilityLevel}`}</strong>
          </div>
          <div className="summary-metric-card">
            <span>Геометрия</span>
            <strong>{currentGeometry}</strong>
          </div>
          <div className="summary-metric-card">
            <span>Подбор прогонов</span>
            <strong>{`${input.purlinSpecificationSource === 'sort' ? 'Сортовой' : 'ЛСТК'} / ${input.purlinSelectionMode === 'manual' ? 'ручной' : 'авто'}`}</strong>
          </div>
          <div className="summary-metric-card">
            <span>Подбор колонн</span>
            <strong>{`${input.columnSelectionMode === 'engineering' ? 'Инженерный Hmax' : 'Excel-режим'} / ${input.isManualMode ? 'ручной' : 'авто'}`}</strong>
          </div>
        </div>

        <div className="methodology-section-grid">
          <section className="methodology-card">
            <h4>Нормативная база и принцип моделирования</h4>
            <ul className="methodology-list">
              <li>
                Нормативные снеговые и ветровые районы, коэффициенты по высоте, аэродинамические
                поправки и каталоги профилей берутся из reference-таблиц, перенесенных из
                исходных Excel-калькуляторов.
              </li>
              <li>
                Основная ветка нагрузок ориентирована на <strong>СП 20.13330</strong>; это же
                отражено в workbook-логике, с которой поддерживается parity.
              </li>
              <li>
                Для части веток прогонов сохранена совместимость с workbook-сценарием
                <strong> по СП РК EN</strong>, если такой флаг присутствует в данных города.
              </li>
              <li>
                Формулы расчета находятся только в domain-слое, а интерфейс показывает уже
                готовый расчетный контекст, коэффициенты использования и спецификацию.
              </li>
            </ul>
          </section>

          <section className="methodology-card">
            <h4>Какие параметры участвуют в подборе</h4>
            <div className="methodology-mini-grid">
              <div className="methodology-mini-tile">
                <span>Геометрия</span>
                <strong>Пролет, длина, высота, уклон, шаг рам, шаг фахверка, многопролетность</strong>
              </div>
              <div className="methodology-mini-tile">
                <span>Климат</span>
                <strong>Город, тип местности, уровень ответственности</strong>
              </div>
              <div className="methodology-mini-tile">
                <span>Ограждающие</span>
                <strong>Тип кровли, покрытие, профлист, стеновое покрытие</strong>
              </div>
              <div className="methodology-mini-tile">
                <span>Особые условия</span>
                <strong>Снеговой мешок, перепад высот, тяжи, снегозадержание, ограждение</strong>
              </div>
              <div className="methodology-mini-tile">
                <span>Колонны</span>
                <strong>Тип колонны, связи, крановые нагрузки, режим Hmax</strong>
              </div>
              <div className="methodology-mini-tile">
                <span>Экономика</span>
                <strong>Цены по категориям профиля и маркам стали</strong>
              </div>
            </div>
          </section>
        </div>

        <section className="methodology-card">
          <h4>Схема действия нагрузок</h4>
          <div className="methodology-sketch-grid">
            {renderLoadSketch('Прогоны', 'Вертикальная и фасадная ветка', [
              'снеговая нагрузка по району',
              'постоянная нагрузка от покрытия',
              'эксплуатационная нагрузка',
              'ветер по кровле и фасаду',
              'добавка от снегового мешка',
            ])}
            {renderLoadSketch('Колонны', 'Осевая сила и момент', [
              'ветровое давление по высоте',
              'нагрузки от кровли и стен',
              'снеговая нагрузка по району',
              'крановые воздействия',
              'связевая схема и расчетные длины',
            ])}
          </div>

          <div className="load-grid load-grid--summary methodology-load-grid">
            <div className="load-tile">
              <span>Снег район прогонов</span>
              <strong>{purlinResult ? `${formatNumber(purlinResult.loadSummary.snowRegionKpa, 2)} кПа` : '-'}</strong>
            </div>
            <div className="load-tile">
              <span>Ветер район прогонов</span>
              <strong>{purlinResult ? `${formatNumber(purlinResult.loadSummary.windRegionKpa, 2)} кПа` : '-'}</strong>
            </div>
            <div className="load-tile">
              <span>Суммарная расчетная нагрузка</span>
              <strong>{purlinResult ? `${formatNumber(purlinResult.loadSummary.designTotalKpa, 2)} кПа` : '-'}</strong>
            </div>
            <div className="load-tile">
              <span>Осевая сила колонны</span>
              <strong>{columnResult?.derivedContext ? `${formatNumber(columnResult.derivedContext.axialLoadKn, 1)} кН` : '-'}</strong>
            </div>
            <div className="load-tile">
              <span>Момент колонны</span>
              <strong>{columnResult?.derivedContext ? `${formatNumber(columnResult.derivedContext.bendingMomentKnM, 1)} кН·м` : '-'}</strong>
            </div>
            <div className="load-tile">
              <span>Коэф. снегового мешка</span>
              <strong>{purlinResult ? formatNumber(purlinResult.loadSummary.snowBagFactor, 2) : '-'}</strong>
            </div>
          </div>
        </section>

        <section className="methodology-card">
          <h4>Ключевые формулы и правила отбора</h4>
          <div className="methodology-formula-grid">
            <div className="methodology-formula-card">
              <span>Высота колонны</span>
              <code>{roofFormula}</code>
              <p>Формула зависит от типа кровли и определяет фактическую рабочую высоту в группе.</p>
            </div>
            <div className="methodology-formula-card">
              <span>Количество основных колонн</span>
              <code>Nmain = ((Length / FrameStep) - 1) * 2</code>
              <p>Для крайних рам используется обе стороны здания.</p>
            </div>
            <div className="methodology-formula-card">
              <span>Количество фахверковых колонн</span>
              <code>Nfach = ((Span / FachwerkStep) + 1) * 2</code>
              <p>Используется отдельная группа торцевых и фахверковых стоек.</p>
            </div>
            <div className="methodology-formula-card">
              <span>Подбор колонны по группе</span>
              <code>Hmax = max(Hactual_i)</code>
              <p>В инженерном режиме профиль подбирается по худшему элементу группы.</p>
            </div>
            <div className="methodology-formula-card">
              <span>Линия нагрузок на прогон</span>
              <code>q = qdesign * step</code>
              <p>Шаг прогона напрямую влияет на линейную нагрузку и коэффициент использования.</p>
            </div>
            <div className="methodology-formula-card">
              <span>Отсев кандидата</span>
              <code>utilization ≤ 1.0</code>
              <p>В таблицы попадают только профили, прошедшие расчетные проверки.</p>
            </div>
          </div>
        </section>

        <div className="methodology-section-grid">
          <section className="methodology-card">
            <h4>Как подбираются колонны</h4>
            <ol className="methodology-steps">
              <li>Колонны разбиваются на группы: крайние, фахверковые и средние.</li>
              <li>Для группы собирается геометрия и расчетный контекст по N и M.</li>
              <li>Кандидаты проверяются по прочности, устойчивости X/Y и гибкости X/Y.</li>
              <li>Топ-лист сортируется по workbook-совместимой целевой функции массы и цены.</li>
              <li>В ручном режиме инженер может выбрать другой индекс профиля в группе.</li>
              <li>Спецификация считается по реальным длинам всех колонн, а не только по критической.</li>
            </ol>

            <div className="methodology-formula">
              <strong>Практический смысл:</strong> один профиль назначается на всю группу,
              чтобы спецификация оставалась технологичной и повторяемой на реальном объекте.
            </div>
          </section>

          <section className="methodology-card">
            <h4>Как подбираются прогоны</h4>
            <ol className="methodology-steps">
              <li>Сначала строится цепочка нагрузок: снег, ветер, покрытие, эксплуатация, снеговой мешок.</li>
              <li>Дальше параллельно проверяются ветки сортового проката и ЛСТК.</li>
              <li>Сортовой прогон проверяется по прочности, устойчивости, гибкости и прогибу.</li>
              <li>ЛСТК проверяется по несущей способности, допустимому шагу и фильтрам панели.</li>
              <li>В авто-режиме в спецификацию попадает лучший кандидат выбранного источника.</li>
              <li>В ручном режиме инженер выбирает конкретный профиль из сформированного списка.</li>
            </ol>

            <div className="methodology-formula">
              <strong>Практический смысл:</strong> у ЛСТК и сортового прогона разные модели массы,
              поэтому сравнивать их нужно уже по итоговой массе и спецификационному сценарию.
            </div>
          </section>
        </div>

        <section className="methodology-card">
          <h4>Какие проверки видит инженер</h4>
          <div className="methodology-checks">
            <div className="methodology-check-card">
              <span>Колонны</span>
              <strong>Прочность</strong>
              <p>Контроль суммарных напряжений от осевой силы и момента.</p>
            </div>
            <div className="methodology-check-card">
              <span>Колонны</span>
              <strong>Устойчивость X/Y</strong>
              <p>Проверка по расчетным длинам, радиусам инерции и схеме связей.</p>
            </div>
            <div className="methodology-check-card">
              <span>Колонны</span>
              <strong>Гибкость X/Y</strong>
              <p>Ограничение по стройности для обеих осей.</p>
            </div>
            <div className="methodology-check-card">
              <span>Прогоны сортовые</span>
              <strong>Прочность, устойчивость, прогиб</strong>
              <p>Проверка по вертикальной и фасадной составляющей нагрузки.</p>
            </div>
            <div className="methodology-check-card">
              <span>Прогоны ЛСТК</span>
              <strong>Несущая способность</strong>
              <p>Контроль по расчетному моменту и ограничению коэффициента использования.</p>
            </div>
            <div className="methodology-check-card">
              <span>Экономика</span>
              <strong>Масса и стоимость</strong>
              <p>Считаются отдельно от расчетной прочности и используются в ранжировании.</p>
            </div>
          </div>
        </section>

        <section className="methodology-card">
          <h4>Что попадает в выдачу</h4>
          <ul className="methodology-list">
            <li>
              Для колонн: группа, координата, длина, профиль, сталь, число ветвей, распорки,
              масса и ориентировочная стоимость.
            </li>
            <li>
              Для прогонов: семейство, профиль, шаг, масса на погонный метр, масса на шаг,
              масса на здание, масса с распорками и ориентировочная стоимость.
            </li>
            <li>
              Во вкладке <strong>Сводная</strong> выводятся общая масса и укрупненная стоимость
              по выбранным колоннам и прогонам.
            </li>
          </ul>
        </section>

        <section className="methodology-card methodology-card--warning">
          <h4>Ограничения модели</h4>
          <ul className="methodology-list">
            <li>
              Калькулятор предназначен для предварительного подбора и не заменяет полный комплект
              КМ/КМД и финальную инженерную проверку.
            </li>
            <li>
              Расчет ограничен диапазонами интерполяции по высоте, пролету и шагам, зашитыми в
              reference-таблицы и workbook-источники.
            </li>
            <li>
              Если допустимый кандидат не найден, приложение не формирует фиктивную спецификацию,
              а показывает отсутствие решения.
            </li>
            <li>
              Источником истины для справочных таблиц остаются workbook-файлы, а parity с Excel
              проверяется отдельными smoke- и parity-тестами.
            </li>
          </ul>
        </section>
      </section>
    </div>
  )
}
