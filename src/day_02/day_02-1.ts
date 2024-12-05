import * as fs from "node:fs/promises";
import * as path from "node:path";

async function readInput(filePath: string): Promise<number[][]> {
	const rawInput = await fs.readFile(filePath, "utf-8");
	const lines = rawInput.split("\n");
	// console.log("Lines:", lines);

	const formattedInput = lines.map((line) => line.split(" ").map(Number));
	return formattedInput;
}

function isReportSafe(report: number[]): boolean {
	let levelsAreIncreasing = true;
	let levelsAreDecreasing = true;

	for (let i = 1; i < report.length; i++) {
		const gapBetweenLevels = Math.abs(report[i] - report[i - 1]);
		if (gapBetweenLevels < 1 || gapBetweenLevels > 3) {
			return false;
		}
		if (report[i] > report[i - 1]) {
			levelsAreDecreasing = false;
		} else if (report[i] < report[i - 1]) {
			levelsAreIncreasing = false;
		}
	}
	return levelsAreIncreasing || levelsAreDecreasing;
}

async function countSafeReports(filePath: string): Promise<number> {
	const reports = await readInput(filePath);
	let nbOfSafeReports = 0;

	for (const report of reports) {
		if (isReportSafe(report)) {
			nbOfSafeReports++;
		}
	}
	return nbOfSafeReports;
}

async function getResults() {
	const controlResult = await countSafeReports(
		path.resolve(__dirname, "exampleInput.txt"),
	);
	console.log("Control result", controlResult);
	const result = await countSafeReports(path.resolve(__dirname, "input.txt"));
	console.log("Result:", result);

	return { controlResult, result };
}

getResults();
