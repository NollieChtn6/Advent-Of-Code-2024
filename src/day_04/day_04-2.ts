import * as fs from "node:fs/promises";
import * as path from "node:path";

async function countPatternOccurrences(filePath: string): Promise<number> {
	const rawInput = await fs.readFile(filePath, "utf-8");
	const grid = rawInput.split("\n").map((line) => line.split(""));

	const pattern = "MAS";
	const centerLetter = pattern[Number(pattern.length - 1) / 2];
	// console.log("Center letter:", centerLetter);

	let numberOfOccurrences = 0;

	for (let y = 1; y < grid.length - 1; y++) {
		for (let x = 1; x < grid[y].length - 1; x++) {
			if (grid[y][x] === centerLetter) {
				const tlValue = grid[y - 1]?.[x - 1];
				const brValue = grid[y + 1]?.[x + 1];

				const trValue = grid[y - 1]?.[x + 1];
				const blValue = grid[y + 1]?.[x - 1];

				const tlBrIsValid =
					(tlValue === "M" && brValue === "S") ||
					(tlValue === "S" && brValue === "M");
				const trBlIsValid =
					(trValue === "M" && blValue === "S") ||
					(trValue === "S" && blValue === "M");

				const patternIsValid = tlBrIsValid && trBlIsValid;

				if (patternIsValid) {
					numberOfOccurrences++;
				}
			}
		}
	}
	// console.log("Nb of occurrences:", numberOfOccurrences);
	return numberOfOccurrences;
}

async function getResults() {
	const controlResult = await countPatternOccurrences(
		path.resolve(__dirname, "exampleInput.txt"),
	);
	console.log("Control result:", controlResult);

	const result = await countPatternOccurrences(
		path.resolve(__dirname, "input.txt"),
	);
	console.log("Result:", result);

	return { controlResult, result };
}

getResults();
