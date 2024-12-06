import * as fs from "node:fs/promises";
import * as path from "node:path";

async function readInput(filePath: string) {
	const rawInput = await fs.readFile(filePath, "utf-8");
	const [rulesSection, updatesSection] = rawInput.split("\n\n");

	const printingRules = rulesSection.split("\n").map((rule) => {
		const [before, after] = rule.split("|").map(Number);
		// console.log("Before:", before, "After:", after);
		return { before, after };
	});

	const updates = updatesSection
		.split("\n")
		.filter(Boolean)
		.map((line) => line.split(",").map(Number));

	// console.log("Printing Rules:", printingRules);
	// console.log("Updates:", updates);
	return { printingRules, updates };
}

function updateIsValid(
	updateSequence: number[],
	rules: { before: number; after: number }[],
): boolean {
	for (const { before, after } of rules) {
		const beforeIndex = updateSequence.indexOf(before);
		const afterIndex = updateSequence.indexOf(after);

		if (beforeIndex !== -1 && afterIndex !== -1 && beforeIndex > afterIndex) {
			return false;
		}
	}
	return true;
}

function reorderUpdateSequence(
	updateSequence: number[],
	rules: { before: number; after: number }[],
): number[] {
	return [...updateSequence].sort((a, b) => {
		for (const { before, after } of rules) {
			if (before === a && after === b) return -1;
			if (before === b && after === a) return 1;
		}
		return 0;
	});
}

async function calculateReorderedUpdates(filePath: string): Promise<number> {
	const { printingRules, updates } = await readInput(filePath);

	let nbOfMiddlePages = 0;

	for (const updateSequence of updates) {
		if (!updateIsValid(updateSequence, printingRules)) {
			const reorderedSequence = reorderUpdateSequence(
				updateSequence,
				printingRules,
			);
			const middleIndex = Math.floor(reorderedSequence.length / 2);
			nbOfMiddlePages += reorderedSequence[middleIndex];
		}
	}

	console.log("Nb of middle pages:", nbOfMiddlePages);
	return nbOfMiddlePages;
}

async function getResults() {
	const controlResult = await calculateReorderedUpdates(
		path.resolve(__dirname, "exampleInput.txt"),
	);
	console.log("Control result:", controlResult);

	const result = await calculateReorderedUpdates(
		path.resolve(__dirname, "input.txt"),
	);
	console.log("Result:", result);

	return { controlResult, result };
}

getResults();
