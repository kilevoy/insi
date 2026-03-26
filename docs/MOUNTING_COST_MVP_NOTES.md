# Mounting Cost MVP Notes

Date: 23 March 2026

## What Is Calculated

1. Sections:
   - `Металлоконструкции СМР`
   - `Земляные работы`
   - `Полы`
   - `Стены`
   - `Кровля`
2. Quantity basis:
   - `columnTotalMassKg`
   - `purlinTotalMassKg`
   - `metalStructuresTotalMassKg = column + purlin`
   - `buildingAreaM2` (earthworks, floors)
   - `wallAreaM2` (walls)
   - `roofAreaM2` (roof)
3. Result contract:
   - `sections`
   - `subtotalRub`
   - `regionCoefficient`
   - `totalRub`
   - `note`
   - `snapshot`

## What Is Not Calculated Yet

1. `Бетонные работы`
2. `Окна/двери/ворота`
3. Engineering sections from matrix (`ВК`, `ОВ`, `ЭОМ`, etc.)
4. `Дополнительные работы`

## Current Assumptions

1. `mounting-cost-reference.generated.ts` is generated from Excel section 6 and region coefficients.
2. Price tier thresholds are taken from matrix notes (`до 15`, `до 30`, `до 100`, `свыше 100`).
3. Frame type branch is selected automatically:
   - `lstk` branch for LSTK frame
   - `sort` branch for sort/regular steel frame
4. Region is inferred from city by keyword mapping with fallback to `sverdlovsk-tyumen`.
5. `floorType` is currently mapped to `slab-150` by default.

## Regeneration Path

1. Source file: `Матрица 2026 СМР.xlsx`
2. Script: `scripts/extract_mounting_cost_reference.py`
3. Output: `src/domain/mounting-cost/model/mounting-cost-reference.generated.ts`

## Integration Notes

1. New UI tab: `СМР` (`tab-mounting`).
2. Existing shared field names from `UnifiedInputState` are preserved.
3. New domain layer lives in `src/domain/mounting-cost/model`.
