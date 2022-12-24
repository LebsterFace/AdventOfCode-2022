const fs = require("fs");

const input = fs.readFileSync("./input.txt", "utf-8");
for (let i = 0; i < input.length - 5; i++) {
	const chars = [...input.slice(i, i + 4)];
	if (new Set(chars).size === chars.length) {
		console.log(i + 4);
		break;
	}
}
