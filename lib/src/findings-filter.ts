/*
 * Copyright © 2022 NowSecure Inc.
 *
 * SPDX-License-Identifier: MIT
 */

import { cloneDeep } from "lodash";
import { Maybe } from "./generated/graphql";
import { JSONType } from "./client";
import { ValueError } from "./errors";
import { Severity } from "./types";

export type FilterableFinding = {
  checkId: Maybe<string>;
  affected?: Maybe<boolean>;
  severity?: Maybe<Severity>;
  check?: Maybe<{
    issue?: Maybe<{
      warn?: Maybe<boolean>;
    }>;
  }>;
};

const severities = [
  Severity.Critical,
  Severity.High,
  Severity.Medium,
  Severity.Low,
  Severity.Info,
];

export interface Filter {
  includeChecks: string[];
  excludeChecks: string[];
  severityFilter: Severity[];
  includeWarnings: boolean;
}

export const DEFAULT_FILTER: Filter = {
  severityFilter: severityFilter(Severity.Medium),
  includeWarnings: false,
  includeChecks: [],
  excludeChecks: [],
};

/**
 * Converts a minimum severity level to the array of severities of that level or higher
 *
 * @param minSeverity minimum severity for the filter
 * @returns an array of all severities >= `minSeverity`
 */
export function severityFilter(minSeverity: Severity) {
  return severities.slice(0, severities.indexOf(minSeverity) + 1);
}

/** Returns true if the finding fulfills the requirements of the filter */
export function findingMatchesFilter(
  finding: FilterableFinding,
  filter: Filter
): boolean {
  if (!finding.affected) {
    return false;
  }

  if (filter.includeChecks && filter.includeChecks.includes(finding.checkId)) {
    return true;
  }

  if (filter.excludeChecks && filter.excludeChecks.includes(finding.checkId)) {
    return false;
  }

  if (
    filter.severityFilter &&
    filter.severityFilter.includes(finding.severity)
  ) {
    return true;
  }

  if (filter.includeWarnings && finding.check?.issue?.warn) {
    return true;
  }

  return false;
}

export function filterFindings<T extends FilterableFinding>(
  findings: T[],
  filter: Filter
) {
  return filter
    ? findings.filter((x) => findingMatchesFilter(x, filter))
    : findings;
}

export function filterAssessment(
  assessment: { report?: { findings: FilterableFinding[] } } | null | undefined,
  filter: Filter
) {
  if (filter && assessment?.report?.findings) {
    assessment.report.findings = filterFindings(
      assessment.report.findings,
      filter
    );
  }
}

/** Returns true if the test parameter is a (possibly empty) array of strings */
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export function isStringArray(test: any): test is string[] {
  return (
    Array.isArray(test) && test.findIndex((x) => typeof x !== "string") == -1
  );
}

function isValidCheck(checkInputs: JSONType, listName: string) {
  if (!isStringArray(checkInputs)) {
    throw new TypeError(`${listName} must be a list of strings`);
  }

  const filteredChecks = [
    ...new Set(checkInputs.map((check) => check.toLowerCase())),
  ];

  return filteredChecks;
}

export interface FilterConfig {
  "minimum-severity"?: Severity;
  "include-warnings"?: boolean;
  "include-checks"?: string[];
  "exclude-checks"?: string[];
}
/**
 * Parses and validates a single filter configuration
 *
 * @param filterConfig JSON representation of the filter
 * @returns
 */
export function parseFilter(filterConfig: FilterConfig): Filter {
  const checkedConfig: Filter = cloneDeep(DEFAULT_FILTER);
  const include = filterConfig["include-checks"];
  const exclude = filterConfig["exclude-checks"];
  const severityInput = filterConfig["minimum-severity"];
  const includeWarnings = filterConfig["include-warnings"];

  if (severityInput !== undefined) {
    if (typeof severityInput !== "string") {
      throw new TypeError("minimum-severity must be a string");
    }

    if (!severities.includes(severityInput.toLowerCase() as Severity)) {
      throw new ValueError(
        `${severityInput} is not a valid severity filter type`
      );
    }

    checkedConfig.severityFilter = severityFilter(severityInput as Severity);
  }

  if (include) {
    checkedConfig.includeChecks = isValidCheck(include, "include");
  }
  if (exclude) {
    checkedConfig.excludeChecks = isValidCheck(exclude, "exclude");
  }

  if (includeWarnings !== undefined) {
    if (typeof includeWarnings !== "boolean") {
      throw new TypeError(
        "include-warnings must be a boolean value if specified"
      );
    }
    checkedConfig.includeWarnings = includeWarnings;
  }

  // throw an error if checkId is found in both lists
  if (checkedConfig.includeChecks && checkedConfig.excludeChecks) {
    const combinedChecks = [
      ...checkedConfig.includeChecks,
      ...checkedConfig.excludeChecks,
    ].filter((check, idx, arr) => arr.indexOf(check) !== idx);

    if (combinedChecks.length)
      throw new ValueError(
        `Unique checkId(s) must be limited to either the exclude or include list. 
        The following checkId(s) were found in both: ${combinedChecks}`
      );
  }
  return checkedConfig;
}
