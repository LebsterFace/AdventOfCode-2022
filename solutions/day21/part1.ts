import { readFileSync } from "node:fs";

type Operator = '+' | '-' | '*' | '/';

type Monkey = ({
	name: string,
	type: 'value',
	value: number;
} |
{
	name: string,
	type: 'operation',
	value: {
		a: string,
		b: string,
		operator: Operator;
	};
});

const input = Object.fromEntries(readFileSync("./input.txt", "utf-8")
	.replaceAll("\r", "").split("\n")
	.map((line): [string, Monkey] => {
		const [name, job] = line.split(": ");
		const type = job.includes(" ") ? "operation" : "value";
		if (type === "operation") {
			const [a, operator, b] = job.replaceAll(" ", "").split(/([^a-z])/);
			return [name, { name, type, value: { a, b, operator: operator as Operator } }];
		} else {
			return [name, { name, type, value: parseInt(job) }];
		}
	}));

// Map of monkey name -> result
const results = new Map<string, number>();
const evaluate = (monkey: Monkey): number => {
	if (results.has(monkey.name)) return results.get(monkey.name)!;
	if (monkey.type === "value") {
		results.set(monkey.name, monkey.value);
		return monkey.value;
	}

	const a = evaluate(input[monkey.value.a]);
	const b = evaluate(input[monkey.value.b]);
	if (monkey.value.operator === '+') return a + b;
	if (monkey.value.operator === '-') return a - b;
	if (monkey.value.operator === '*') return a * b;
	if (monkey.value.operator === '/') return a / b;
	throw new Error("?");
};

console.log(evaluate(input.root));