import * as fs from "node:fs/promises";
import * as path from "node:path";

async function readInput(filePath: string): Promise<string[]> {
	const rawInput = await fs.readFile(filePath, "utf-8");
	return rawInput.trim().split("\n");
}

async function calculateTotal(filePath: string): Promise<number> {
	const lines = await readInput(filePath);
	// console.log("Lines:", lines);
	let nbOfCombinations = 0;

	for (const line of lines) {
		const [target, availableNumbers] = line.split(": ");
		const targetValue = Number(target);
		// console.log("Target value:", targetValue);
		const numbers = availableNumbers.split(" ").map(Number);
		// console.log("Numbers:", numbers);

		function assessCombinations(index: number, currentValue: number): boolean {
			if (index === numbers.length - 1) {
				return currentValue === targetValue;
			}

			const nextNumber = numbers[index + 1];
			return (
				assessCombinations(index + 1, currentValue + nextNumber) ||
				assessCombinations(index + 1, currentValue * nextNumber)
			);
		}
		if (assessCombinations(0, numbers[0])) {
			nbOfCombinations += targetValue;
		}
	}
	// console.log("Number of combinations:", nbOfCombinations);
	return nbOfCombinations;
}

async function getResults() {
	const controlResult = await calculateTotal(
		path.resolve(__dirname, "exampleInput.txt"),
	);
	console.log("Control result:", controlResult);

	// const result = await calculateTotal(path.resolve(__dirname, "input.txt"));
	// console.log("Result:", result);

	// return { controlResult, result };
}

getResults();
