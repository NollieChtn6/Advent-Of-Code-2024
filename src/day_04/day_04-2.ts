import * as fs from "node:fs/promises";
import * as path from "node:path";

async function countPatternOccurrences(filePath: string): Promise<number> {
	const rawInput = await fs.readFile(filePath, "utf-8");
	const grid = rawInput.split("\n").map((line) => line.split(""));

	const pattern = "MAS";
	const centerLetter = pattern[Number(pattern.length - 1) / 2];
	// console.log("Center letter:", centerLetter);

	let numberOfOccurrences = 0;

	for (let row = 1; row < grid.length - 1; row++) {
		for (let col = 1; col < grid[row].length - 1; col++) {
			if (grid[row][col] === centerLetter) {
				const tlValue = grid[row - 1]?.[col - 1];
				const brValue = grid[row + 1]?.[col + 1];

				const trValue = grid[row - 1]?.[col + 1];
				const blValue = grid[row + 1]?.[col - 1];

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
