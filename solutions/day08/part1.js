const fs = require("fs");

const grid = fs.readFileSync("./input.txt", "utf-8")
	.replaceAll(/\r?\n/g, "\n")
	.split("\n")
	.map(line => [...line].map(Number));

const isVisible = (x, y) => {
	const edges = [
		grid[y].slice(0, x),
		grid.map(row => row[x]).slice(0, y),
		grid[y].slice(x + 1),
		grid.map(row => row[x]).slice(y + 1),
	];

	return edges.some(dir => dir.every(tree => tree < grid[y][x]));
};

let sum = 0;
for (let y = 0; y < grid.length; y++) {
	for (let x = 0; x < grid[y].length; x++) {
		if (isVisible(x, y)) {
			sum += 1;
		}
	}
}

console.log(sum);