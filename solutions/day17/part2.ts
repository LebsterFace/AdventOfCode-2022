import { fall, grid, jet, jetIndex, shapeIndex } from "./common.js";

// Totals
let placements = 0;
let height = 0;

type StateName = `${string},${string}`;
type State = { gainedPlacements: number, gainedHeight: number, nextName: StateName; };
// Memoization of State Name -> State
const cache = new Map<StateName, State>;

// Track the latest state
const getCurrentStateName = (): StateName => `${jetIndex},${shapeIndex}`; // Constituent parts of the current state name
let lastState_name = getCurrentStateName();
let lastState_startingHeight = grid.length - 1;
let lastState_startingPlacements = placements;

let cycle_followed = false;
const goal = 1e12;
while (placements < goal) {
	jet();
	if (fall()) {
		placements++;

		// Optimisation to allow 1T iterations
		const lineIndex = grid.findIndex((row, index) => index > 0 && row.every(cell => cell));
		if (lineIndex !== -1) {
			const { length: removedCount } = grid.splice(0, lineIndex);
			height += removedCount;

			// We cannot optimise further, the cycle has been "followed" the maximum number of times.
			// Simply simulate the remaining placements
			if (cycle_followed) continue;

			const currentState: State = {
				gainedHeight: height - lastState_startingHeight,
				gainedPlacements: placements - lastState_startingPlacements,
				nextName: getCurrentStateName()
			};

			// If current state has not been seen before
			if (!cache.has(lastState_name)) {
				// Cache it
				cache.set(lastState_name, currentState);
				// This state was the last (latest) state
				lastState_name = currentState.nextName;
				lastState_startingHeight = height;
				lastState_startingPlacements = placements;
				// Continue simulating
				continue;
			}

			const queue: StateName[] = [];
			let currentStateName = lastState_name;
			while (cache.get(currentStateName)) {
				queue.push(currentStateName);
				const currentState = cache.get(currentStateName)!;

				if (!queue.includes(currentState.nextName)) {
					currentStateName = currentState.nextName;
					continue;
				}

				// Calculate the height and number of placements gained from following this cycle
				const index = queue.indexOf(currentState.nextName);
				let summedGainedHeights = 0;
				let summedGainedPlacements = 0;
				for (const S of queue.slice(index)) {
					const { gainedHeight, gainedPlacements } = cache.get(S)!;
					summedGainedHeights += gainedHeight;
					summedGainedPlacements += gainedPlacements;
				}

				// Calculate the number of times to follow the cycle
				const remainingPlacements = goal - placements;
				const cycleIterations = Math.floor(remainingPlacements / summedGainedPlacements);

				// Adjust totals as if the cycle had been simulated that many times
				placements += cycleIterations * summedGainedPlacements;
				height += cycleIterations * summedGainedHeights;

				// Set flag which prevents optimisation from running again
				cycle_followed = true;
				break;
			}
		}
	}
}

height += grid.length - 1;
console.log(height);