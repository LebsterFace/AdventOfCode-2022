const fs = require("fs");

const rounds = fs.readFileSync("./input.txt", "utf-8")
	.split(/\r?\n/g)
	.map(line => line.split(" "));

// A for Rock, B for Paper, and C for Scissors


const MAP = {
	'A': 'rock',
	'B': 'paper',
	'C': 'scissors',
};


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

const getYou = (you, them) => {
	let possible = ['rock', 'paper', 'scissors'];
	// Y means you need to end the round in a draw
	if (you === 'Y') return them;
	possible = possible.filter(p => p !== them);
	// Z means you need to win.
	const wins = possible.find(p => beats(p, them));
	if (you === 'Z') return wins;
	return possible.find(p => p !== wins);
};


let result = 0;
for (const [themRaw, youRaw] of rounds) {
	const them = MAP[themRaw];
	const you = getYou(youRaw, them);
	result += outcome(them, you) + shapeScore(you);
}

console.log(result);