const fs = require("fs");

const chunkify = (arr, size) => {
	const result = [];
	for (let i = 0; i < arr.length; i += size) {
		result.push(arr.slice(i, i + size));
	}

	return result;
};

const groups = chunkify(fs.readFileSync("./input.txt", "utf-8")
	.split(/\r?\n/g), 3);

const priority = c => "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(c) + 1;

let sum = 0;
for (const [a, b, c] of groups) {
	const shared = [...a].find(t => b.includes(t) && c.includes(t));
	sum += priority(shared);
}

console.log(sum);