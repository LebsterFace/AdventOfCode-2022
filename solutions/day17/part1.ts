import { fall, grid, jet } from "./common.js";

let placements = 0;
while (placements < 2022) {
	jet();
	if (fall()) {
		placements++;
	}
}

console.log(grid.length - 1);