import * as vscode from "vscode";

export class PropertiesEditorProvider
  implements vscode.CustomTextEditorProvider
{
  public static register(context: vscode.ExtensionContext): vscode.Disposable {
    const provider = new PropertiesEditorProvider(context);
    const providerRegistration = vscode.window.registerCustomEditorProvider(
      PropertiesEditorProvider.viewType,
      provider
    );
    return providerRegistration;
  }

  private static readonly viewType = "native2ascii.editor";

  constructor(private readonly context: vscode.ExtensionContext) {}

  public async resolveCustomTextEditor(
    document: vscode.TextDocument,
    webviewPanel: vscode.WebviewPanel,
    _token: vscode.CancellationToken
  ): Promise<void> {
    console.log("call resolveCustomTextEditor");
    webviewPanel.webview.options = {
      enableScripts: true,
    };
    function updateWebView() {
      console.log("call updateWebView");
      webviewPanel.webview.postMessage({
        command: "update",
        text: document.getText(),
      });
    }

    webviewPanel.webview.html = this.initWebView(webviewPanel.webview);

    const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument(
      (e) => {
        if (e.document.uri.toString() === document.uri.toString()) {
          updateWebView();
        }
      }
    );

    webviewPanel.onDidDispose(() => {
      changeDocumentSubscription.dispose();
    });

    webviewPanel.webview.onDidReceiveMessage((e) => {
      console.log("receive message", e);
      switch (e.command) {
        case "save":
          console.log("save");
          return;
      }
    });

    updateWebView();
  }

  private initWebView(webview: vscode.Webview): string {
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.context.extensionUri, "media", "editor.js")
    );
    const vscodeStylesUri = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, "media", "vscode.css"));
    const extensionStylesUri = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, "media", "style.css"));
    const nonce = this.getNonce();

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}'">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Sample</title>
      <link href="${vscodeStylesUri}" rel="stylesheet">
      <link href="${extensionStylesUri}" rel="stylesheet">
    </head>
    <body>
      <header>
        <button id="btn-save">Save</button>
      </header>
      <main>
        <div class="scrollable-wrapper">
          <textarea id="txta-properties"></textarea>
        </div>
      </main>
      <script nonce="${nonce}" src="${scriptUri}"></script>
    </body>
    </html>`;
  }

  private getNonce() {
    let text = "";
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 32; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }
}
