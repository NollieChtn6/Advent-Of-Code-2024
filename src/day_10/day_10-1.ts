import * as fs from "node:fs/promises";
import * as path from "node:path";

type DirectionCoordinates = [number, number];

async function readInput(filePath: string): Promise<number[][]> {
	const rawInput = await fs.readFile(filePath, "utf-8");
	return rawInput.split("\n").map((line) => line.split("").map(Number));
}

async function calculateTrailheadScores(filePath: string): Promise<number> {
	const grid = await readInput(filePath);
	const nbOfRows = grid.length;
	const nbOfCols = grid[0].length;

	// direction: [row, col]
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

	const exploreTrails = (
		x: number,
		y: number,
		currentHeight: number,
		visitedCells: Set<string>,
		reachableNines: Set<string>,
	) => {
		visitedCells.add(`${x},${y}`);

		if (grid[x][y] === 9) {
			reachableNines.add(`${x},${y}`);
			return;
		}

		// neighbor cells
		for (const [dx, dy] of directions) {
			const nextX = x + dx;
			const nextY = y + dy;

			if (
				isValidMove(nextX, nextY, currentHeight) &&
				!visitedCells.has(`${nextX},${nextY}`)
			) {
				exploreTrails(
					nextX,
					nextY,
					grid[nextX][nextY],
					visitedCells,
					reachableNines,
				);
			}
		}
	};

	let totalScore = 0;

	for (let row = 0; row < nbOfRows; row++) {
		for (let col = 0; col < nbOfCols; col++) {
			if (grid[row][col] === 0) {
				const visitedCells = new Set<string>();
				const reachableNines = new Set<string>();
				exploreTrails(row, col, 0, visitedCells, reachableNines);

				totalScore += reachableNines.size;
				// console.log("Visited cells:", visitedCells);
				// console.log("Reachable nines:", reachableNines);
			}
		}
	}

	console.log("Total trail score:", totalScore);
	return totalScore;
}

async function getResults() {
	const controlResult = await calculateTrailheadScores(
		path.resolve(__dirname, "exampleInput.txt"),
	);
	console.log("Control result:", controlResult);

	const result = await calculateTrailheadScores(
		path.resolve(__dirname, "input.txt"),
	);
	console.log("Result:", result);
}

getResults();
