import { readFileSync } from "node:fs";

const input = readFileSync("./input.txt", "utf-8")
	.replaceAll("\r", "")
	.split("\n");

type PositionStr = `${number},${number}`;
type Elf = PositionStr;

let elves = new Set<Elf>;
for (let y = 0; y < input.length; y++) {
	for (let x = 0; x < input[y].length; x++) {
		if (input[y][x] === '#')
			elves.add(`${x},${y}`,);
	}
}

const getNeighbours = (x: number, y: number) => {
	return {
		NW: `${x - 1},${y - 1}` as const,
		N: `${x},${y - 1}` as const,
		NE: `${x + 1},${y - 1}` as const,
		W: `${x - 1},${y}` as const,
		E: `${x + 1},${y}` as const,
		SW: `${x - 1},${y + 1}` as const,
		S: `${x},${y + 1}` as const,
		SE: `${x + 1},${y + 1}` as const,
	};
};

type Neighbours = ReturnType<typeof getNeighbours>;
const checks: [keyof Neighbours, Array<keyof Neighbours>][] = [
	['N', ['N', 'NE', 'NW']],
	['S', ['S', 'SE', 'SW']],
	['W', ['W', 'NW', 'SW']],
	['E', ['E', 'NE', 'SE']]
];

const getProposedPosition = (elf: Elf): PositionStr => {
	const [x, y] = elf.split(",").map(Number);
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
	const proposals = new Map<PositionStr, Elf[]>;

	// first half of the round
	for (const elf of elves) {
		const P = getProposedPosition(elf);
		if (!proposals.has(P)) proposals.set(P, []);
		proposals.get(P)!.push(elf);
	}

	// second half of the round
	const newElves = new Set<Elf>;
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
		const elfPositions = Array.from(elves, e => e.split(",").map(Number) as [number, number]);
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