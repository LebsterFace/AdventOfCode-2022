import { readFileSync } from "node:fs";

const [map, instructionsString] = readFileSync("./input.txt", "utf-8")
	.replaceAll("\r", "")
	.split("\n\n");

const walls = new Map<`${number},${number}`, boolean>;
const lines = map.split("\n");
let position: `${number},${number}` = `-1,-1`;

for (let y = 0; y < lines.length; y++) {
	const row = lines[y];
	for (let x = 0; x < row.length; x++) {
		const character = row[x];
		if (character === ' ') continue;
		const key = `${x},${y}` as const;
		if (position === '-1,-1') position = key;
		walls.set(key, character === '#');
	}
}

// Facing is 0 for right (>), 1 for down (v), 2 for left (<), and 3 for up (^)
let facing = 0;

const decodeString = (s: `${number},${number}`): [number, number] => s.split(",").map(Number) as [number, number];

const move = (position: `${number},${number}`, facing: number) => {
	const [x, y] = decodeString(position);
	if (facing === 0) return `${x + 1},${y}` as const;
	if (facing === 2) return `${x - 1},${y}` as const;
	if (facing === 1) return `${x},${y + 1}` as const;
	if (facing === 3) return `${x},${y - 1}` as const;
	throw new Error("Invalid direction");
};

for (const instruction of instructionsString.split(/([RL])/g) as Array<"R" | "L" | `${number}`>) {
	if (instruction === 'R') {
		if (facing === 3) facing = -1;
		facing += 1;
	} else if (instruction === 'L') {
		if (facing === 0) facing = 4;
		facing -= 1;
	} else {
		const distance = parseInt(instruction);
		for (let i = 0; i < distance; i++) {
			let next_tile = move(position, facing);
			if (!walls.has(next_tile)) {
				// If going off the edge, wrap
				const opposite_dir = (facing + 2) % 4;
				do {
					next_tile = move(next_tile, opposite_dir);
				} while (walls.has(next_tile));
				next_tile = move(next_tile, facing);
			}

			if (walls.get(next_tile)) {
				// Stop this instruction
				break;
			} else {
				// Move to the next tile
				position = next_tile;
			}
		}
	}
}

const [x, y] = decodeString(position);
console.log(1000 * (y + 1) + 4 * (x + 1) + facing);
