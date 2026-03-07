# CLAUDE.md

## プロジェクト概要

**Nuxt 3** をベースにした TODOList のサンプルプロジェクト。Nuxt3 および AI 関連の統合を学習するために作成。

## 技術スタック

- **フレームワーク**: Nuxt 3.9.3
- **言語**: TypeScript（strict モード）
- **スタイル**: Tailwind CSS（@nuxtjs/tailwindcss ^6.8.0）
- **ランタイム**: Node.js 22.15.1（必須。20.x 系は非対応）

## 環境要件

> Node バージョンは nvm で管理。**Node 22.15.1 を必ず使用すること**。Node 20.11.1 では依存関係のインストールが失敗する。

```bash
source ~/.nvm/nvm.sh && nvm use 22.15.1
```

## よく使うコマンド

```bash
npm run dev       # 開発サーバー起動（http://localhost:3002）
npm run build     # 本番ビルド
npm run preview   # 本番プレビュー
```

## プロジェクト構成

```
nuxt3-ai-learning/
├── CLAUDE.md
├── app.vue                  # ルートコンポーネント
├── nuxt.config.ts           # Nuxt 設定
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── types/
│   └── todo.ts              # Todo インターフェース & FilterType
├── composables/
│   └── useTodos.ts          # Todo グローバル状態（useState）
├── components/
│   ├── TodoForm.vue         # Todo 追加フォーム
│   └── TodoItem.vue         # Todo 単一アイテムコンポーネント
└── pages/
    └── index.vue            # メインページ
```

## 重要な規約

- 状態管理は Nuxt 組み込みの `useState` を使用し、Pinia は導入しない
- コンポーザブルは `composables/` に配置し、Nuxt が自動インポート
- コンポーネントは `components/` に配置し、Nuxt が自動インポート
- 型定義は `types/` に配置し、`~/types/xxx` でインポート
- 開発ポートは **3002** で固定
