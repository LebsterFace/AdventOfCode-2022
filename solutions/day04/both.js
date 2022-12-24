const fs = require("fs");

const lines = fs.readFileSync("./input.txt", "utf-8")
	.split(/\r?\n/g)
	.map(l => l.split(",").map(x => x.split("-").map(Number)));

let contained = 0;
let overlapping = 0;
for (const [[aStart, aEnd], [bStart, bEnd]] of lines) {
	if (
		(bStart <= aStart && bEnd >= aEnd) ||
		(aStart <= bStart && aEnd >= bEnd)
	) {
		contained++;
	} else if (
		(aStart >= bStart && aStart <= bEnd) ||
		(aEnd >= bStart && aEnd <= bEnd)
	) {
		overlapping++;
	}
}

console.log('Part 1:', contained);
console.log('Part 2:', contained + overlapping);
