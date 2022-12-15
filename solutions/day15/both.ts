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

const scans: { sensor: Point, beacon: Point; distance: number; }[] = [];

let minX = Infinity;
let maxX = -Infinity;
let minY = Infinity;
let maxY = -Infinity;

for (const { sensor, beacon } of input) {
	set(sensor, Tile.SENSOR);
	set(beacon, Tile.BEACON);

	const distance = manhattan(sensor, beacon);
	minX = Math.min(minX, sensor.x - distance, beacon.x - distance);
	minY = Math.min(minY, sensor.y - distance, beacon.y - distance);
	maxX = Math.max(maxX, sensor.x + distance, beacon.x + distance);
	maxY = Math.max(maxY, sensor.y + distance, beacon.y + distance);

	scans.push({ sensor, beacon, distance });
}

scans.sort((a, b) => a.sensor.x - b.sensor.x);

// Returns true if P would be represented by a #
const cannotHaveBeacon = (P: Point) => {
	return scans.find(({ sensor, distance }) => manhattan(sensor, P) <= distance);
};

const beacon_max = 4000000;
for (let y = minY; y <= maxY; y++) {
	if (y === 2000000) {
		let count = 0;
		let x = minX;

		while (x <= maxX) {
			const result = cannotHaveBeacon({ x, y });
			if (result) {
				const newX = result.sensor.x + result.distance - Math.abs(result.sensor.y - y) + 1;
				// If this jump would pass over the beacon
				if (result.beacon.y === y && (result.beacon.x > x && result.beacon.x < newX)) count--;
				count += newX - x;
				x = newX;
			} else {
				x++;
			}
		}

		console.log('Part 1:', count);
	}

	let x = 0, result;
	while (result = cannotHaveBeacon({ x, y })) {
		x = result.sensor.x + result.distance - Math.abs(result.sensor.y - y) + 1;
	}

	if (!(y > beacon_max || y < 0 || x > beacon_max || x < 0)) {
		console.log('Part 2:', x * 4000000 + y);
		break;
	}
}