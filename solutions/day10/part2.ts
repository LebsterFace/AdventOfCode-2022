import { readFileSync } from "node:fs";

const WIDTH = 40;
const HEIGHT = 6;
const CRT = Array.from({ length: HEIGHT }, () => Array.from({ length: WIDTH }, () => '.'));

const input = readFileSync("./input.txt", "utf-8")
	.replaceAll("\r", "")
	.split("\n")
	.map(line => line.split(" ") as ["addx", `${number}`] | ["noop"]);

let X = 1;
let cycle = 0;

const pixelToDraw = () => {
	const column = cycle % WIDTH;
	return X - 1 <= column && X + 1 >= column ? '█' : ' ';
};

const drawPixel = () => {
	const row = Math.floor(cycle / WIDTH);
	const column = cycle % WIDTH;
	CRT[row][column] = pixelToDraw().repeat(2);
};

const nextCycle = () => {
	drawPixel();
	cycle += 1;
};

for (const [instruction, argument] of input) {
	if (instruction === "addx") {
		const value = parseInt(argument);
		nextCycle();
		nextCycle();
		X += value;
	} else if (instruction === "noop") {
		nextCycle();
	} else {
		throw new Error(`Unknown instruction ${instruction}`);
	}
}

console.log(CRT.map(row => row.join('')).join('\n'));