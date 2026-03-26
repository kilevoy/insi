# Техническое Задание Для Отдельного Исполнителя

## Задача

Нужно разработать отдельный модуль/мини-приложение расчёта укрупнённой стоимости монтажа и СМР, совместимое с текущим проектом `metalcalc`, чтобы в будущем можно было безболезненно объединить оба решения в один продукт.

Цель совместимости:

1. одинаковый стек
2. одинаковые имена базовых полей
3. одинаковый подход к данным и контрактам
4. отсутствие необходимости в последующем большом рефакторинге при интеграции

---

## Обязательное Требование По Совместимости

Исполнитель **не должен придумывать новые названия** для уже существующих параметров здания, если эти параметры уже есть в текущем проекте.

Все общие входные поля должны называться **ровно так же**, как в текущем проекте.

База совместимости:

- [unified-input.ts](/C:/v2_1/src/pages/calculator/model/unified-input.ts)
- [input-mapper.ts](/C:/v2_1/src/pages/calculator/model/input-mapper.ts)
- [package.json](/C:/v2_1/package.json)

---

## Обязательный Стек

Использовать тот же стек, что и в текущем проекте:

1. `React 19`
2. `TypeScript 5`
3. `Vite 8`
4. `Zod 4`
5. `Vitest`
6. `Playwright`

Дополнительно:

1. `ES modules`
2. alias `@` для `src`
3. архитектура с разделением на `domain / pages / shared / scripts`

Не использовать:

1. другой frontend framework
2. Redux / MobX / Vue / Angular
3. другой runtime без необходимости
4. бэкенд как обязательную часть MVP

---

## Формат Реализации

Исполнитель может делать:

1. либо отдельный репозиторий, но совместимый по контрактам
2. либо отдельный модуль внутри общей структуры

Предпочтительный формат:

- отдельный совместимый модуль, ориентированный на последующий перенос в `src/domain/mounting-cost`

---

## Требование По Архитектуре

Нужно придерживаться той же архитектурной логики:

1. `src/domain/*` — чистая расчётная логика
2. `src/pages/*` — UI
3. `src/shared/*` — общие helper/config
4. `scripts/*` — генерация reference-data из Excel

Для модуля расчёта монтажа желательно использовать такую структуру:

1. `src/domain/mounting-cost/model/mounting-cost-input.ts`
2. `src/domain/mounting-cost/model/mounting-cost-output.ts`
3. `src/domain/mounting-cost/model/calculate-mounting-cost.ts`
4. `src/domain/mounting-cost/model/mounting-cost-reference.generated.ts`
5. `scripts/extract_mounting_cost_reference.py`

---

## Source Of Truth

Источник данных для расчёта СМР:

- [Матрица 2026 СМР.xlsx](C:\Users\Deako\Downloads\Матрица%202026%20СМР.xlsx)

Исполнитель не должен вручную хардкодить расценки в UI.

Правильный подход:

1. считать Excel
2. сгенерировать `*.generated.ts`
3. использовать generated reference data в domain-слое

---

## Обязательные Имена Общих Полей

Ниже перечислены поля, которые уже существуют в текущем проекте и **обязаны совпадать по названию**.

### Геометрия и регион

1. `city`
2. `responsibilityLevel`
3. `roofType`
4. `spanM`
5. `buildingLengthM`
6. `buildingHeightM`
7. `roofSlopeDeg`
8. `frameStepM`
9. `fakhverkStepM`
10. `terrainType`

### Ограждающие конструкции

1. `roofCoveringType`
2. `wallCoveringType`
3. `profileSheet`
4. `wallProfileSheet`

### Снеговой мешок и кровельные опции

1. `snowBagMode`
2. `heightDifferenceM`
3. `adjacentBuildingSizeM`
4. `snowRetentionPurlin`
5. `barrierPurlin`
6. `tiesSetting`
7. `braceSpacingM`

### Краны и нагрузки

1. `extraLoadPercent`
2. `supportCraneMode`
3. `supportCraneSingleSpanMode`
4. `supportCraneCapacity`
5. `supportCraneCount`
6. `supportCraneRailLevelM`
7. `hangingCraneMode`
8. `hangingCraneSingleSpanMode`
9. `hangingCraneCapacityT`

### Режимы выбора

1. `columnSelectionMode`
2. `purlinSpecificationSource`
3. `purlinSelectionMode`

### Экономика

1. `iBeamS255PriceRubPerKg`
2. `iBeamS355PriceRubPerKg`
3. `tubeS245PriceRubPerKg`
4. `tubeS345PriceRubPerKg`
5. `channelS245PriceRubPerKg`
6. `channelS345PriceRubPerKg`
7. `lstkMp350PriceRubPerKg`
8. `lstkMp390PriceRubPerKg`

---

## Новые Поля Для Модуля Монтажа

Новые поля допустимы, но должны добавляться **поверх существующих**, без переименования старых.

Рекомендуемые новые поля:

1. `regionForMountingCost`
2. `mountingPriceTier`
3. `foundationType`
4. `foundationAreaM2`
5. `floorType`
6. `floorAreaM2`
7. `wallAreaM2`
8. `roofAreaM2`
9. `roofPerimeterM`
10. `drainageLengthM`
11. `windowsAreaM2`
12. `doorsAreaM2`
13. `gatesAreaM2`
14. `doubleDoorCount`
15. `singleDoorCount`
16. `hasWaterSupply`
17. `hasSewerage`
18. `hasHeating`
19. `hasElectricalWorks`
20. `additionalWorksVolumeM3`

Если исполнитель предлагает другие поля, он обязан:

1. описать зачем они нужны
2. показать, почему существующих полей недостаточно
3. не ломать совместимость со `UnifiedInputState`

---

## Что Должно Браться Из Уже Готовых Расчётов

Модуль монтажа должен уметь принимать уже посчитанные результаты из основного калькулятора.

Обязательная совместимость по входам:

1. суммарная масса колонн
2. суммарная масса прогонов
3. суммарная масса металлоконструкций

Для этого исполнитель должен заложить contract-friendly input, например:

1. `columnTotalMassKg`
2. `purlinTotalMassKg`
3. `metalStructuresTotalMassKg`

Важно:

- новые агрегированные поля можно добавлять
- но они не должны заменять базовые геометрические поля

---

## Обязательные Выходы Модуля

Минимальный output должен включать:

1. `sections`
2. `subtotalRub`
3. `regionCoefficient`
4. `totalRub`
5. `note`
6. `snapshot`

Рекомендуемая структура:

```ts
interface MountingCostSectionItem {
  code: string
  title: string
  unit: string
  quantity: number
  unitPriceRub: number
  totalRub: number
  basis: string
}

interface MountingCostSection {
  key: string
  title: string
  subtotalRub: number
  items: MountingCostSectionItem[]
}

interface MountingCostCalculationResult {
  snapshot: {
    sourceWorkbook: string
    sourceSheets: string[]
    status: 'scaffolded' | 'in-progress' | 'parity-verified'
    note: string
  }
  sections: MountingCostSection[]
  subtotalRub: number
  regionCoefficient: number
  totalRub: number
  note?: string
}
```

---

## Что Обязательно В MVP

### MVP Scope

На первом этапе нужно реализовать только то, что реально можно стабильно подвязать:

1. `Металлоконструкции СМР`
2. при возможности:
   - `Земляные работы`
   - `Полы`
   - `Кровля`
   - `Стены`

### Что Не Нужно Тащить В Первый Спринт

1. полную смету по всем 13 разделам
2. сложные инженерные разделы без достаточных входных данных
3. сервер
4. PDF-генерацию через внешние библиотеки, если print-версия уже решает задачу

---

## Правила Выбора Строк Матрицы

Исполнитель обязан явно оформить:

1. как выбирается одна из нескольких строк цены
2. где это правило хранится
3. как оно тестируется

Нельзя:

1. выбирать строку “на глаз”
2. прятать бизнес-логику только в UI
3. хардкодить выбор без документации

Правила выбора строк должны жить в domain-слое и быть покрыты тестами.

---

## Требования К Тестам

Обязательно:

1. unit-тесты на domain-расчёт
2. unit-тесты на маппинг входов
3. parity-smoke тесты против Excel-матрицы
4. e2e smoke на UI-вкладку/экран СМР

Минимальный набор:

1. `tests/unit/mounting-cost-input.test.ts`
2. `tests/unit/mounting-cost-calculation.test.ts`
3. `tests/unit/mounting-cost-reference-parity.test.ts`
4. `tests/e2e/mounting-cost.spec.ts`

---

## Требования К UI

UI должен быть совместим по стилю с текущим приложением.

Нужно:

1. вкладка `СМР` или `Монтаж`
2. блок `Общие сведения`
3. таблица `Стоимость по разделам`
4. итоговый блок:
   - масса
   - коэффициент
   - итоговая стоимость
5. кнопка `Печать / PDF`

Не нужно:

1. отдельный дизайн на другом визуальном языке
2. другой роутинг
3. свой отдельный state-management, если можно встроить в текущий подход

---

## Требования К Кодстайлу И Ограничения

1. TypeScript strict-friendly стиль
2. ASCII по умолчанию при редактировании файлов
3. без разрушения существующих контрактов
4. без переименования уже существующих shared полей
5. без дублирования одних и тех же enum/справочников под другими именами

---

## Что Должен Передать Исполнитель

Итогом работы должны быть:

1. код модуля расчёта монтажа
2. extractor Excel-матрицы
3. generated reference module
4. unit-тесты
5. parity-smoke тесты
6. e2e smoke
7. краткая документация:
   - что считается
   - что не считается
   - какие допущения сделаны

---

## Критерий Приёмки

Работа считается принятой, если:

1. стек совпадает с текущим проектом
2. общие имена полей совпадают
3. reference-data генерируется из Excel, а не вручную
4. расчёт покрыт тестами
5. можно без сильного рефакторинга встроить модуль в текущий `metalcalc`

---

## Практический Комментарий Для Исполнителя

Главная задача — не просто “сделать отдельный калькулятор СМР”, а сделать его так, чтобы потом он стал частью текущего проекта без переименований и пересборки половины контрактов.

Если при разработке появляется желание:

1. переименовать существующие поля
2. использовать другой стек
3. построить новый state shape без совместимости

то это нужно считать нарушением ТЗ.
