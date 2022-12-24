const fs = require("fs");


const input = fs.readFileSync("./input.txt", "utf-8")
	.replaceAll(/\r?\n/g, "\n")
	.replace(/^\$ /, "")
	.split(/\n\$ /g);

const root = {};
let pwd = [];

const path = (root, pwd) => {
	let current = root;
	for (const property of pwd) {
		// console.log('path:', current, '->', property);
		if (!current[property]) {
			current[property] = {};
		}

		current = current[property];
	}

	return current;
};

for (const line of input) {
	if (line.startsWith("cd ")) {
		const newPath = line.slice("cd ".length);
		if (newPath === "/") pwd = [];
		else if (newPath === "..") pwd.pop();
		else pwd.push(newPath);
		// console.log('cd ->', pwd);
	} else {
		if (!line.startsWith("ls\n")) throw -1;
		const listing = line.split("\n").slice(1).map(l => l.split(" "));
		const current = path(root, pwd);
		for (const [typeOrSize, name] of listing) {
			if (typeOrSize === 'dir') {
				current[name] = {};
			} else {
				current[name] = parseInt(typeOrSize);
			}
		}
		// console.log('ls ->', listing);
	}
}

// Get directory sizes
const getSize = (f) => {
	if (typeof f === 'number') return f;
	return Object.values(f).map(getSize).reduce((a, b) => a + b);
};

const findDirectories = (current, minSize) => {
	let lowest = Infinity;
	for (const [key, value] of Object.entries(current)) {
		if (typeof value === 'number') continue;
		const size = getSize(value);
		if (size >= minSize && size < lowest) lowest = size;
		lowest = Math.min(lowest, findDirectories(value, minSize));
	}

	return lowest;
};

const totalDiskSpace = 70000000;
const requiredSpace = 30000000;
const mustDelete = requiredSpace - (totalDiskSpace - getSize(root));

console.log(findDirectories(root, mustDelete));