# takakeibo admin

### 環境構築

- Firebaseの `プロジェクトの設定 > サービスアカウント > 秘密鍵の生成 > キーを生成` から認証情報を生成し、 `serviceAccountKey.json` というファイル名で `admin` 直下に置いておく

```bash
$ yarn install
$ cp .env.example .env # その後、Firebaseの認証情報を追記する
```

### 初期データの流し込み

```bash
$ yarn migrate
```
