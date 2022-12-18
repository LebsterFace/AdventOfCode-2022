import { readFileSync } from "node:fs";

const regexp = /^Valve (?<id>[A-Z]{2}) has flow rate=(?<flow_rate>[0-9]+); tunnels? leads? to valves? (?<tunnels>(?:[A-Z]{2},? ?)+)$/;

const flow_rates: Record<string, number> = {};
const graph: Record<string, string[]> = {};
const bit: Record<string, bigint> = {};
const vertices: string[] = [];

const inputString = readFileSync("./input.txt", "utf-8").replaceAll("\r", "");
let bit_index = 0n;
for (const line of inputString.split("\n")) {
	const { id, flow_rate, tunnels } = line.match(regexp)!.groups!;
	flow_rates[id] = parseInt(flow_rate);
	graph[id] = tunnels.split(", ");
	if (flow_rates[id] !== 0) {
		bit[id] = 1n << bit_index;
		bit_index++;
	}

	vertices.push(id);
};

const objectFromKeys = <T>(keys: string[], valueFn: (key: string) => T) => Object.fromEntries(keys.map(k => [k, valueFn(k)]));

let distances: Record<string, Record<string, number>> = objectFromKeys(vertices, () => objectFromKeys(vertices, () => Infinity));
//#region Floyd–Warshall algorithm
for (const v of vertices) {
	distances[v][v] = 0;
	for (const u of graph[v])
		distances[u][v] = 1;
}

for (const k of vertices) {
	for (const i of vertices) {
		for (const j of vertices) {
			if (distances[i][j] > distances[i][k] + distances[k][j]) {
				distances[i][j] = distances[i][k] + distances[k][j];
			}
		}
	}
}

for (const [from, mapping] of Object.entries(distances)) {
	for (const to of Object.keys(mapping)) {
		if (to === from || flow_rates[to] === 0)
			delete mapping[to];
	}
}
//#endregion
const cache = new Map<string, number>;
const dfs = (time: number, valve: string, open: bigint): number => {
	const cacheKey = `${time},${valve},${open}`;
	const cachedValue = cache.get(cacheKey);
	if (cachedValue !== undefined) return cachedValue;

	let max_val = 0;
	for (const [neighbour, dist] of Object.entries(distances[valve])) {
		if (open & bit[neighbour]) continue;
		const remaining = time - 1/* open this valve */ - dist/* reach the neighbour */;
		if (remaining <= 0) continue;
		const newBest = dfs(remaining, neighbour, open | bit[neighbour]);
		max_val = Math.max(max_val, newBest + flow_rates[neighbour] * remaining);
	}

	cache.set(cacheKey, max_val);
	return max_val;
};

console.log('Part 1:', dfs(30, 'AA', 0n));
let max = 0;
const max_bitmask = vertices.map(v => bit[v]).reduce((a, b) => a | (b ?? 0n), 0n);
for (let i = 0n; i < max_bitmask / 2n; i++) {
	const v = dfs(26, 'AA', i) + dfs(26, 'AA', max_bitmask ^ i);
	if (v > max) max = v;
}

console.log('Part 2:', max);