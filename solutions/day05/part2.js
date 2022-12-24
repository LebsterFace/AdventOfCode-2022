const fs = require("fs");

const [towersInput, movesInput] = fs.readFileSync("./input.txt", "utf-8")
	.replaceAll('\r', '')
	.split('\n\n');

const rows = towersInput.split('\n').slice(0, -1).map(line => line
	.replaceAll("    ", "-")
	.replaceAll(" ", "")
	.replaceAll("[", "")
	.replaceAll("]", "")
	.split(""));

const towers = Array.from({ length: rows[0].length }, () => []);
for (let i = 0; i < rows[0].length; i++) {
	for (const row of rows) {
		if (row[i] !== '-') {
			towers[i].push(row[i]);
		}
	}
}

const parsedMoves = movesInput
	.split('\n')
	.map(line => line.match(/^move (?<amount>\d+?) from (?<start>\d+?) to (?<end>\d+?)$/).groups);


const move = (amount, start, end) => {
	const toMove = towers[start].splice(0, amount);
	towers[end].unshift(...toMove);
};

for (let { amount, start, end } of parsedMoves) {
	amount = parseInt(amount);
	start = parseInt(start) - 1;
	end = parseInt(end) - 1;

	move(amount, start, end);
}

console.log(towers.map(t => t[0]).join(''));
