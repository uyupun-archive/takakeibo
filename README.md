<img src="public/logo.png" width="200px">

**Easily & Simply & Immediately**

## 環境構築

### 管理操作

- Firestoreの新規構築時に必要
- [admin](./admin/README.md) を参照

### 開発環境

```bash
$ yarn install
# 実行後、Firebaseの認証情報を追記する
$ cp .env.local.example .env.local
$ yarn dev
```

### 本番環境

- Basic認証
  - ID: `uyupun`
  - パスワード: `takashiasuka`

```bash
# 実行後、Firebaseの認証情報を追記する
$ cp .env.local.example .env.local
# 実行後、Basic認証の認証情報を追記する
$ cp .env.production.local.example .env.production.local
# サーバの起動
$ make up
# サーバの終了
$ make down
# プロセスの確認
$ make ps
```

### 使用技術

<img src="architecture.png" width="700px">

### リンク

- [Figma](https://www.figma.com/file/kOALoH5sNvMtIAhQvHTTyb/takakeibo)
