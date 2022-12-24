const fs = require("fs");

const input: string[] = fs.readFileSync("./input.txt", "utf-8")
	.replaceAll(/\r?\n/g, "\n")
	.replace(/^\$ /, "")
	.split(/\n\$ /g);

type _File = number;
type _Folder = { [P in string]: _File | _Folder; };

const root: _Folder = {};
let pwd: string[] = [];

const current = () => {
	let current = root;
	for (const property of pwd) {
		if (!current[property]) {
			current[property] = {};
		}

		const v = current[property];
		if (typeof v === 'number') {
			throw new Error('Cannot cd into a file');
		}

		current = v;
	}

	return current;
};

for (const line of input) {
	if (line.startsWith("cd ")) {
		const newPath = line.slice("cd ".length);
		if (newPath === "/") {
			pwd = [];
		} else if (newPath === "..") {
			pwd.pop();
		} else {
			pwd.push(newPath);
		}
	} else {
		if (!line.startsWith("ls\n")) throw -1;
		const listing = line
			.split("\n")
			.slice(1)
			.map((l: string) => l.split(" ") as ['dir' | `${number}`, string]);

		for (const [typeOrSize, name] of listing) {
			if (typeOrSize === 'dir') {
				current()[name] = {};
			} else {
				current()[name] = parseInt(typeOrSize);
			}
		}
	}
}

// Get directory sizes
const getSize = (f: _File | _Folder): number => {
	if (typeof f === 'number') return f;
	return Object.values(f).map(getSize).reduce((a, b) => a + b);
};

const getAllFolderSizes = (current = root): number[] => {
	const folders = Object.values(current).filter((f): f is _Folder => typeof f !== 'number');
	const result = folders.map(getSize).concat(folders.flatMap(getAllFolderSizes));
	if (current === root) result.unshift(getSize(root));
	return result;
};

const sizes = getAllFolderSizes();
console.log('Part 1:', sizes.filter(s => s < 100000).reduce((a, b) => a + b));
const minSize = getSize(root) - (70000000 - 30000000);
console.log('Part 2:', sizes.filter(s => s >= minSize).reduce((a, b) => Math.min(a, b)));