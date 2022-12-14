import { readFileSync } from "node:fs";

type Point = { x: number, y: number; };
type Formation = Point[];

const input = readFileSync("./input.txt", "utf-8")
	.replaceAll("\r", "")
	.split("\n").map((line): Formation => line.split(" -> ").map(coord => {
		const [x, y] = coord.split(",");
		return { x: parseInt(x), y: parseInt(y) };
	}));

enum Tile { SAND = 1, ROCK }

const cave = new Map<`${number},${number}`, Tile>;
const set = (x: number, y: number, value: Tile): void => { cave.set(`${x},${y}`, value); };

for (const formation of input) {
	let { x, y } = formation[0];
	set(x, y, Tile.ROCK);
	for (const { x: nextX, y: nextY } of formation) {
		while (x !== nextX || y !== nextY) {
			x += Math.sign(nextX - x);
			y += Math.sign(nextY - y);
			set(x, y, Tile.ROCK);
		}
	}
}

const sands: Point[] = []; // To track which tiles to remove before part 2

const solve = (stop: (sand: Point) => boolean, collides: (sand: Point) => boolean) => {
	let result = 0;
	while (true) {
		const sand: Point = { x: 500, y: 0 };
		while (true) {
			sand.y++; // Down
			if (stop(sand)) return result;
			if (!collides(sand)) continue;
			// Left
			sand.x--;
			if (!collides(sand)) continue;
			// Right
			sand.x += 2;
			if (!collides(sand)) continue;

			// Reset position
			sand.x--;
			sand.y--;

			// This means it is at rest
			sands.push(sand);
			set(sand.x, sand.y, Tile.SAND);
			break; // We did not meet stop condition
		}

		result++;
		if (stop(sand)) return result;
	}
};

const maxY = Array.from(cave.keys(), c => parseInt(c.split(",")[1])).reduce((a, b) => Math.max(a, b));
console.log('Part 1:', solve(
	({ x, y }) => y > maxY,
	({ x, y }) => cave.has(`${x},${y}`)
));

for (const { x, y } of sands)
	cave.delete(`${x},${y}`);

console.log('Part 2:', solve(
	({ x, y }) => x === 500 && y === 0,
	({ x, y }) => y === maxY + 2 || cave.has(`${x},${y}`)
));