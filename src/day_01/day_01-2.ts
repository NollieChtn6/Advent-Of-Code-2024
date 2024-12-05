import * as fs from "node:fs/promises";
import * as path from "node:path";

async function readInput(filePath: string) {
	const rawInput = await fs.readFile(filePath, "utf-8");
	const lines = rawInput.split("\n");
	// console.log("Lines:", lines);

	const leftList: number[] = [];
	const rightList: number[] = [];

	for (const line of lines) {
		const [leftValue, rightValue] = line.split("   ");
		leftList.push(Number(leftValue));
		rightList.push(Number(rightValue));
	}
	return { leftList, rightList };
}

async function calculateSimilarityScore(filePath: string) {
	const { leftList, rightList } = await readInput(filePath);

	let similarityScore = 0;
	for (const number of leftList) {
		const nbOfOccurrences = rightList.filter(
			(rightNumber) => rightNumber === number,
		).length;
		similarityScore += number * nbOfOccurrences;
	}
	return similarityScore;
}

async function getResults() {
	const controlResult = await calculateSimilarityScore(
		path.resolve(__dirname, "exampleInput.txt"),
	);
	console.log("Control result:", controlResult);
	const result = await calculateSimilarityScore(
		path.resolve(__dirname, "input.txt"),
	);
	console.log("Result:", result);

	return { controlResult, result };
}

getResults();
