import { readFileSync } from "node:fs";

const regexp = /^Sensor at x=(?<x1>-?[0-9]+), y=(?<y1>-?[0-9]+): closest beacon is at x=(?<x2>-?[0-9]+), y=(?<y2>-?[0-9]+)$/;

type Point = { x: number, y: number; };
const manhattan = (a: Point, b: Point): number => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

const input = readFileSync("./input.txt", "utf-8")
	.replaceAll("\r", "")
	.split("\n").map((line): { sensor: Point, beacon: Point; } => {
		const { x1, y1, x2, y2 } = line.match(regexp)!.groups!;
		return {
			sensor: { x: parseInt(x1), y: parseInt(y1) },
			beacon: { x: parseInt(x2), y: parseInt(y2) }
		};
	});

enum Tile { SENSOR = 1, BEACON };
const map = new Map<`${number},${number}`, Tile>();

const set = ({ x, y }: Point, value: Tile) => {
	map.set(`${x},${y}`, value);
};

const scans: { sensor: Point, distance: number; }[] = [];

let minX = Infinity;
let maxX = -Infinity;
for (const { sensor, beacon } of input) {
	set(sensor, Tile.SENSOR);
	set(beacon, Tile.BEACON);

	const distance = manhattan(sensor, beacon);
	minX = Math.min(minX, sensor.x - distance, beacon.x - distance);
	maxX = Math.max(maxX, sensor.x + distance, beacon.x + distance);

	scans.push({ sensor, distance });
}

// Returns true if P would be represented by a #
const cannotHaveBeacon = (P: Point): boolean => {
	return scans.some(({ sensor, distance }) => manhattan(sensor, P) <= distance);
};

const y = 2000000;
let count = 0;
for (let x = minX; x <= maxX; x++) {
	if (!map.has(`${x},${y}`) && cannotHaveBeacon({ x, y })) {
		count++;
	}
}

console.log(count);