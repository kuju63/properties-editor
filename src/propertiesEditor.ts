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

  private static readonly viewType = "propertiesEditor.propertiesEditor";

  constructor(private readonly context: vscode.ExtensionContext) {}

  resolveCustomTextEditor(
    document: vscode.TextDocument,
    webviewPanel: vscode.WebviewPanel,
    token: vscode.CancellationToken
  ): void | Thenable<void> {
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
      console.log("receive message");
    });

    updateWebView();
  }

  private initWebView(webview: vscode.Webview): string {
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.context.extensionUri, "media", "editor.js")
    );
    const nonce = this.getNonce();

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'nonce-${nonce}'">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Sample</title>
    </head>
    <body>
      <input type="text"/>
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
