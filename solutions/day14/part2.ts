import { readFileSync } from "node:fs";

type Formation = { x: number, y: number; }[];

const input = readFileSync("./input.txt", "utf-8")
	.replaceAll("\r", "")
	.split("\n").map((line): Formation => line.split(" -> ").map(coord => {
		const [x, y] = coord.split(",");
		return { x: parseInt(x), y: parseInt(y) };
	}));

type Sand = 1;
const SAND = 1;
type Rock = 2;
const ROCK = 2;

const cave: Record<`${number},${number}`, Sand | Rock> = {};
const set = (x: number, y: number, value: Sand | Rock): void => { cave[`${x},${y}`] = value; };
const readInput = (x: number, y: number): Sand | Rock | undefined => cave[`${x},${y}`];

for (const formation of input) {
	let { x, y } = formation[0];
	set(x, y, ROCK);
	for (const { x: nextX, y: nextY } of formation) {
		while (x !== nextX || y !== nextY) {
			x += Math.sign(nextX - x);
			y += Math.sign(nextY - y);
			set(x, y, ROCK);
		}
	}
}

const coords = Object.keys(cave).map(c => c.split(",").map(m => parseInt(m)));
const maxY = coords.map(([x, y]) => y).reduce((a, b) => Math.max(a, b));

const floorY = maxY + 2;
const get = (x: number, y: number) => y === floorY ? ROCK : readInput(x, y);

const shouldStop = (x: number, y: number) => x === 500 && y === 0;

const getSandCount = () => {
	let result = 0;
	while (true) {
		const currentSand = { x: 500, y: 0 };
		thisSandLoop: while (true) {
			currentSand.y++; // Down
			if (get(currentSand.x, currentSand.y) === undefined) continue thisSandLoop;
			// Left
			currentSand.x--;
			if (get(currentSand.x, currentSand.y) === undefined) continue thisSandLoop;
			// Right
			currentSand.x++;
			currentSand.x++;
			if (get(currentSand.x, currentSand.y) === undefined) continue thisSandLoop;

			// Reset position
			currentSand.x--;
			currentSand.y--;

			// This means it is at rest
			set(currentSand.x, currentSand.y, SAND);
			break thisSandLoop;
		}

		result++;
		if (shouldStop(currentSand.x, currentSand.y)) return result;
	}


};

console.log(getSandCount());