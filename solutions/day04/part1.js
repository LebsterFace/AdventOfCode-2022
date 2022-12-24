const fs = require("fs");

const lines = fs.readFileSync("./input.txt", "utf-8")
	.split(/\r?\n/g)
	.map(l => l.split(",").map(x => x.split("-").map(Number)));

let result = 0;
for (const [[aStart, aEnd], [bStart, bEnd]] of lines) {
	if (bStart <= aStart && bEnd >= aEnd) result += 1;
	else if (aStart <= bStart && aEnd >= bEnd) result += 1;
}

console.log(result);
