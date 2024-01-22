import * as vscode from "vscode";
import { escapeAscii, getNonce, unescapeAscii } from "./util";

export class PropertiesEditorProvider
	implements vscode.CustomTextEditorProvider
{
	public static register(context: vscode.ExtensionContext): vscode.Disposable {
		const provider = new PropertiesEditorProvider(context);
		const providerRegistration = vscode.window.registerCustomEditorProvider(
			PropertiesEditorProvider.viewType,
			provider,
		);
		return providerRegistration;
	}

	private static readonly viewType = "properties.editor";

	constructor(private readonly context: vscode.ExtensionContext) {}

	public async resolveCustomTextEditor(
		document: vscode.TextDocument,
		webviewPanel: vscode.WebviewPanel,
		_token: vscode.CancellationToken,
	): Promise<void> {
		console.log("call resolveCustomTextEditor");
		webviewPanel.webview.options = {
			enableScripts: true,
		};
		function updateWebView() {
			console.log("call updateWebView", unescapeAscii(document.getText()));
			webviewPanel.webview.postMessage({
				command: "update",
				text: unescapeAscii(document.getText()),
			});
		}

		function applyChanges(changes: string) {
			console.log("source text", changes);
			const asciiText = escapeAscii(changes);
			console.log("escaped text", asciiText);
			const edit = new vscode.WorkspaceEdit();
			edit.replace(
				document.uri,
				new vscode.Range(
					document.positionAt(0),
					document.positionAt(document.getText().length),
				),
				asciiText,
			);
			vscode.workspace.applyEdit(edit);
		}

		webviewPanel.webview.html = this.initWebView(webviewPanel.webview);

		webviewPanel.webview.onDidReceiveMessage((e) => {
			console.log("receive message", e);
			switch (e.command) {
				case "save":
					console.log("save event", e.text);
					applyChanges(e.text);
					document.save();
					return;
			}
		});

		updateWebView();
	}

	private initWebView(webview: vscode.Webview): string {
		const scriptUri = webview.asWebviewUri(
			vscode.Uri.joinPath(this.context.extensionUri, "media", "editor.js"),
		);
		const vscodeStylesUri = webview.asWebviewUri(
			vscode.Uri.joinPath(this.context.extensionUri, "media", "vscode.css"),
		);
		const extensionStylesUri = webview.asWebviewUri(
			vscode.Uri.joinPath(this.context.extensionUri, "media", "style.css"),
		);
		const nonce = getNonce();

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
}
