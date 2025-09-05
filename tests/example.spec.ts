import { test, expect } from '@playwright/test';

// 保存された認証状態を使用
test.use({ storageState: 'playwright/.auth/moneyforward-state.json' });

test("マネーフォワードのログインテスト（認証状態使用）", async({page}) => {
  console.log("マネーフォワード経費への認証済みアクセステスト開始");
  
  // マネーフォワード経費にアクセス（認証状態は自動的に復元される）
  await page.goto("https://expense.moneyforward.com/");
  await expect(page.getByRole('heading', { name: 'ホーム' })).toBeVisible();
    
  console.log('マネーフォワード経費への認証済みアクセスが成功しました');
  console.log('認証状態が正常に復元され、ログイン後の画面にアクセスできています');
})

test("下書き作成テスト", async({page}) => {
  await page.goto('https://expense.moneyforward.com/');
  await page.getByLabel('グローバルナビゲーション').getByRole('link', { name: '経費精算' }).click();
  await page.getByRole('link', { name: '新規申請' }).click();
  await page.locator('#ex_report_title').fill('経費申請');
  await page.getByRole('link', { name: '領収書', exact: true }).click();
  await expect(page.getByRole('heading')).toContainText('領収書から登録');
  
  await page.locator('#ex_transaction_ex_transaction_template_id').selectOption({ label: 'anthropic' });
  
  await expect(page.locator('#ex_transaction_remark')).toHaveValue('anthropic');
  await page.locator('#ex_transaction_recognized_at').click();
  await page.getByRole('cell', { name: '1', exact: true }).first().click();
  await page.getByRole('button', { name: '作成する' }).click();
});


