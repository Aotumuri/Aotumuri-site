# 制作物・OSS実績の掲載根拠

確認日：2026年10月19日（日本時間）。

## OpenFront

本人の指定に合わせ、定期更新を必要としない固定表示にしています。

- **Translation Lead（2026年10月現在）**：本人がこのサイトへの掲載用に提供した役割と時点。
- **マージ済みPR 100+**：本人指定の表現。以前のAPI確認でも100件超のマージを確認済みです。正確な件数やオープン数・未マージ数は表示しません。
- [#786: Patterned territory](https://github.com/openfrontio/OpenFrontIO/pull/786)：領土のパターン表示。
- [#412: Add quick chat](https://github.com/openfrontio/OpenFrontIO/pull/412)：クイックチャットの追加。

代表PR2件は本人指定です。GitHub APIでも作者がAotumuriであり、マージ済みであることを確認しました。

同じOpenFront欄に、本人指定のMLS Projectリンクを掲載します。

- [Crowdin](https://crowdin.com/project/openfront-mls)
- [Discord](https://discord.gg/5V7Avk7FRd)

Discordへの参加操作は行っていません。リンク先の参加やログインを閲覧条件にせず、そのまま外部リンクとして案内します。

## 自分で作ったもの

本人が指定した以下の12件だけを掲載します。いずれも本人所有・公開・非forkであることを確認済みです。自動的に制作物を追加する処理はありません。言語はGitHubのリポジトリメタデータ、日本語の説明は公開descriptionまたはREADMEに基づきます。

| リポジトリ | 説明の参照元 |
| --- | --- |
| [TerritoryConquestSimulator](https://github.com/Aotumuri/TerritoryConquestSimulator) | description「自動で動くものが見たい人へ」 |
| [isekai-sim](https://github.com/Aotumuri/isekai-sim) | description「自動で動くものが見たい人へ 2」 |
| [openfront-utility](https://github.com/Aotumuri/openfront-utility) | description・READMEのパターン生成とプレビュー |
| [custom-flag-creator](https://github.com/Aotumuri/custom-flag-creator) | READMEのSVGパーツによる旗の作成 |
| [openfront-game-bot](https://github.com/Aotumuri/openfront-game-bot) | descriptionのDiscord参加リンク検出とゲーム情報表示 |
| [clitl](https://github.com/Aotumuri/clitl) | descriptionのCLIユーティリティ・文字のグラデーション |
| [cli-box-picker](https://github.com/Aotumuri/cli-box-picker) | READMEの選択・複数選択API |
| [cli-box-renderer](https://github.com/Aotumuri/cli-box-renderer) | READMEの枠付きテキスト描画API |
| [cli-box-prompt](https://github.com/Aotumuri/cli-box-prompt) | READMEの選択・自由入力API |
| [path-tracer](https://github.com/Aotumuri/path-tracer) | descriptionのJSON位置情報の可視化 |
| [NotEnoughItems4Sotf](https://github.com/Aotumuri/NotEnoughItems4Sotf) | descriptionとGitHubのmcfunction言語分類 |
| [MoreEasily4Sotf](https://github.com/Aotumuri/MoreEasily4Sotf) | descriptionのSurvival of the Fittest向け進捗等の追加 |

公開内容が確認できなかったMemoxtと、独立した制作物として実体が曖昧だったAI Researchの仮カードは外しました。各制作物のソフトウェア自体をインストール・実行して品質保証したものではありません。

## 更新・検証

毎回の集計を前提にしないため、以前のGitHub API更新スクリプトと正確な件数の保存を外しました。表示内容はJSON・設定ファイルで固定し、定期的な更新は不要です。Skills・Contactは維持し、MLS用Discordを個人の連絡先として転用していません。

サイト側の型チェック・本番ビルドと、パソコン・モバイルでOpenFront・MLSリンクの表示を確認しています。GitHub Pagesへの実デプロイは今回行っていません。
