const fs = require("fs");

const [towersInput, movesInput] = fs.readFileSync("./input.txt", "utf-8")
	.replaceAll('\r', '')
	.split('\n\n');

const rows = towersInput.split('\n').slice(0, -1).map(line => line
	.replaceAll("    ", "-") // Four spaces indicates blank
	.replaceAll(" ", "") // Other spaces are separators
	.replaceAll("[", "") // Brackets are decorative
	.replaceAll("]", "")
	// Result here will be -D- for example line 1
	.split("")); // Split the string into an array of characters

// Rearrange rows -> columns
const part1_towers = Array.from({ length: rows[0].length }, () => []);
const part2_towers = Array.from({ length: rows[0].length }, () => []);
for (let i = 0; i < rows[0].length; i++) {
	for (const row of rows) {
		if (row[i] !== '-') {
			part1_towers[i].push(row[i]);
			part2_towers[i].push(row[i]);
		}
	}
}

// Perform moves
for (const line of movesInput.split('\n')) {
	let { amount, start, end } = line.match(/^move (?<amount>\d+?) from (?<start>\d+?) to (?<end>\d+?)$/).groups;
	amount = parseInt(amount);
	start = parseInt(start) - 1;
	end = parseInt(end) - 1;

	const p1 = part1_towers[start].splice(0, amount).reverse();
	part1_towers[end].unshift(...p1);

	const p2 = part2_towers[start].splice(0, amount);
	part2_towers[end].unshift(...p2);
}

console.log('Part 1:', part1_towers.map(t => t[0]).join(''));
console.log('Part 2:', part2_towers.map(t => t[0]).join(''));
