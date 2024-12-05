# 🎄 ADVENT OF CODE — 2024 EDITION 🎄

A little something to reflect upon what I have had the opportunity to practice so far:

## **Day 1**  :star: :star:

🎯 Goal: calculate distances

**Reading raw input files:**

- Use `fs/promises` to read input from `.txt` files

**Sorting and pairing Data:**

- Sorting two lists independently to calculate minimal distances between corresponding elements,
- Pairwise comparisons between sorted arrays.

**Array Transformations:**

- Using mapping, filtering, and transformations (`.sort()`, `.filter()`, `.reduce()`, etc) to process data efficiently,
- Calculating metrics like total distance (sum of absolute differences with `Math.abs`) and similarity scores (matching values weighted by their occurrences).

**Reusable methods:**

- Writing separate utility functions for tasks like reading input files, resolving puzzles and obtaining final results

## **Day 2**  :star: :star:

🎯 Goal: analyze data reports

**Conditional logic:**

- Implementation of rules to determine if a report is "safe" based on given constraints such as consecutive differences between values (e.g., gaps of 1-3 allowed),
- Handling alternative cases by assessing reports safety with or without removing a single value.

**Iterations:**

- Iterating through data (arrays of numbers) to check properties like strinctly increasing or strictly decreasing trends.

## **Day 3**  :star: :star:

🎯 Goal: check on corrupted memory file

**Regex for data extraction:**

- Using regular expressions to extract structured instructions (`mul(X,Y)`, `do()`, `don't()`) from noisy input,
- Checking several regex all at once thanks to `|`.

**Handling operations based on dynamic constraints updates:**

- Managing state (e.g., toggling multiplication steps on/off) based on conditional instructions.

**Array-based processing:**

- Storing extracted instructions in arrays and iterating through them to compute results conditionally,
- Transforming raw string instructions into numerical data and applying arithmetic operations.
