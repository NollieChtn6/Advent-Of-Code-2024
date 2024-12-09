import * as fs from "node:fs/promises";
import * as path from "node:path";

type DiskMap = (string | ".")[];

async function readInput(filePath: string): Promise<string[]> {
	const rawInput = await fs.readFile(filePath, "utf-8");
	// console.log("Raw input:", rawInput);
	const formattedInput = rawInput.split("");
	// console.log("Formatted input:", formattedInput);
	return formattedInput;
}

async function generateDiskMap(filePath: string): Promise<DiskMap> {
	const blocks = await readInput(filePath);

	let fileId = 0;
	const diskMap: DiskMap = [];
	let blockIsFile = true;

	for (let blockIndex = 0; blockIndex < blocks.length; blockIndex++) {
		const length = Number(blocks[blockIndex]);
		if (blockIsFile) {
			for (let slotIndex = 0; slotIndex < length; slotIndex++) {
				diskMap.push(fileId.toString());
			}
			fileId++;
		} else {
			for (let slotIndex = 0; slotIndex < length; slotIndex++) {
				diskMap.push(".");
			}
		}
		blockIsFile = !blockIsFile;
	}
	// console.log("Disk map:", diskMap);
	return diskMap;
}

async function compactDiskMap(filePath: string): Promise<number> {
	const diskMap = await generateDiskMap(filePath);

	for (let readIndex = diskMap.length - 1; readIndex >= 0; readIndex--) {
		if (diskMap[readIndex] !== ".") {
			const firstEmptySpaceIndex = diskMap.indexOf(".");
			if (firstEmptySpaceIndex < readIndex) {
				diskMap[firstEmptySpaceIndex] = diskMap[readIndex];
				diskMap[readIndex] = ".";
			}
		}
	}

	let checkSum = 0;
	for (let i = 0; i < diskMap.length; i++) {
		if (diskMap[i] !== ".") {
			checkSum += i * Number(diskMap[i]);
		}
	}
	return checkSum;
}

async function getResults() {
	const controlResult = await compactDiskMap(
		path.resolve(__dirname, "exampleInput.txt"),
	);
	console.log("Control result:", controlResult);

	const result = await compactDiskMap(path.resolve(__dirname, "input.txt"));
	console.log("Result:", result);

	return { controlResult, result };
}

getResults();
