/*
 * Copyright © 2023 NowSecure Inc.
 *
 * SPDX-License-Identifier: MIT
 */

import { expect, test } from "@oclif/test";
import { Column, outputFields, outputTable } from "../../src/utils";

interface TestObject {
  col1: string;
  col2: number;
  col3: string;
}

const cols: Column<TestObject>[] = [
  { heading: "Col1", data: "col1" },
  { heading: "Col2", data: (x) => x.col2.toFixed(2) },
  { heading: "Col3", data: "col3" },
];

const testArray: TestObject[] = [
  { col1: "one", col2: 1.0, col3: "just one" },
  { col1: "two", col2: 12, col3: "twelve" },
  { col1: "three", col2: 1 / 3, col3: "one third" },
];

describe("Table output", () => {
  test.it("outputFields", () => {
    const lines: string[] = [];
    const log = (line: string) => lines.push(line);

    outputFields(testArray[0], cols, log, "--");
    expect(lines).to.eql(["--Col1: one\n--Col2: 1.00\n--Col3: just one"]);
  });

  test.it("outputTable", () => {
    const lines: string[] = [];
    const log = (line: string) => lines.push(line);

    outputTable(testArray, cols, log, "--");
    expect(lines).to.eql([
      "--Col1   Col2   Col3       ",
      '--one    1.00   "just one" ',
      "--two    12.00  twelve     ",
      '--three  0.33   "one third"',
    ]);
  });
});
