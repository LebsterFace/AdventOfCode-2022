const fs = require("fs");

const rounds = fs.readFileSync("./input.txt", "utf-8")
	.split(/\r?\n/g)
	.map(line => line.split(" "));

// A for Rock, B for Paper, and C for Scissors
// X for Rock, Y for Paper, and Z for Scissors

const MAP = {
	'A': 'rock', 'X': 'rock',
	'B': 'paper', 'Y': 'paper',
	'C': 'scissors', 'Z': 'scissors',
};

const normalise = s => MAP[s];

const beats = (you, them) => {
	if (you === 'rock') return them === 'scissors';
	if (you === 'scissors') return them === 'paper';
	if (you === 'paper') return them === 'rock';
};

// plus the score for the outcome of the round
// (0 if you lost, 3 if the round was a draw, and 6 if you won).
const outcome = (them, you) => {
	if (them === you) return 3;
	if (beats(you, them)) return 6;
	else return 0;
};

// shape you selected (1 for Rock, 2 for Paper, and 3 for Scissors)

const shapeScore = you => {
	if (you === 'rock') return 1;
	if (you === 'paper') return 2;
	if (you === 'scissors') return 3;
};


let result = 0;
for (const [themRaw, youRaw] of rounds) {
	const them = normalise(themRaw);
	const you = normalise(youRaw);
	result += outcome(them, you) + shapeScore(you);
}

console.log(result);