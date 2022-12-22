import { readFileSync } from "node:fs";

type Operator = '+' | '-' | '*' | '/' | '=';
type OperatorMonkey = {
	name: string,
	type: 'operation',
	value: {
		a: string;
		operator: Operator;
		b: string;
	};
};

type ValueMonkey = {
	name: string,
	type: 'value',
	value: number;
};

type Monkey = ValueMonkey | OperatorMonkey;

const HUMAN_NAME = 'humn';
const input = new Map(readFileSync("./input.txt", "utf-8")
	.replaceAll("\r", "").split("\n")
	.map((line): [string, Monkey] => {
		const [name, job] = line.split(": ");
		const type = job.includes(" ") ? "operation" : "value";
		if (type === "operation") {
			let [a, operator, b] = job.replaceAll(" ", "").split(/([^a-z])/);
			if (name === 'root') operator = '=';
			return [name, { name, type, value: { a, operator: operator as Operator, b } }];
		} else {
			let value = parseInt(job);
			if (name === HUMAN_NAME) value = NaN;
			return [name, { name, type, value }];
		}
	}));

const root = input.get("root")! as OperatorMonkey;

const reliesOnHuman = (monkeyName: string): boolean => {
	const monkey = input.get(monkeyName)!;
	if (monkey.type === "value") return monkey.name === HUMAN_NAME;
	return reliesOnHuman(monkey.value.a) || reliesOnHuman(monkey.value.b);
};

const results = new Map<string, number>();
const evaluate = (monkey: Monkey): number => {
	if (results.has(monkey.name)) return results.get(monkey.name)!;
	if (monkey.type === "value") {
		results.set(monkey.name, monkey.value);
		return monkey.value;
	}

	const a = evaluate(input.get(monkey.value.a)!);
	const b = evaluate(input.get(monkey.value.b)!);
	if (monkey.value.operator === '+') return a + b;
	if (monkey.value.operator === '-') return a - b;
	if (monkey.value.operator === '*') return a * b;
	if (monkey.value.operator === '/') return a / b;
	throw new Error("?");
};

const targetSide = input.get(reliesOnHuman(root.value.a) ? root.value.b : root.value.a)!;
// Evaluate it:
const targetValue = evaluate(targetSide);

// Every operation applied to the human value, apply it in reverse to the targetValue
const all_monkeys = [...input.values()];

const operations: OperatorMonkey[] = [];
let currentName = HUMAN_NAME;
while (true) {
	const result = all_monkeys.find(({ type, value }) => {
		if (type !== "operation") return false;
		const { a, b } = value;
		return a === currentName || b === currentName;
	}) as OperatorMonkey;

	if (result.name === 'root') break;
	operations.push(result);
	currentName = result.name;
}

let result = targetValue;

while (operations.length > 0) {
	const { value } = operations.pop()!;
	const computableSide = reliesOnHuman(value.a) ? 'b' : 'a';
	const X = evaluate(input.get(value[computableSide])!);
	if (value.operator === '+') result -= X;
	else if (value.operator === '*') result /= X;
	else if (value.operator === '-') {
		if (computableSide === 'b') result += X;
		else result = X - result;;
	} else if (value.operator === '/') {
		if (computableSide === 'b') result *= X;
		else result = X / result;
	}
}

console.log(result);
