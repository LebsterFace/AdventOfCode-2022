import { readFileSync } from "node:fs";

const regex = /Each ore robot costs (?<ore_ore_cost>[0-9]+) ore\. Each clay robot costs (?<clay_ore_cost>[0-9]+) ore\. Each obsidian robot costs (?<obsidian_ore_cost>[0-9]+) ore and (?<obsidian_clay_cost>[0-9]+) clay\. Each geode robot costs (?<geode_ore_cost>[0-9]+) ore and (?<geode_obsidian_cost>[0-9]+) obsidian\.$/m;

type Resource = "ore" | "clay" | "obsidian" | "geode";
type Blueprint = Record<Resource, Map<Resource, number>>;

const input = readFileSync("./input.txt", "utf-8")
	.replaceAll("\r", "").split("\n")
	.map((line): Blueprint => {
		const {
			ore_ore_cost,
			clay_ore_cost,
			obsidian_ore_cost, obsidian_clay_cost,
			geode_ore_cost, geode_obsidian_cost
		} = line.match(regex)!.groups!;

		return {
			ore: new Map(Object.entries({ ore: parseInt(ore_ore_cost) }) as [Resource, number][]),
			clay: new Map(Object.entries({ ore: parseInt(clay_ore_cost) }) as [Resource, number][]),
			obsidian: new Map(Object.entries({ ore: parseInt(obsidian_ore_cost), clay: parseInt(obsidian_clay_cost) }) as [Resource, number][]),
			geode: new Map(Object.entries({ ore: parseInt(geode_ore_cost), obsidian: parseInt(geode_obsidian_cost) }) as [Resource, number][]),
		};
	}).map(blueprint => {
		const max_costs = new Map<Resource, number>;
		for (const costs of Object.values(blueprint)) {
			for (const [resource_type, amount] of costs) {
				if (!max_costs.has(resource_type) || max_costs.get(resource_type)! < amount) {
					max_costs.set(resource_type, amount);
				}
			}
		}

		return { blueprint, max_costs };
	});

const dfs = (remaining_time: number, blueprintID: number, robots: Record<Resource, number>, resources: Record<Resource, number>): number => {
	if (remaining_time < 0) throw "?";
	if (remaining_time === 0) return resources.geode;

	const { blueprint, max_costs } = input[blueprintID];
	let max_geodes = resources.geode + robots.geode * remaining_time;
	robots: for (const robot_type of ['clay', 'ore', 'obsidian', 'geode'] as Resource[]) {
		// If it's worth making one:
		if (robots[robot_type] === max_costs.get(robot_type)!) continue robots;

		// Let's imagine we make one:
		const new_resources: Record<Resource, number> = { ...resources };

		let time_to_make_robot = 0;
		for (const [resource, total_needed] of blueprint[robot_type]) {
			new_resources[resource] -= total_needed;
			const more_needed = total_needed - resources[resource];
			const time_to_get_more = Math.ceil(more_needed / robots[resource]);
			if (time_to_get_more >= remaining_time) {
				// We cannot make this robot
				continue robots;
			}

			// The time to make the robot is limited by the time to get the resource
			time_to_make_robot = Math.max(time_to_make_robot, time_to_get_more);
		}

		time_to_make_robot += 1; // The factory takes 1 minute to create

		// We gain recourses according to our robots:
		for (const resource of Object.keys(new_resources) as Resource[]) {
			new_resources[resource] += robots[resource] * time_to_make_robot;
		}

		// Build the robot
		const new_robots = { ...robots };
		new_robots[robot_type] += 1;

		const result = dfs(
			remaining_time - time_to_make_robot,
			blueprintID,
			new_robots, new_resources
		);

		if (result > max_geodes)
			max_geodes = result;
	}

	return max_geodes;
};


console.log(input.map((bp, number, { length }) => {
	return dfs(
		24,
		number,
		{ ore: 1, clay: 0, obsidian: 0, geode: 0 },
		{ ore: 0, clay: 0, obsidian: 0, geode: 0 }
	) * (number + 1);
}).reduce((a, b) => a + b));