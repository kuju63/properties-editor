(function () {
  const vscode = acquireVsCodeApi();

  window.addEventListener('message', event => {
    const message = event.data;
    switch (message.command) {
      case 'update':
        const text = message.text;
        console.log(text);
        updateContent(text);
        break;
    }
  });
})();
