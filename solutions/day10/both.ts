import { readFileSync } from "node:fs";
import font from "./letters.json";

const WIDTH = 40;
const HEIGHT = 6;
const CRT = Array.from({ length: HEIGHT }, () => Array.from({ length: WIDTH }, () => ' '));

const input = readFileSync("./input.txt", "utf-8")
	.replaceAll("\r", "")
	.split("\n")
	.map(line => line.split(" ") as ["addx", `${number}`] | ["noop"]);

let X = 1;
let cycle = 0;
let sum = 0;
const nextCycle = () => {
	const row = Math.floor(cycle / WIDTH);
	const column = cycle % WIDTH;
	if (X - 1 <= column && X + 1 >= column) {
		CRT[row][column] = '#';
	}

	cycle += 1;
	if (cycle % 40 === 20) {
		sum += X * cycle;
	}
};

for (const [instruction, argument] of input) {
	if (instruction === "addx") {
		nextCycle();
		nextCycle();
		X += parseInt(argument);
	} else if (instruction === "noop") {
		nextCycle();
	}
}

const ocr = () => {
	let result = '';
	for (let i = 0; i < WIDTH / font.character_width; i++) {
		const lines = CRT.map(line => line.slice(i * font.character_width, (i + 1) * font.character_width));
		const string = lines.map(l => l.join('')).join('\n');
		// @ts-expect-error
		const letter = font[string];
		if (!letter) throw new Error('Unrecognised letter:\n' + string.replaceAll("#", '█').replaceAll(/./g, "$&".repeat(3)));
		result += letter;
	}

	return result;
};

console.log('Part 1:', sum);
console.log('Part 2:', ocr());