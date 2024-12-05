import * as fs from "node:fs/promises";
import * as path from "node:path";

async function readInput(filePath: string): Promise<string> {
	const rawInput = await fs.readFile(filePath, "utf-8");
	return rawInput;
}

async function solveCorruptedMemoryWithConditions(filePath: string) {
	const rawInput = readInput(filePath);
	// console.log(rawInput);

	const regex = /mul\((\d+),(\d+)\)|do\(\)|don't\(\)/g;

	const validRawInstructions = (await rawInput).match(regex);
	// console.log("Valid Raw Instructions:", validRawInstructions);

	let isEnabled = true;
	let total = 0;

	for (const validInstruction of validRawInstructions as Array<string>) {
		if (validInstruction === "do()") {
			isEnabled = true;
		} else if (validInstruction === "don't()") {
			isEnabled = false;
		} else {
			const numbersInInstruction = validInstruction.match(/\d+/g);
			if (
				numbersInInstruction &&
				numbersInInstruction.length === 2 &&
				isEnabled
			) {
				const [a, b] = numbersInInstruction.map(Number);
				total += a * b;
			}
		}
	}

	// console.log("Total:", total);
	return total;
}

async function getResults() {
	const controlResult = await solveCorruptedMemoryWithConditions(
		path.resolve(__dirname, "exampleInput_03-2.txt"),
	);
	console.log("Control result:", controlResult);

	const result = await solveCorruptedMemoryWithConditions(
		path.resolve(__dirname, "input.txt"),
	);
	console.log("Result:", result);

	return { controlResult, result };
}

getResults();
