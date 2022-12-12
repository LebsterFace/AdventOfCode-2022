import { readFileSync } from "fs";
type Vertex = {
	x: number;
	y: number;
	height: number;
	distance: number;
	previous: Vertex | null;
};

interface PriorityQueue {
	add(value: Vertex): void;
	update(value: Vertex): void;
	pop(): Vertex;
	isEmpty(): boolean;
}

// Lots of room for optimisation here
class NaivePriorityQueue implements PriorityQueue {
	private verticies: Vertex[] = [];

	isEmpty(): boolean {
		return this.verticies.length === 0;
	}

	addToBottom(value: Vertex): void {
		this.verticies.push(value);
	}

	add(value: Vertex): void {
		let i = 0;
		for (; i < this.verticies.length; i++) {
			if (this.verticies[i].distance > value.distance) {
				break;
			}
		}

		this.verticies.splice(i, 0, value);
	}

	remove(value: Vertex): void {
		const index = this.verticies.indexOf(value);
		if (index !== -1) this.verticies.splice(index, 1);
	}

	update(value: Vertex): void {
		this.remove(value);
		this.add(value);
	}

	pop(): Vertex {
		return this.verticies.shift() as Vertex;
	}
}

const S_value = -14;
const endValue = -28;

const input: Vertex[][] = readFileSync("./input.txt", "utf-8")
	.replaceAll("\r", "").split("\n")
	.map((line, y) => Array.from(line, (cell, x) => ({
		x, y,
		height: cell.charCodeAt(0) - 97,
		distance: Infinity,
		previous: null
	})));

const reset = () => {
	for (const row of input) {
		for (const cell of row) {
			cell.distance = Infinity;
			cell.previous = null;
		}
	}
};

const starts = input.flat().filter(x => x.height === S_value || x.height === 0);
const end = input.flat().find(x => x.height === endValue);
const S = starts.find(x => x.height === S_value)!;
if (!end) throw -1;
starts.forEach(s => s.height = 0);
end.height = 26;

const solve = (input: Vertex[][], start: Vertex) => {
	start.distance = 0;

	const queue = new NaivePriorityQueue();
	for (const row of input)
		for (const node of row)
			queue.addToBottom(node);

	while (!queue.isEmpty()) {
		const current = queue.pop();

		const neighbours = [
			input[current.y - 1]?.[current.x],
			input[current.y + 1]?.[current.x],
			input[current.y]?.[current.x - 1],
			input[current.y]?.[current.x + 1],
		].filter(t => typeof t !== "undefined");

		for (const node of neighbours) {
			if (node.height <= current.height || node.height === current.height + 1) {
				const newDistance = current.distance;

				if (newDistance < node.distance) {
					node.distance = newDistance;
					node.previous = current;
					queue.update(node);
				}
			}
		}
	}

	let current = end;
	const path = [];
	while (current.previous !== null) {
		path.unshift(current);
		current = current.previous;
	}

	return path;
};

let partOne;
let partTwo = Infinity;
for (const start of starts) {
	const path = solve(input, start);
	if (start === S) partOne = path.length;
	if (path.length === 0) continue;

	if (path.length < partTwo) {
		partTwo = path.length;
	}

	reset();
}

console.log('Part 1:', partOne);
console.log('Part 2:', partTwo);