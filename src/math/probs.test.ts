import { cartesian, OddsCalculator, getAllowedColumns } from "../math/probs";

import each from "jest-each";
describe("cartesian", () => {
  each([
    [
      [
        [1, 2],
        [3, 4],
      ],
      [
        [1, 3],
        [1, 4],
        [2, 3],
        [2, 4],
      ],
    ],
    [
      [[1, 2], [1, 2], [3]],
      [
        [1, 1, 3],
        [1, 2, 3],
        [2, 1, 3],
        [2, 2, 3],
      ],
    ],
  ]).it("case %s %s", (arrays, expected) => {
    expect(cartesian(...arrays)).toEqual(expected);
  });
});

describe("buildDice2sums", () => {
  each([
    [
      2,
      2,
      {
        "1,1": new Set([2]),
        "1,2": new Set([3]),
        "2,1": new Set([3]),
        "2,2": new Set([4]),
      },
    ],
    [
      3,
      2,
      {
        "1,1,1": new Set([2]),
        "1,1,2": new Set([2, 3]),
        "1,2,1": new Set([2, 3]),
        "1,2,2": new Set([3, 4]),
        "2,1,1": new Set([2, 3]),
        "2,1,2": new Set([3, 4]),
        "2,2,1": new Set([3, 4]),
        "2,2,2": new Set([4]),
      },
    ],
  ]).it("case %s %s %", (numDice, numSides, expected) => {
    const dice2sums = new OddsCalculator(numDice, numSides).buildDice2sums();
    expect(dice2sums).toEqual(expected);
  });
});

test("test 4 dice 6 sides", () => {
  const dice2sums = new OddsCalculator().buildDice2sums();
  expect(Object.keys(dice2sums).length).toEqual(6 * 6 * 6 * 6);
});

describe("oddsBust", () => {
  each([
    [2, 3, [2, 3, 4, 5, 6], 0],
    [2, 3, [3, 4, 5, 6], 1 - 8 / 9],
    [2, 3, [3, 4, 5], 2 / 9],
    //
    [4, 6, [], 1],
    [4, 6, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 0],
    [4, 6, [6, 7, 8], 1 - 0.9197530864197531],
    [4, 6, [1], 1],
    [4, 6, [2], 1 - (1 + 4 * 5 + 6 * 25) / Math.pow(6, 4)],
    [4, 6, [2, 12], 1 - (2 * (1 + 4 * 5 + 6 * 25) - 6) / Math.pow(6, 4)],
    [4, 6, [2, 3, 4, 5, 7, 9, 10, 11, 12], 10 / Math.pow(6, 4)],
  ]).it("case %s %s %s %s", (numDice, numSides, allowedSums, expected) => {
    expect(
      new OddsCalculator(numDice, numSides).oddsBust(allowedSums)
    ).toBeCloseTo(expected, 16);
  });
});

describe("getAllowedColumns", () => {
  each([
    [{}, {}, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]],
    [{}, { 12: 0 }, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11]],
    [{}, { 12: 0, 11: 1 }, [2, 3, 4, 5, 6, 7, 8, 9, 10]],
    [{ 2: 1 }, {}, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]],
    [{ 2: 1, 3: 3 }, {}, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]],
    [{ 2: 1, 3: 3, 4: 1 }, {}, [2, 3, 4]],
    [{ 2: 1, 3: 3, 4: 1 }, { 5: 1 }, [2, 3, 4]],
    [{ 2: 1, 3: 3, 4: 1 }, { 5: 1, 6: 0 }, [2, 3, 4]],
    // That's the tricky case where we are at the top of a column
    [{ 2: 3, 3: 3, 4: 1 }, {}, [3, 4]],
    // If we are only one behind this adds a column!
    [{ 2: 2, 3: 3, 4: 1 }, {}, [2, 3, 4]],
    //
    [{ 2: 3, 3: 5, 12: 3 }, {}, []],
    [{ 2: 3, 3: 4, 12: 3 }, {}, [3]],
    [{ 2: 3, 12: 3 }, {}, [3, 4, 5, 6, 7, 8, 9, 10, 11]],
    // 2 blocked because at the top, one blocked by someone, all the rest is fair game!
    [{ 2: 3, 12: 3 }, { 3: 1 }, [4, 5, 6, 7, 8, 9, 10, 11]],
    [{ 2: 2, 12: 3 }, { 3: 1 }, [2, 4, 5, 6, 7, 8, 9, 10, 11]],
  ]).it("case %s %s", (currentPositions, blockedSums, expected) => {
    expect(getAllowedColumns(currentPositions, blockedSums)).toEqual(expected);
  });
});
