import * as fs from "node:fs/promises";
import * as path from "node:path";

async function solveCorruptedMemory(filePath: string): Promise<number> {
	const rawInput = await fs.readFile(filePath, "utf-8");
	const regex: RegExp = /mul\((\d+),(\d+)\)/g;
	// console.log("Raw input", rawInput)

	const validRawInstructions = rawInput.match(regex);
	if (!validRawInstructions) {
		return 0;
	}

	const validInstructionsData: number[][] = validRawInstructions.map(
		(validInstruction) => {
			const numbersInInstruction = validInstruction.match(/\d+/g);
			if (numbersInInstruction && numbersInInstruction.length === 2) {
				return [
					Number(numbersInInstruction[0]),
					Number(numbersInInstruction[1]),
				];
			}
			return [0, 0];
		},
	);

	const total = validInstructionsData.reduce(
		(sum: number, [a, b]: number[]): number => sum + a * b,
		0,
	);
	// console.log("Total:", total);
	return total;
}

async function getResults() {
	const controlResult = await solveCorruptedMemory(
		path.resolve(__dirname, "exampleInput_03-1.txt"),
	);
	console.log("Control result:", controlResult);

	const result = await solveCorruptedMemory(
		path.resolve(__dirname, "input.txt"),
	);
	console.log("Result:", result);

	return { controlResult, result };
}

getResults();
