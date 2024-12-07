import * as fs from "node:fs/promises";
import * as path from "node:path";

type Direction = "up" | "right" | "down" | "left";
// type Position = { col; row };
type Position = { x: number; y: number };

// const directionCoordinates = {
// 	up: { x: 0, y: -1 },
// 	right: { x: 1, y: 0 },
// 	down: { x: 0, y: 1 },
// 	left: { x: -1, y: 0 },
// };

async function readInput(filePath: string): Promise<string[][]> {
	const rawInput = await fs.readFile(filePath, "utf-8");
	return rawInput.split("\n").map((line) => line.split(""));
}

function changeDirection(direction: Direction): Direction {
	if (direction === "up") return "right";
	if (direction === "right") return "down";
	if (direction === "down") return "left";
	return "up";
}

function move(position: Position, currentDirection: Direction): Position {
	if (currentDirection === "up") return { x: position.x, y: position.y - 1 };
	if (currentDirection === "right") return { x: position.x + 1, y: position.y };
	if (currentDirection === "down") return { x: position.x, y: position.y + 1 };
	// console.log("Position on grid:", position);

	return { x: position.x - 1, y: position.y };
}

function isOutOfGrid(grid: string[][], position: Position): boolean {
	return (
		position.y < 0 ||
		position.y >= grid.length ||
		position.x < 0 ||
		position.x >= grid[0].length
	);
}

async function countObstructionsCausingLoops(
	filePath: string,
): Promise<number> {
	const grid = await readInput(filePath);
	// console.table(grid);

	// guard's starting position and direction
	let startPosition: Position | null = null;
	let startDirection: Direction = "up";

	for (let y = 0; y < grid.length; y++) {
		for (let x = 0; x < grid[y].length; x++) {
			if (grid[y][x] === "^") {
				startPosition = { x, y };
				startDirection = "up";
			} else if (grid[y][x] === ">") {
				startPosition = { x, y };
				startDirection = "right";
			} else if (grid[y][x] === "v") {
				startPosition = { x, y };
				startDirection = "down";
			} else if (grid[y][x] === "<") {
				startPosition = { x, y };
				startDirection = "left";
			}
		}
	}

	if (!startPosition) throw new Error("Guard starting point not found!");

	function simulateGuardPath(
		grid: string[][],
		position: Position,
		direction: Direction,
	): boolean {
		const visitedCellsWithDirections = new Set<string>();
		let currentPosition = position;
		let currentDirection = direction;

		while (true) {
			const visitedCellWithDirection = `${currentPosition.x},${currentPosition.y},${currentDirection}`;
			if (visitedCellsWithDirections.has(visitedCellWithDirection)) {
				return true;
			}
			visitedCellsWithDirections.add(visitedCellWithDirection);

			const nextPosition = move(currentPosition, currentDirection);

			if (isOutOfGrid(grid, nextPosition)) return false;

			if (grid[nextPosition.y][nextPosition.x] === "#") {
				currentDirection = changeDirection(currentDirection);
			} else {
				currentPosition = nextPosition;
			}
		}
	}

	let obstructionsCausingLoopsCount = 0;

	for (let y = 0; y < grid.length; y++) {
		for (let x = 0; x < grid[y].length; x++) {
			if (
				grid[y][x] !== "." ||
				(x === startPosition.x && y === startPosition.y)
			) {
				continue;
			}

			grid[y][x] = "#";
			if (simulateGuardPath(grid, startPosition, startDirection)) {
				obstructionsCausingLoopsCount++;
			}
			grid[y][x] = ".";
		}
	}
	console.log("Valid obstructions:", obstructionsCausingLoopsCount);
	return obstructionsCausingLoopsCount;
}

async function getResults() {
	const controlResult = await countObstructionsCausingLoops(
		path.resolve(__dirname, "exampleInput.txt"),
	);
	console.log("Control result:", controlResult);

	const result = await countObstructionsCausingLoops(
		path.resolve(__dirname, "input.txt"),
	);
	console.log("Result:", result);

	return { controlResult, result };
}

getResults();
