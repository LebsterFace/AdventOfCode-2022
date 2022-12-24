import * as fs from "fs";

type ThemCommand = 'A' | 'B' | 'C';
type YouCommand = 'X' | 'Y' | 'Z';
type Choice = "rock" | "paper" | "scissors";
const choices: Choice[] = ['rock', 'paper', 'scissors'];

const rounds = fs.readFileSync("./input.txt", "utf-8")
	.split(/\r?\n/g)
	.map(line => line.split(" ") as [ThemCommand, YouCommand]);

const decodeThem = (t: ThemCommand): Choice => {
	if (t === 'A') return 'rock';
	if (t === 'B') return 'paper';
	if (t === 'C') return 'scissors';
	else throw null;
};

const beats = (a: Choice, b: Choice) => (
	a === 'rock' && b === 'scissors' ||
	a === 'scissors' && b === 'paper' ||
	a === 'paper' && b === 'rock'
);

const outcomeScore = (you: Choice, them: Choice): number => {
	if (you === them) return 3;
	else if (beats(you, them)) return 6;
	else return 0;
};

const shapeScore = (shape: Choice) => {
	if (shape === 'rock') return 1;
	if (shape === 'paper') return 2;
	if (shape === 'scissors') return 3;
	else throw null;
};

const getScore = (decodeYou: (y: YouCommand, t: Choice) => Choice) => {
	return rounds
		.map(([themCommand, youCommand]) => {
			const them = decodeThem(themCommand);
			const you = decodeYou(youCommand, them);
			return outcomeScore(you, them) + shapeScore(you);
		}).reduce((a, b) => a + b);
};

console.log(`Part 1: ${getScore(you => {
	// X for Rock
	if (you === 'X') return 'rock';
	// Y for Paper
	if (you === 'Y') return 'paper';
	// Z for Scissors
	if (you === 'Z') return 'scissors';
	throw null;
})}`);

console.log(`Part 2: ${getScore((you, them) => {
	// X means you need to lose
	if (you === 'X') return choices.find(c => beats(them, c))!;
	// Y means you need to end the round in a draw
	if (you === 'Y') return them;
	// Z means you need to win
	if (you === 'Z') return choices.find(c => beats(c, them))!;
	throw null;
})}`);