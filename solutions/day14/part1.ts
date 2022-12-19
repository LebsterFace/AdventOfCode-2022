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
const get = (x: number, y: number): Sand | Rock | undefined => cave[`${x},${y}`];

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
const minX = coords.map(([x, y]) => x).reduce((a, b) => Math.min(a, b));
const maxX = coords.map(([x, y]) => x).reduce((a, b) => Math.max(a, b));
const minY = 0;
const maxY = coords.map(([x, y]) => y).reduce((a, b) => Math.max(a, b));

const OOB = (x: number, y: number) => (
	y > maxY ||
	x > maxX ||
	x < minX ||
	y < minY
);

const getSandCount = () => {
	let result = 0;
	while (true) {
		const currentSand = { x: 500, y: 0 };
		thisSandLoop: while (true) {
			if (OOB(currentSand.x, currentSand.y)) return result;

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
	}
};

console.log(getSandCount());