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



