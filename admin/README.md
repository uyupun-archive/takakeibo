# takakeibo admin

### 環境構築

1. Firebaseの `プロジェクトの設定 > サービスアカウント > 秘密鍵の生成 > キーを生成` から認証情報を生成する
2. 開発環境の場合、 `serviceAccountKeyDev.json` 、本番環境の場合、 `serviceAccountKeyProd.json` というファイル名で `admin` 直下に置いておく

```bash
$ yarn install
# その後、.envにFirebaseの認証情報を追記する
$ cp .env.example .env
```

### 初期データの流し込み

```bash
$ yarn migrate
```
