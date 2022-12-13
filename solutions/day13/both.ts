import { readFileSync } from "node:fs";

type Packet = (number | Packet)[];

const pairs = readFileSync("./input.txt", "utf-8")
	.replaceAll("\r", "")
	.split("\n\n")
	.map(pair => pair.split("\n").map(x => JSON.parse(x) as Packet));

const compare = (left: number | Packet, right: number | Packet): -1 | 0 | 1 => {
	// If both values are integers,
	if (typeof left === 'number' && typeof right === 'number') {
		// If the left integer is lower than the right integer, the inputs are in the right order.
		if (left < right) return 1;
		// If the left integer is higher than the right integer, the inputs are not in the right order.
		if (left > right) return -1;
		// Otherwise, the inputs are the same integer; continue checking the next part of the input.
		return 0;
	} else if (Array.isArray(left) && Array.isArray(right)) {
		// If both values are lists, compare the first value of each list, then the second value, and so on.
		for (let i = 0; i < left.length || i < right.length; i++) {
			// If the left list runs out of items first, the inputs are in the right order.
			if (i >= left.length) return 1;
			// If the right list runs out of items first, the inputs are not in the right order.
			if (i >= right.length) return -1;
			const comparison = compare(left[i], right[i]);
			if (comparison !== 0) return comparison;
		}

		return 0;
	} else {
		// If exactly one value is an integer, convert the integer to a list which contains that integer as its only value,
		const newLeft = Array.isArray(left) ? left : [left];
		const newRight = Array.isArray(right) ? right : [right];
		// then retry the comparison.
		return compare(newLeft, newRight);
	}
};

let partOne = 0;
for (let i = 0; i < pairs.length; i++) {
	const [left, right] = pairs[i];
	if (compare(left, right) === 1) {
		partOne += (i + 1);
	}
}

console.log('Part 1:', partOne);

const packets = pairs.flat();
const dividers = [
	[[2]],
	[[6]],
];

packets.push(...dividers);
packets.sort((a, b) => compare(b, a));
const dividerIndices = dividers.map(d => packets.indexOf(d) + 1);
console.log('Part 2:', dividerIndices.reduce((a, b) => a * b));
