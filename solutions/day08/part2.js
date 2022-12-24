const fs = require("fs");

const grid = fs.readFileSync("./input.txt", "utf-8")
	.replaceAll(/\r?\n/g, "\n")
	.split("\n")
	.map(line => [...line].map(Number));

const scenicScore = (x, y) => {
	const edges = [
		grid[y].slice(0, x).reverse(),
		grid.map(row => row[x]).slice(0, y).reverse(),
		grid[y].slice(x + 1),
		grid.map(row => row[x]).slice(y + 1),
	];

	return edges.map(edge => {
		const tallerTree = edge.findIndex(tree => tree >= grid[y][x]);
		if (tallerTree === -1) return edge.length;
		return tallerTree + 1;
	}).reduce((a, b) => a * b);
};

let highest = 0;
for (let y = 0; y < grid.length; y++) {
	for (let x = 0; x < grid[y].length; x++) {
		const score = scenicScore(x, y);
		if (score > highest) {
			highest = score;
		}
	}
}

console.log(highest);