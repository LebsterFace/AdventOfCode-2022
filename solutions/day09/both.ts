import { readFileSync } from "fs";

const input = readFileSync("./input.txt", "utf-8")
	.replaceAll("\r", "")
	.split("\n").map(line => line.split(" "));

type Node = { x: number, y: number; };
const nodes = Array.from({ length: 10 }, (): Node => ({ x: 0, y: 0 }));

const isTouching = (node: Node, target: Node) =>
	Math.abs(node.x - target.x) <= 1 &&
	Math.abs(node.y - target.y) <= 1;

const updatePosition = (node: Node, target: Node) => {
	if (isTouching(node, target)) return;
	node.y += Math.sign(target.y - node.y);
	node.x += Math.sign(target.x - node.x);
};

const secondNodePositions = new Set();
const endNodePositions = new Set();

for (const [dir, rawMovement] of input) {
	const movement = parseInt(rawMovement);
	for (let i = 0; i < movement; i++) {
		if (dir === 'R') nodes[0].x++;
		if (dir === 'L') nodes[0].x--;
		if (dir === 'U') nodes[0].y++;
		if (dir === 'D') nodes[0].y--;


		for (let i = 0; i < nodes.length - 1; i++) {
			updatePosition(nodes[i + 1], nodes[i]);
		}

		secondNodePositions.add(`${nodes[1].x},${nodes[1].y}`);
		endNodePositions.add(`${nodes[9].x},${nodes[9].y}`);
	}
}

console.log('Part 1:', secondNodePositions.size);
console.log('Part 2:', endNodePositions.size);