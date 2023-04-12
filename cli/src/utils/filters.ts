/*
 * Copyright © 2023 NowSecure Inc.
 *
 * SPDX-License-Identifier: MIT
 */

import { Filter, parseFilter } from "@nowsecure/platform-lib";
import { Severity } from "@nowsecure/platform-lib/lib/types";
import { Flags } from "@oclif/core";
import { FlagProps } from "@oclif/core/lib/interfaces/parser";
import { flattenCommaSeparated } from "./parsers";

export function makeFilterFlags(additional: Partial<FlagProps> = {}) {
  return {
    "min-severity": Flags.string({
      char: "m",
      summary: "minimum severity to report",
      options: [
        "critical",
        "c",
        "high",
        "h",
        "medium",
        "m",
        "low",
        "l",
        "info",
        "i",
      ],
      ...additional,
    }),
    warnings: Flags.boolean({
      char: "w",
      summary: "Include warnings",
      ...additional,
    }),
    include: Flags.string({
      char: "i",
      multiple: true,
      summary: "Findings that should always be included",
      ...additional,
    }),
    exclude: Flags.string({
      char: "e",
      multiple: true,
      summary: "Findings that should always be excluded",
      ...additional,
    }),
    "all-findings": Flags.boolean({
      char: "a",
      summary: "show all findings",
      exclusive: ["min-severity", "warnings", "include", "exclude"],
      ...additional,
    }),
  };
}

export const filterFlags = makeFilterFlags();

export type FilterFlags = {
  "min-severity"?: string;
  include?: string[];
  exclude?: string[];
  warnings?: boolean;
  "all-findings"?: boolean;
};

const severityOptions: Record<string, Severity> = {
  critical: Severity.Critical,
  c: Severity.Critical,
  high: Severity.High,
  h: Severity.High,
  medium: Severity.Medium,
  m: Severity.Medium,
  low: Severity.Low,
  l: Severity.Low,
  info: Severity.Info,
  i: Severity.Info,
};

export function getFilter(flags: FilterFlags): Filter | undefined {
  if (flags["all-findings"]) {
    return undefined;
  }
  const filterIncludes = flattenCommaSeparated(flags.include);
  const filterExcludes = flattenCommaSeparated(flags.exclude);
  const minSeverity = severityOptions[flags["min-severity"] || "medium"];
  return parseFilter({
    "minimum-severity": minSeverity,
    "include-warnings": flags.warnings,
    "exclude-checks": filterExcludes,
    "include-checks": filterIncludes,
  });
}
