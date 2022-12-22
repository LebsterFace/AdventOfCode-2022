import { readFileSync } from "node:fs";

const input = readFileSync("./input.txt", "utf-8")
	.replaceAll("\r", "").split("\n")
	.map((line, original_index) => ({ value: parseInt(line), original_index }));

for (let target = 0; target < input.length; target++) {
	const current_index = input.findIndex(e => e.original_index === target);
	let { value } = input[current_index];
	const new_index = (current_index + value) % (input.length - 1);
	input.splice(new_index, 0, input.splice(current_index, 1)[0]);
}

const zeroIndex = input.findIndex(({ value }) => value === 0);
const values = [1000, 2000, 3000].map(v => input[(zeroIndex + v) % input.length].value);
console.log(values);

console.log(values.reduce((a, b) => a + b));