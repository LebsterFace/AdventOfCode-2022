import { readFileSync } from "fs";

type Operation = { op: '*' | '+', value: 'old' | number; };

const RE = /^Monkey (?<id>\d+)\:\n  Starting items: (?<items>(?:\d+,? ?)+)\n  Operation: new = old (?<op>[+*]) (?<value>\d+|old)\n  Test: divisible by (?<test>\d+)\n    If true: throw to monkey (?<trueM>\d+)\n    If false: throw to monkey (?<falseM>\d+)$/;

const monkeys = readFileSync("./input.txt", "utf-8")
	.replaceAll("\r", "")
	.split("\n\n")
	.map(s => {
		const { id, items, op, value, test, trueM, falseM } = s.match(RE)!.groups!;
		return {
			id: parseInt(id),
			items: items.split(", ").map(Number),
			op: { op, value: value === 'old' ? value : parseInt(value) } as Operation,
			test: parseInt(test),
			true: parseInt(trueM),
			false: parseInt(falseM),
			inspectedCount: 0
		};
	});

const productOfTests = monkeys.reduce((a, b) => a * b.test, 1);
monkeys.sort((a, b) => a.id - b.id);

for (let i = 1; i <= 10_000; i++) {
	for (const monkey of monkeys) {
		for (let worryLevel of monkey.items) {
			const value = monkey.op.value === 'old' ? worryLevel : monkey.op.value;
			if (monkey.op.op === '+') worryLevel += value;
			if (monkey.op.op === '*') worryLevel *= value;
			const test = worryLevel % monkey.test === 0;
			monkeys[test ? monkey.true : monkey.false].items.push(worryLevel % productOfTests);
			monkey.inspectedCount += 1;
		}

		monkey.items = [];
	}
}

monkeys.sort((a, b) => Number(b.inspectedCount - a.inspectedCount));
console.log(monkeys[0].inspectedCount * monkeys[1].inspectedCount);