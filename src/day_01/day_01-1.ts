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

async function calculateTotalDistance(filePath: string) {
	const { leftList, rightList } = await readInput(filePath);

	const ascLeftList = leftList.sort((a, b) => a - b);
	const ascRightList = rightList.sort((a, b) => a - b);

	const arrayOfDistances: number[] = [];

	for (let i = 0; i < ascLeftList.length; i++) {
		arrayOfDistances.push(Math.abs(ascLeftList[i] - ascRightList[i]));
	}
	// console.log("Array of Distances:", arrayOfDistances);

	let totalDistance = 0;
	for (let i = 0; i < arrayOfDistances.length; i++) {
		totalDistance += arrayOfDistances[i];
	}
	return totalDistance;
}

async function getResults() {
	const controlResult = await calculateTotalDistance(
		path.resolve(__dirname, "exampleInput.txt"),
	);
	console.log("Control result:", controlResult);
	const result = await calculateTotalDistance(
		path.resolve(__dirname, "input.txt"),
	);
	console.log("Result:", result);

	return { controlResult, result };
}

getResults();
