const getNonce = () => {
	let text = "";
	const possible =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
};

const escapeAscii = (text: string): string => {
	return text
		.split("")
		.map((c) => {
			if (c.charCodeAt(0) > 127) {
				return `\\u${c.charCodeAt(0).toString(16)}`;
			} else {
				return c;
			}
		})
		.join("");
};

const unescapeAscii = (text: string): string => {
	return text.replace(/\\u([a-fA-F0-9]{4})/g, (_, hex) => {
		return String.fromCharCode(parseInt(hex, 16));
	});
};

export { getNonce, escapeAscii, unescapeAscii };
