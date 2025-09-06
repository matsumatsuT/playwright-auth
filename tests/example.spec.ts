import { test, expect } from '@playwright/test';
import path from 'path';

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

test("明細作成テスト", async({page}) => {
  // マネーフォワード経費にアクセス　〜　明細作成画面に遷移
  await page.goto('https://expense.moneyforward.com/');
  await page.getByLabel('グローバルナビゲーション').getByRole('link', { name: '経費精算' }).click();
  await page.getByRole('link', { name: '明細一覧' }).click();
  await page.getByRole('button', { name: '新規登録' }).click();
  await page.getByRole('link', { name: '領収書', exact: true }).click();
  await expect(page.getByRole('heading'),{message: "領収書から登録画面に遷移できていません"}).toContainText('領収書から登録');
  console.log("領収書から登録画面に遷移");
  
  // ファイルのアップロード
  const fileInput = page.locator('input[type="file"]');
  const filePath = path.resolve(__dirname, '../test-files/test.pdf');
  await fileInput.setInputFiles(filePath);
  console.log('ファイルをアップロードしました');

  // テンプレートの選択　〜　明細の入力完了
  await page.locator('#ex_transaction_ex_transaction_template_id').selectOption({ label: 'anthropic' });
  await expect(page.locator('#ex_transaction_remark')).toHaveValue('anthropic');
  await page.getByText('電子 (PDF,JPEG等) で受領した領収書').click();
  await page.locator('#ex_transaction_recognized_at').click();
  await page.getByRole('cell', { name: '1', exact: true }).first().click();
  await page.getByRole('button', { name: '作成する' }).click();
  await expect(page.locator('#ex-transaction-form-alert-container'),{message: "経費の作成に失敗しました。"}).toContainText('経費を作成しました。');
  console.log("明細を作成しました。");
});


