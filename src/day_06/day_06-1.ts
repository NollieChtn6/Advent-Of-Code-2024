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

async function countGuardSteps(filePath: string): Promise<number> {
	const grid = await readInput(filePath);
	// console.table(grid);

	// guard's starting position and direction
	let position: Position | null = null;
	let direction: Direction = "up";

	for (let y = 0; y < grid.length; y++) {
		for (let x = 0; x < grid[y].length; x++) {
			if (grid[y][x] === "^") {
				position = { x, y };
				direction = "up";
			} else if (grid[y][x] === ">") {
				position = { x, y };
				direction = "right";
			} else if (grid[y][x] === "v") {
				position = { x, y };
				direction = "down";
			} else if (grid[y][x] === "<") {
				position = { x, y };
				direction = "left";
			}
		}
	}

	if (!position) throw new Error("Guard starting point not found!");

	// Avoiding duplicate keys: https://stackoverflow.com/questions/10757516/how-to-prevent-adding-duplicate-keys-to-a-javascript-array
	const visitedCells = new Set<string>(); // instead of array to avoid duplicates
	visitedCells.add(`${position.x},${position.y}`); // first cell visited = starting point

	while (true) {
		const nextPosition = move(position, direction);
		if (isOutOfGrid(grid, nextPosition)) break;
		if (grid[nextPosition.y][nextPosition.x] === "#") {
			direction = changeDirection(direction);
		} else {
			position = nextPosition;
			visitedCells.add(`${position.x},${position.y}`);
		}
	}

	// console.log("Visited cells:", visitedCells);
	return visitedCells.size;
}

async function getResults() {
	const controlResult = await countGuardSteps(
		path.resolve(__dirname, "exampleInput.txt"),
	);
	console.log("Control result:", controlResult);

	const result = await countGuardSteps(path.resolve(__dirname, "input.txt"));
	console.log("Result:", result);

	return { controlResult, result };
}

getResults();
