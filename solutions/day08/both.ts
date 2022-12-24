import { readFileSync } from "node:fs";

const grid = readFileSync("./input.txt", "utf-8")
	.replaceAll(/\r?\n/g, "\n")
	.split("\n")
	.map(line => [...line].map(Number));

const getEdges = (x: number, y: number) => {
	return [
		grid[y].slice(0, x).reverse(),
		grid.map(row => row[x]).slice(0, y).reverse(),
		grid[y].slice(x + 1),
		grid.map(row => row[x]).slice(y + 1),
	];
};

const isVisible = (inputHeight: number, edges: number[][]) =>
	edges.some(dir => dir.every(tree => tree < inputHeight));

const scenicScore = (inputHeight: number, edges: number[][]) =>
	edges.map(edge => {
		const tallerTree = edge.findIndex(tree => tree >= inputHeight);
		return tallerTree === -1 ? edge.length : tallerTree + 1;
	}).reduce((a, b) => a * b);

let mostScenic = 0;
let visibleCount = 0;
for (let y = 0; y < grid.length; y++) {
	for (let x = 0; x < grid[y].length; x++) {
		const edges = getEdges(x, y);
		const inputHeight = grid[y][x];

		mostScenic = Math.max(mostScenic, scenicScore(inputHeight, edges));
		if (isVisible(inputHeight, edges)) visibleCount++;
	}
}

console.log('Part 1:', visibleCount);
console.log('Part 2:', mostScenic);