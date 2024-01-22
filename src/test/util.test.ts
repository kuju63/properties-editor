import * as assert from "assert";
import { escapeAscii, unescapeAscii } from "../util";

suite("Util Test Suite", () => {
	test("escape native text", () => {
		assert.strictEqual(
			"abc123\\u3042\\u3044\\u3046\\u3048\\u304a",
			escapeAscii("abc123あいうえお"),
		);
	});
	test("unescape ascii text", () => {
		assert.strictEqual(
			"abc123あいうえお",
			unescapeAscii("abc123\\u3042\\u3044\\u3046\\u3048\\u304a"),
		);
	});
});
