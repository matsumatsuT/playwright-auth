import { test, expect } from '@playwright/test';

// テスト実行時に指定したファイルのcookieを使用する
test.use({ storageState: 'playwright/.auth/amazon-state.json' });

test("amazonのログインテスト", async({page}) => {
  console.log("テスト開始");
  
  // Amazonにアクセス（認証状態は自動的に復元される）
  await page.goto("https://www.amazon.co.jp");
  
  // 「ログイン」リンクが表示されるかチェック（ログインされていない場合に表示される）
  const loginLink = page.getByLabel('プライマリ').getByRole('link', { name: 'ログイン', exact: true });
  
  // ログインリンクが表示されないことを確認（ログインできている証拠）
  await expect(loginLink,{message: "ログインリンクが表示されているので認証ができていません。"}).not.toBeVisible({ timeout: 5000 });
  
  // ユーザーアカウント情報が表示されていることを確認
  const accountText = await page.locator('#nav-link-accountList').textContent();

  // それ以外の場合は名前をログに表示してテストをパス
  console.log('ログイン済みユーザー名:', accountText);
})



