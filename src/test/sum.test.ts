import { test, expect } from "vitest";
import { sum } from "./sum";

test("1 plus 2 equals 3", () => {
  expect(sum(1, 2)).toEqual(3);
});
