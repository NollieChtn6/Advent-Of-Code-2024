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

async function calculateValidUpdates(filePath: string): Promise<number> {
	const { printingRules, updates } = await readInput(filePath);

	function updateIsValid(
		updateSequence: number[],
		rules: { before: number; after: number }[],
	): boolean {
		for (const { before, after } of rules) {
			const beforeIndex = updateSequence.indexOf(before);
			const afterIndex = updateSequence.indexOf(after);

			const updateContainsPages = beforeIndex !== -1 && afterIndex !== -1;
			const pagesAreInOrder = beforeIndex < afterIndex;

			if (updateContainsPages && !pagesAreInOrder) {
				return false;
			}
		}
		return true;
	}

	let nbOfMiddlePages = 0;

	for (const updateSequence of updates) {
		if (updateIsValid(updateSequence, printingRules)) {
			const middleIndex = Math.floor(updateSequence.length / 2);
			// console.log("Middle index:", middleIndex);
			nbOfMiddlePages += updateSequence[middleIndex];
		}
	}
	console.log("Nb of middle pages:", nbOfMiddlePages);
	return nbOfMiddlePages;
}

async function getResults() {
	const controlResult = await calculateValidUpdates(
		path.resolve(__dirname, "exampleInput.txt"),
	);
	console.log("Control result:", controlResult);

	const result = await calculateValidUpdates(
		path.resolve(__dirname, "input.txt"),
	);
	console.log("Result:", result);

	return { controlResult, result };
}

getResults();
