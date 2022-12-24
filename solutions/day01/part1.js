const fs = require("fs");

const file = fs.readFileSync("./input.txt", "utf-8");

const elves = [[]];
for (const line of file.split("\r\n")) {
	if (line === "") {
		elves.push([]);
	} else {
		elves.at(-1).push(parseInt(line));
	}
}

console.log(Math.max(...elves.map(e => e.reduce((a, b) => a + b))));