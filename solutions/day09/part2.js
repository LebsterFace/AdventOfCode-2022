const fs = require("fs");

const input = fs.readFileSync("./input.txt", "utf-8")
	.replaceAll("\r", "")
	.split("\n").map(line => line.split(" "));

const nodes = Array.from({ length: 10 }, () => ({ x: 0, y: 0 }));
const head = nodes[0];
const tail = nodes[9];

const tailPositions = new Set();

const isTouching = (node, target) => {
	for (const x of [-1, 0, 1]) {
		for (const y of [-1, 0, 1]) {
			if (target.x === node.x + x && target.y === node.y + y) {
				return true;
			}
		}
	}

	return false;
};

const updatePosition = (node, target) => {
	if (!isTouching(node, target)) {
		if (node.x === target.x || node.y === target.y) {
			if (node.x <= target.x - 2) node.x++;
			if (node.x >= target.x + 2) node.x--;
			if (node.y <= target.y - 2) node.y++;
			if (node.y >= target.y + 2) node.y--;
		} else {
			if (node.y < target.y) node.y++;
			else if (node.y > target.y) node.y--;
			if (node.x > target.x) node.x--;
			else if (node.x < target.x) node.x++;
		}
	}
};

for (const [dir, rawMovement] of input) {
	const movement = parseInt(rawMovement);
	for (let i = 0; i < movement; i++) {
		if (dir === 'R') {
			head.x++;
		}

		if (dir === 'L') {
			head.x--;
		}

		if (dir === 'U') {
			head.y++;
		}

		if (dir === 'D') {
			head.y--;
		}


		for (let i = 0; i < nodes.length - 1; i++) {
			updatePosition(nodes[i + 1], nodes[i]);
		}

		tailPositions.add(`${tail.x},${tail.y}`);
	}
}

console.log(tailPositions.size);