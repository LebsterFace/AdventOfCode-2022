import { readFileSync } from "node:fs";

const input = [...readFileSync("./input.txt", "utf-8")] as Array<'>' | '<'>;

// The tall, vertical chamber is exactly seven units wide.
const GRID_WIDTH = 7;
// index represents offset from floor
const grid: boolean[][] = [
	Array(GRID_WIDTH).fill(true) // floor
];


const SHAPE_DEFINITIONS = `####

.#.
###
.#.

..#
..#
###

#
#
#
#

##
##`;

type Shape = boolean[][];
const shapes = SHAPE_DEFINITIONS.split("\n\n").map((str): Shape => str.split("\n").reverse().map(row => Array.from(row, c => c === '#')));
let shapeIndex = 0;
const nextRock = (): { shape: Shape, x: number, y: number; } => {
	if (shapeIndex >= shapes.length) shapeIndex = 0;

	return {
		shape: shapes[shapeIndex++],
		// its left edge is two units away from the left wall
		x: 2,
		// its bottom edge is three units above the highest rock in the room (or the floor, if there isn't one).
		y: 3
	};
};

let current = nextRock();

const place = () => {
	while (grid.length < grid.length + current.y + current.shape.length) {
		grid.push(Array(GRID_WIDTH).fill(false));
		current.y--;
	}

	const cur_abs_y = grid.length + current.y;

	for (let y = grid.length - 1; y >= 0; y--) {
		const row = grid[y];
		for (let x = 0; x < GRID_WIDTH; x++) {
			const isAtSign = (
				y >= cur_abs_y &&
				y < cur_abs_y + current.shape.length &&
				current.shape[y - cur_abs_y][x - current.x]
			);

			row[x] ||= isAtSign;
		}
	}
};


// Returns true if the current rock is colliding with an already-fallen rock
const rock_collide = () => {
	const cur_abs_y = grid.length + current.y;

	for (let y = cur_abs_y + current.shape.length - 1; y >= cur_abs_y; y--) {
		for (let x = 0; x < GRID_WIDTH; x++) {
			if (grid[y]?.[x] && current.shape[y - cur_abs_y][x - current.x]) {
				return true;
			}
		}
	}

	return false;
};

// Returns true if the current rock is colliding with the floor
const floor_collide = () => grid.length + current.y <= 0;

// Returns true if the current rock is colliding with either wall
const wall_collide = () => {
	if (current.x < 0) return true;
	for (const row of current.shape) {
		for (let x = 0; x < row.length; x++) {
			if (current.x + x >= GRID_WIDTH)
				return true;
		}
	}

	return false;
};

let jetIndex = 0;
const jet = () => {
	const original_x = current.x;

	if (jetIndex >= input.length) jetIndex = 0;
	if (input[jetIndex] === '>') current.x++;
	if (input[jetIndex] === '<') current.x--;
	jetIndex++;
	// If any movement would cause any part of the rock to
	// move into the walls, floor, or a stopped rock,
	if (wall_collide() || rock_collide() || floor_collide()) {
		// the movement instead does not occur.
		current.x = original_x;
	}
};

// Returns true if the rock was placed
const fall = (): boolean => {
	current.y--;
	// If a downward movement would have caused a falling rock to move into the floor
	// or an already-fallen rock,
	if (floor_collide() || rock_collide()) {
		// the falling rock stops where it is (having landed on something)
		current.y++;

		place();
		// and a new rock immediately begins falling.
		current = nextRock();

		return true;
	}

	return false;
};

export { fall, jet, grid, jetIndex, shapeIndex }