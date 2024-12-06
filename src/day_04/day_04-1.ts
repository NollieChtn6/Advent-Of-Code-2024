import * as fs from "node:fs/promises";
import * as path from "node:path";

async function countWordOccurrences(filePath: string): Promise<number> {
	const rawInput = await fs.readFile(filePath, "utf-8");
	const grid = rawInput.split("\n").map((line) => line.split(""));

	const horizontalLines = grid.map((x) => x.join(""));
	// console.log("Horizontal lines:", horizontalLines);

	const verticalLines: string[] = [];
	for (let y = 0; y < grid[0].length; y++) {
		let yumn = "";
		for (let x = 0; x < grid.length; x++) {
			yumn += grid[x][y];
		}
		verticalLines.push(yumn);
	}
	// console.log("Vertical lines:", verticalLines);

	/*Convert strings from diagonal TL-BR into lines*/
	const diagonalLinesTopLeftToBottomRight: string[] = [];
	for (let d = 0; d < grid.length + grid[0].length - 1; d++) {
		let diagonal = "";
		for (let x = 0; x < grid.length; x++) {
			const y = d - x;
			if (y >= 0 && y < grid[0].length) {
				diagonal += grid[x][y];
			}
		}
		if (diagonal) diagonalLinesTopLeftToBottomRight.push(diagonal);
	}

	/*Convert strings from diagonal line TR-BL into lines */
	const diagonalLinesTopRightToBottomLeft: string[] = [];
	for (let d = 0; d < grid.length + grid[0].length - 1; d++) {
		let diagonal = "";
		for (let x = 0; x < grid.length; x++) {
			const y = x - (d - grid[0].length + 1);
			if (y >= 0 && y < grid[0].length) {
				diagonal += grid[x][y];
			}
		}
		if (diagonal) diagonalLinesTopRightToBottomLeft.push(diagonal);
	}
	// console.log("Diagonal lines TL-BR:", diagonalLinesTopLeftToBottomRight);
	// console.log("Diagonal lines TR-BL:", diagonalLinesTopRightToBottomLeft);

	const lines = [
		...horizontalLines,
		...verticalLines,
		...diagonalLinesTopLeftToBottomRight,
		...diagonalLinesTopRightToBottomLeft,
	];

	function countOccurrences(
		stringToCheck: string,
		targetString: string,
	): number {
		let count = 0;
		let index = stringToCheck.indexOf(targetString);
		while (index !== -1) {
			count++;
			index = stringToCheck.indexOf(targetString, index + 1);
		}
		return count;
	}
	const word = "XMAS";
	const reverseWord = word.split("").reverse().join("");

	let nbOfOccurrences = 0;
	for (const line of lines) {
		nbOfOccurrences += countOccurrences(line, word);
		nbOfOccurrences += countOccurrences(line, reverseWord);
	}
	// console.log("Nb of occurrences:", nbOfOccurrences);
	return nbOfOccurrences;
}

async function getResults() {
	const controlResult = await countWordOccurrences(
		path.resolve(__dirname, "exampleInput.txt"),
	);
	console.log("Control result:", controlResult);

	const result = await countWordOccurrences(
		path.resolve(__dirname, "input.txt"),
	);
	console.log("Result:", result);

	return { controlResult, result };
}

getResults();
