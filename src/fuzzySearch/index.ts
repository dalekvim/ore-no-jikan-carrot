// Creates an empty 2D array.
const array2D = (rows: number, columns: number) =>
  Array.from(Array(rows), () => new Array(columns));

// Returns 0 if the two inputs match and 1 otherwise.
const delta = (i: any, j: any): number => (i == j ? 0 : 1);

export const editDistance = (pattern: String, text: String): number => {
  // Initialises the 2D array.
  const editDistanceArray = array2D(pattern.length + 1, text.length + 1);

  // Initialises the first row with all zeros.
  editDistanceArray[0].fill(0);

  // Initialises the first column with the numbers from 0 to pattern.length + 1.
  for (const i in editDistanceArray) {
    editDistanceArray[i][0] = Number(i);
  }

  // Loops though each cell in the array.
  for (let i = 1; i <= pattern.length; i++) {
    for (let j = 1; j <= text.length; j++) {
      // Obtains the values of the cells above, to the left of, and top left of the current cell.
      const top = editDistanceArray[Number(i) - 1][Number(j)];
      const left = editDistanceArray[Number(i)][Number(j) - 1];
      const topLeft = editDistanceArray[Number(i) - 1][Number(j) - 1];

      // Calculates and assigns the edit distance of the cell.
      editDistanceArray[i][j] = Math.min(
        top + 1,
        left + 1,
        topLeft + delta(pattern[i - 1], text[j - 1])
      );
    }
  }

  // Returns the least value of the bottom row of the array.
  return Math.min(...editDistanceArray[editDistanceArray.length - 1]);
};
