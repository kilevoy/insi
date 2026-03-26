import { expect, test } from '@playwright/test'

test('renders mounting tab with inline SMR controls and section table', async ({ page }) => {
  await page.goto('/')

  await page.getByTestId('tab-mounting').click({ force: true })
  await expect(page.getByTestId('tab-mounting')).toHaveClass(/active/)
  await expect(page.getByTestId('mounting-panel')).toBeVisible()

  await expect(page.getByText('Параметры СМР')).toBeVisible()
  await expect(page.getByText('Тип пола')).toBeVisible()
  await expect(page.getByText('Стоимость по разделам')).toBeVisible()
  await expect(page.getByText(/Монтаж металлокнтсрукций/i).first()).toBeVisible()
})

test('does not show SMR parameters block in left panel', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByText('Параметры СМР')).toHaveCount(0)
  await page.getByTestId('tab-mounting').click({ force: true })
  await expect(page.getByText('Параметры СМР')).toHaveCount(1)
})
