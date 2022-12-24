const fs = require("fs");

const input = fs.readFileSync("./input.txt", "utf-8")
	.replaceAll("\r", "")
	.split("\n").map(line => line.split(" "));

const head = { x: 0, y: 0 };
const tail = { x: 0, y: 0 };

const tailPositions = new Set();

const isTouching = () => {
	for (const x of [-1, 0, 1]) {
		for (const y of [-1, 0, 1]) {
			if (head.x === tail.x + x && head.y === tail.y + y) {
				return true;
			}
		}
	}

	return false;
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

		if (!isTouching()) {
			if (tail.x === head.x || tail.y === head.y) {
				if (tail.x <= head.x - 2) tail.x++;
				if (tail.x >= head.x + 2) tail.x--;
				if (tail.y <= head.y - 2) tail.y++;
				if (tail.y >= head.y + 2) tail.y--;
			} else {
				if (tail.y < head.y) tail.y++;
				else if (tail.y > head.y) tail.y--;
				if (tail.x > head.x) tail.x--;
				else if (tail.x < head.x) tail.x++;
			}
		}

		tailPositions.add(`${tail.x},${tail.y}`);
	}
}

console.log(tailPositions.size);