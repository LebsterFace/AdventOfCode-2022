const fs = require("fs");

const bags = fs.readFileSync("./input.txt", "utf-8")
	.split(/\r?\n/g);

const priority = c => "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(c) + 1;

let sum = 0;
for (const bag of bags) {
	const halfway = bag.length / 2;
	const a = [...bag.slice(0, halfway)];
	const b = [...bag.slice(halfway)];
	const shared = a.find(c => b.includes(c));
	sum += priority(shared);
}

console.log(sum);