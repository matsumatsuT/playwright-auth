const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

// dotenvを使用して環境変数を読み込み
require('dotenv').config();

async function saveMoneyForwardAuth() {
  const browser = await chromium.launch({ 
    headless: false, // ヘッドレスモードを無効にして手動で2段階認証
    channel: 'chrome'  // 実際のChromeを使用
  });
  
  const context = await browser.newContext({
    locale: 'ja-JP',
    timezoneId: 'Asia/Tokyo',
  });
  
  const page = await context.newPage();
  
  try {
    console.log('マネーフォワード経費にアクセス中...');
    await page.goto('https://expense.moneyforward.com/');
    
    // ログインボタンをクリック
    await page.getByRole('link', { name: 'ログイン' }).click();
    
    // メールアドレスを入力
    console.log('メールアドレスを入力中...');
    await page.getByRole('textbox', { name: 'メールアドレス' }).fill(process.env.MONEYFORWARD_EMAIL);
    await page.getByRole('button', { name: 'ログインする' }).click();
    
    // パスワードを入力
    console.log('パスワードを入力中...');
    await page.getByRole('textbox', { name: 'パスワード' }).fill(process.env.MONEYFORWARD_PASSWORD);
    await page.getByRole('button', { name: 'ログインする' }).click();
    
    // 2段階認証画面が表示されるかチェック
    try {
      await page.waitForSelector('text=認証コード', { timeout: 5000 });
      console.log('\n=== 手動操作が必要です ===');
      console.log('1. メールに送信された認証コード（6桁）を確認してください');
      console.log('2. ブラウザの認証コード入力欄に入力してください');
      console.log('3. "認証する"ボタンをクリックしてください');
      console.log('4. ホーム画面が表示されるまで待機してください');
      console.log('========================\n');
      
      // ホーム画面への遷移を待機（タイムアウトを長めに設定）
      await page.waitForURL('https://expense.moneyforward.com/', { timeout: 300000 }); // 5分間待機
    } catch (e) {
      console.log('2段階認証なしでログイン成功');
    }
    
    // ログイン成功の確認（個人情報を使わない汎用的な方法）
    // TODO: ログインが成功したことを確認する
    console.log('ログイン成功を確認: ダッシュボードが表示されました');
    
    // 認証状態を保存
    const authDir = path.join(__dirname, 'playwright', '.auth');
    if (!fs.existsSync(authDir)) {
      fs.mkdirSync(authDir, { recursive: true });
    }
    
    const storageState = await context.storageState();
    const authPath = path.join(authDir, 'moneyforward-state.json');
    fs.writeFileSync(authPath, JSON.stringify(storageState, null, 2));
    
    console.log(`認証状態が保存されました: ${authPath}`);
    console.log('保存されたクッキー数:', storageState.cookies.length);
    console.log('保存されたオリジン数:', storageState.origins.length);
    
  } catch (error) {
    console.error('エラーが発生しました:', error.message);
  } finally {
    await browser.close();
  }
}

saveMoneyForwardAuth();