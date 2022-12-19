import { readFileSync } from "node:fs";

type Point = [number, number, number];
type PointStr = `${number},${number},${number}`;

const input = readFileSync("./input.txt", "utf-8")
	.replaceAll("\r", "").split("\n")
	.map(line => line.split(",").map(Number) as Point);

const lava = new Set<PointStr>;

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

const inBounds = (p: PointStr) => {
	const [x, y, z] = p.split(",").map(Number);
	return (
		x >= minX && x <= maxX &&
		y >= minY && y <= maxY &&
		z >= minZ && z <= maxZ
	);
};

const getNeighbours = (location: PointStr): PointStr[] => {
	const [x, y, z] = location.split(",").map(Number);
	return ([
		`${x},${y - 1},${z}`,
		`${x},${y + 1},${z}`,
		`${x - 1},${y},${z}`,
		`${x + 1},${y},${z}`,
		`${x},${y},${z - 1}`,
		`${x},${y},${z + 1}`
	] as PointStr[]);
};

minX -= 1;
minY -= 1;
minZ -= 1;
maxX += 1;
maxY += 1;
maxZ += 1;

const already_processed = new Set<PointStr>;
const queue: PointStr[] = [`${minX},${minY},${minZ - 1}`];
let sum = 0;
while (queue.length > 0) {
	const current = queue.shift()!;
	if (!already_processed.has(current)) {
		already_processed.add(current);
		const neighbours = getNeighbours(current);
		sum += neighbours.filter(p => lava.has(p)).length;
		queue.push(...neighbours.filter(p => inBounds(p) && !lava.has(p)));
	}
}

console.log(sum);