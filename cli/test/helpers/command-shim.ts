/*
 * Copyright © 2023 NowSecure Inc.
 *
 * SPDX-License-Identifier: MIT
 */

import { format } from "util";
import { PrettyPrintableError } from "@oclif/core/lib/interfaces";
import { CommandCore } from "../../src/utils";
import { ValueError } from "@nowsecure/platform-lib";

export class CommandShim implements CommandCore {
  logs: string[] = [];
  warnings: (string | Error)[] = [];
  errors: (string | Error)[] = [];
  exitMsg?: string;
  exitCode?: number;

  constructor() {
    this.reset();
  }

  reset() {
    this.logs = [];
    this.warnings = [];
    this.errors = [];
    this.exitMsg = undefined;
    this.exitCode = undefined;
  }

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  log(message?: string, ...args: any[]): void {
    this.logs.push(format(message, ...args));
  }

  warn(input: string | Error): string | Error {
    this.warnings.push(input);
    return input;
  }

  error(
    input: string | Error,
    options: {
      code?: string;
      exit: false;
    } & PrettyPrintableError
  ): void;
  error(
    input: string | Error,
    options?: {
      code?: string;
      exit?: number;
    } & PrettyPrintableError
  ): never;
  error(
    input: string | Error,
    options: {
      code?: string;
      exit?: number | false;
    } & PrettyPrintableError = {}
  ): void {
    this.errors.push(input);
    if (options?.exit !== false) {
      this.exitCode = options?.exit;
      this.exitMsg = options?.code;
      throw new ValueError(input.toString());
    }
  }
}
