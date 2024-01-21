(function () {
  const vscode = acquireVsCodeApi();

  const editor = /** @type {HTMLTextAreaElement} */ (document.querySelector("#txta-properties"));

  document.querySelector('#btn-save').addEventListener('click', (e) => {
    vscode.postMessage({
      command: 'save',
      text: editor.value
    });
  });

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
})();
