import { readFileSync } from "node:fs";

type Point = [number, number, number];

const input = readFileSync("./input.txt", "utf-8")
	.replaceAll("\r", "").split("\n")
	.map(line => line.split(",").map(Number) as Point);

const lava = new Set<`${number},${number},${number}`>;

// Find bounds
let minX = Infinity, minY = Infinity, minZ = Infinity;
let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
for (const [x, y, z] of input) {
	if (x < minX) minX = x;
	if (y < minY) minY = y;
	if (z < minZ) minZ = z;

	if (x > maxX) maxX = x;
	if (y > maxY) maxY = y;
	if (z > maxZ) maxZ = z;

	lava.add(`${x},${y},${z}`);
}

let sum = 0;
for (let x = minX - 1; x <= maxX + 1; x++) {
	for (let y = minY - 1; y <= maxY + 1; y++) {
		for (let z = minZ - 1; z <= maxZ + 1; z++) {
			// If this point is air:
			if (lava.has(`${x},${y},${z}`)) continue;
			// Get the neighbours
			let neighbours = 0;
			if (lava.has(`${x},${y - 1},${z}`)) neighbours += 1;
			if (lava.has(`${x},${y + 1},${z}`)) neighbours += 1;
			if (lava.has(`${x - 1},${y},${z}`)) neighbours += 1;
			if (lava.has(`${x + 1},${y},${z}`)) neighbours += 1;
			if (lava.has(`${x},${y},${z - 1}`)) neighbours += 1;
			if (lava.has(`${x},${y},${z + 1}`)) neighbours += 1;
			sum += neighbours;
		}
	}
}

console.log(sum);