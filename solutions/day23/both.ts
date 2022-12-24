import { readFileSync } from "node:fs";

const input = readFileSync("./input.txt", "utf-8")
	.replaceAll("\r", "")
	.split("\n");

const hashPosition = (x: number, y: number) => ((x + 2**7) << 8) | (y + 2**7);
const decodePosition = (position: number) => {
	return [
		((position & 0xFF00) >> 8) - 2**7,
		(position & 0x00FF) - 2**7
	];
};

let elves = new Set<number>;
for (let y = 0; y < input.length; y++) {
	for (let x = 0; x < input[y].length; x++) {
		if (input[y][x] === '#')
			elves.add(hashPosition(x, y));
	}
}

const getNeighbours = (x: number, y: number) => {
	return {
		NW: hashPosition(x - 1, y - 1),
		N: hashPosition(x, y - 1),
		NE: hashPosition(x + 1, y - 1),
		W: hashPosition(x - 1, y),
		E: hashPosition(x + 1, y),
		SW: hashPosition(x - 1, y + 1),
		S: hashPosition(x, y + 1),
		SE: hashPosition(x + 1, y + 1),
	};
};

type Neighbours = ReturnType<typeof getNeighbours>;
const checks: [keyof Neighbours, Array<keyof Neighbours>][] = [
	['N', ['N', 'NE', 'NW']],
	['S', ['S', 'SE', 'SW']],
	['W', ['W', 'NW', 'SW']],
	['E', ['E', 'NE', 'SE']]
];

const getProposedPosition = (elf: number): number => {
	const [x, y] = decodePosition(elf);
	const neighbours = getNeighbours(x, y);

	if (Object.values(neighbours).every(b => !elves.has(b)))
		return elf;

	for (const [result, adjacents] of checks) {
		if (adjacents.every(d => !elves.has(neighbours[d]))) {
			return neighbours[result];
		}
	}

	return elf;
};

const round = () => {
	const proposals = new Map<number, number[]>;

	// first half of the round
	for (const elf of elves) {
		const P = getProposedPosition(elf);
		if (!proposals.has(P)) proposals.set(P, []);
		proposals.get(P)!.push(elf);
	}

	// second half of the round
	const newElves = new Set<number>;
	for (const [P, elves] of proposals) {
		if (elves.length === 1) {
			// move elf to P
			newElves.add(P);
		} else {
			elves.forEach(e => newElves.add(e));
		}
	}

	const elfMoved = [...elves].some((e) => !newElves.has(e));
	elves = newElves;
	checks.push(checks.shift()!);
	return elfMoved;
};

let i = 1;
while (round() || i <= 10) {
	if (i === 10) {
		// Get the bounds
		const elfPositions = Array.from(elves, decodePosition);
		let minX = Infinity, minY = Infinity;
		let maxX = -Infinity, maxY = -Infinity;
		for (const [x, y] of elfPositions) {
			if (x < minX) minX = x;
			if (y < minY) minY = y;
			if (x > maxX) maxX = x;
			if (y > maxY) maxY = y;
		}

		const width = (maxX - minX) + 1;
		const height = (maxY - minY) + 1;
		const area = width * height;
		console.log('Part 1:', area - elves.size);
	}

	i++;
}

console.log('Part 2:', i);