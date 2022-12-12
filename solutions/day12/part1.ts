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

const startValue = -14;
const endValue = -28;

const input: Vertex[][] = readFileSync("./input.txt", "utf-8")
	.replaceAll("\r", "").split("\n")
	.map((line, y) => Array.from(line, (cell, x) => ({
		x, y,
		height: cell.charCodeAt(0) - 97,
		distance: Infinity,
		previous: null
	})));

const start = input.flat().find(x => x.height === startValue);
const end = input.flat().find(x => x.height === endValue);
if (!start || !end) throw -1;
start.height = 0;
end.height = 26;

const solve = (input: Vertex[][]) => {
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

console.log(solve(input).length);