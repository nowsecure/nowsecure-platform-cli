/*
 * Copyright © 2022 NowSecure Inc.
 *
 * SPDX-License-Identifier: MIT
 */

export type generator<T> = keyof T | ((value: T) => string);
export interface Column<T> {
  heading: string;
  data: generator<T>;
}

function getGenerator<T>(gen: generator<T>): (value: T) => string {
  if (typeof gen !== "function") {
    return (x: T) => "" + x[gen];
  }
  return gen;
}

export function outputFields<T>(
  item: T,
  fields: Column<T>[],
  log: (x: string) => void,
  prefix = ""
) {
  const generators = fields.map((field) => getGenerator(field.data));
  const lines = fields.map(
    (field, index) => `${prefix}${field.heading}: ${generators[index](item)}`
  );
  log(lines.join("\n"));
}

export function outputTable<T>(
  iter: Iterable<T>,
  columns: Column<T>[],
  log: (x: string) => void,
  prefix = ""
) {
  const lines = [columns.map((col) => col.heading)];
  const generators = columns.map((col) => getGenerator(col.data));

  for (const value of iter) {
    lines.push(
      generators.map((gen) => {
        const s = gen(value);
        if (s.indexOf(" ") >= 0) {
          return `"${s}"`;
        }
        return s;
      })
    );
  }

  const colWidth = (index: number) => {
    return Math.max(...lines.map((line) => line[index].length));
  };
  const widths = columns.map((_value, index) => colWidth(index));

  const padColumn = (value: string, index: number) => {
    return value.padEnd(widths[index]);
  };

  for (const line of lines) {
    log(prefix + line.map(padColumn).join("  "));
  }
}
