# Welcome to your VS Code Extension

!!! Note

    このファイルは`vsc-extension-quickstart.md`からGitHub Copilotを使用して翻訳されています。

## What's in the folder

* このフォルダには、拡張機能に必要なすべてのファイルが含まれています。
* `package.json` - これは、拡張機能とコマンドを宣言するマニフェストファイルです。
  * サンプルプラグインはコマンドを登録し、そのタイトルとコマンド名を定義します。この情報を使用して、VS Codeはコマンドパレットにコマンドを表示できます。まだプラグインをロードする必要はありません。
* `src/extension.ts` - これは、コマンドの実装を提供する主要なファイルです。
  * このファイルは`activate`という一つの関数をエクスポートします。これは、拡張機能が最初にアクティブ化されたとき（この場合、コマンドを実行するとき）に呼び出されます。`activate`関数内で`registerCommand`を呼び出します。
  * コマンドの実装を含む関数を`registerCommand`の第二パラメータとして渡します。

## すぐに始める

* `F5`を押すと、拡張機能がロードされた新しいウィンドウが開きます。
* コマンドパレットからコマンドを実行します。(`Ctrl+Shift+P`またはMacでは`Cmd+Shift+P`を押し、`Hello World`と入力します。)
* `src/extension.ts`内のコードにブレークポイントを設定して、拡張機能をデバッグします。
* デバッグコンソールで拡張機能からの出力を見つけます。

## 変更を加える

* `src/extension.ts`のコードを変更した後、デバッグツールバーから拡張機能を再起動できます。
* また、拡張機能をロードして変更を反映するために、VS Codeウィンドウを再読み込み（`Ctrl+R`またはMacでは`Cmd+R`）することもできます。

## APIを探索する

* `node_modules/@types/vscode/index.d.ts`ファイルを開くと、APIの全セットを開くことができます。

## テストを実行する

* `npm run test`を実行すると、拡張機能のテストが実行されます。
* テストは[`test/extension.test.ts`](test/extension.test.ts)にあります。ここでは、拡張機能のテストを追加できます。
* テストはMochaとVS Codeのテストランナーを使用して実行されます。

## パブリッシュする

* 拡張機能をパブリッシュするには、[`vsce`](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)を使用します。

## その他

* VS Code APIの詳細については、[VS Code Extensibility Reference](https://code.visualstudio.com/api)を参照してください。
* さまざまな拡張機能の例については、[VS Code Extension Samples](https://github.com/Microsoft/vscode-extension-samples)を参照してください。
