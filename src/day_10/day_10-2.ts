import * as fs from "node:fs/promises";
import * as path from "node:path";

type DirectionCoordinates = [number, number];

async function readInput(filePath: string): Promise<number[][]> {
	const rawInput = await fs.readFile(filePath, "utf-8");
	return rawInput.split("\n").map((line) => line.split("").map(Number));
}

async function calculateTrailheadRatings(filePath: string): Promise<number> {
	const grid = await readInput(filePath);
	const nbOfRows = grid.length;
	const nbOfCols = grid[0].length;

	// directions: [row, col]
	const directions: DirectionCoordinates[] = [
		[-1, 0],
		[1, 0],
		[0, -1],
		[0, 1],
	];

	const isValidMove = (x: number, y: number, currentHeight: number) => {
		return (
			x >= 0 &&
			x < nbOfRows &&
			y >= 0 &&
			y < nbOfCols &&
			// should increase by 1
			grid[x][y] === currentHeight + 1
		);
	};

	// https://initjs.org/master-recursion-in-javascript-tips-tricks-and-examples-87f7c6e3769b
	const visitedPaths: Map<string, number> = new Map();

	const countPathsFrom = (x: number, y: number): number => {
		// Check if the result is already memoized
		const key = `${x},${y}`;
		if (visitedPaths.has(key)) {
			return visitedPaths.get(key) ?? 0;
		}

		// If the cell is a height of 9, it's the end of a path
		if (grid[x][y] === 9) {
			visitedPaths.set(key, 1);
			return 1;
		}

		// Initialize the number of paths from this cell
		let totalPaths = 0;

		// Explore all valid neighbors
		for (const [dx, dy] of directions) {
			const nextX = x + dx;
			const nextY = y + dy;

			if (isValidMove(nextX, nextY, grid[x][y])) {
				totalPaths += countPathsFrom(nextX, nextY);
			}
		}

		// Memoize the result
		visitedPaths.set(key, totalPaths);

		return totalPaths;
	};

	let totalRating = 0;

	// Find all trailheads (cells with height 0)
	for (let row = 0; row < nbOfRows; row++) {
		for (let col = 0; col < nbOfCols; col++) {
			if (grid[row][col] === 0) {
				// Count all distinct paths starting from this trailhead
				totalRating += countPathsFrom(row, col);
			}
		}
	}

	console.log("Total trailhead rating:", totalRating);
	return totalRating;
}

async function getResults() {
	const controlResult = await calculateTrailheadRatings(
		path.resolve(__dirname, "exampleInput.txt"),
	);
	console.log("Control result:", controlResult);

	const result = await calculateTrailheadRatings(
		path.resolve(__dirname, "input.txt"),
	);
	console.log("Result:", result);
}

getResults();
