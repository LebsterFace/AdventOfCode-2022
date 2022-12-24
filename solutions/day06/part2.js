const fs = require("fs");

const input = fs.readFileSync("./input.txt", "utf-8");
for (let i = 0; i < input.length - 15; i++) {
	const chars = [...input.slice(i, i + 14)];
	if (new Set(chars).size === chars.length) {
		console.log(i + 14);
		break;
	}
}
