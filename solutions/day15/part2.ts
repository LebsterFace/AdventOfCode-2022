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
let minY = Infinity;
let maxY = -Infinity;

for (const { sensor, beacon } of input) {
	set(sensor, Tile.SENSOR);
	set(beacon, Tile.BEACON);

	const distance = manhattan(sensor, beacon);
	minX = Math.min(minX, sensor.x - distance, beacon.x - distance);
	maxX = Math.max(maxX, sensor.x + distance, beacon.x + distance);
	minY = Math.min(minY, sensor.y - distance, beacon.y - distance);
	maxY = Math.max(maxY, sensor.y + distance, beacon.y + distance);

	scans.push({ sensor, distance });
}

scans.sort((a, b) => a.sensor.x - b.sensor.x);

// Returns true if P would be represented by a #
const cannotHaveBeacon = (P: Point) => {
	return scans.find(({ sensor, distance }) => manhattan(sensor, P) <= distance);
};

const beacon_min = 0;
const beacon_max = 4000000;

for (let y = minY; y <= maxY; y++) {
	let x = 0;
	let result;
	while (result = cannotHaveBeacon({ x, y })) {
		const yDiff = Math.abs(result.sensor.y - y);
		x = result.sensor.x + (result.distance - yDiff) + 1;
	}

	if (!(y > beacon_max || y < beacon_min || x > beacon_max || x < beacon_min)) {
		console.log(x * 4000000 + y);
		break;
	}
}