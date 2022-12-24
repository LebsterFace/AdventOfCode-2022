const fs = require("fs");

const expandRange = (start, end) => {
	const result = [];
	for (let i = start; i <= end; i++) {
		result.push(i);
	}

	return result;
};

const lines = fs.readFileSync("./input.txt", "utf-8")
	.split(/\r?\n/g)
	.map(l => l.split(",").map(x => expandRange(...x.split("-").map(Number))));


let result = 0;
for (const [a, b] of lines) {
	if (a.some(v => b.includes(v))) result++;
}

console.log(result);
