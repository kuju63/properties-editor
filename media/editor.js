(function () {
  const vscode = acquireVsCodeApi();

  const editor = /** @type {HTMLTextAreaElement} */ (document.querySelector("#txta-properties"));

  window.addEventListener('message', event => {
    const message = event.data;
    switch (message.command) {
      case 'update':
        const text = message.text;
        console.log(text);
        editor.value = text;
        break;
    }
  });

  // Handle user input event in the textarea for send message to extension.
  editor.addEventListener('input', (e) => {
    vscode.postMessage({
      command: 'dirty-change',
      text: editor.value
    });
  });
})();
