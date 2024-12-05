import * as fs from "node:fs/promises";
import * as path from "node:path";

async function countWordOccurrences(filePath: string): Promise<number> {
	const rawInput = await fs.readFile(filePath, "utf-8");
	const grid = rawInput.split("\n").map((line) => line.split(""));

	const horizontalLines = grid.map((row) => row.join(""));
	// console.log("Horizontal lines:", horizontalLines);

	const verticalLines: string[] = [];
	for (let col = 0; col < grid[0].length; col++) {
		let column = "";
		for (let row = 0; row < grid.length; row++) {
			column += grid[row][col];
		}
		verticalLines.push(column);
	}
	// console.log("Vertical lines:", verticalLines);

	/*Convert strings from diagonal TL-BR into lines*/
	const diagonalLinesTopLeftToBottomRight: string[] = [];
	for (let d = 0; d < grid.length + grid[0].length - 1; d++) {
		let diagonal = "";
		for (let row = 0; row < grid.length; row++) {
			const col = d - row;
			if (col >= 0 && col < grid[0].length) {
				diagonal += grid[row][col];
			}
		}
		if (diagonal) diagonalLinesTopLeftToBottomRight.push(diagonal);
	}

	/*Convert strings from diagonal line TR-BL into lines */
	const diagonalLinesTopRightToBottomLeft: string[] = [];
	for (let d = 0; d < grid.length + grid[0].length - 1; d++) {
		let diagonal = "";
		for (let row = 0; row < grid.length; row++) {
			const col = row - (d - grid[0].length + 1);
			if (col >= 0 && col < grid[0].length) {
				diagonal += grid[row][col];
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
