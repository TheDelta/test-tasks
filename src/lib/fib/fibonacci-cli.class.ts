import { performance } from 'perf_hooks';

import { BaseCli } from '../base-cli.class';

import { fibonacci } from './fibonacci';

/**
 * Handle the CLI input and flow
 */
export class FibonacciCli extends BaseCli {
  /**
   * Range [min, max] of allowed number to generate Fibonacci number of
   */
  public static readonly allowedNumberRange = [0, 5000];
  /**
   * Max duration in ms before Fibonacci calculation is stopped
   */
  public static readonly maxDuration = 30 * 1000;
  /**
   * Exposes start time before first Fibonacci calculation
   *
   * @returns start time before first Fibonacci calculation
   */
  public static get startTime(): number {
    return this._startTime;
  }

  /**
   * Check if Fibonacci tasks are running too long, will throw error if {@link maxDuration} has been reached
   */
  public static maxDurationCheck(): void | never {
    const duration = performance.now() - FibonacciCli.startTime;
    if (duration >= FibonacciCli.maxDuration) {
      throw new Error(
        `Abort execution! Operation took ${duration} ms (max duration is ${FibonacciCli.maxDuration}s)`
      );
    }
  }

  private static _startTime = 0;

  /**
   * Print information about the Fibonacci app
   */
  public printInstructions(): void {
    if (!this.isInteractive) return;

    this.output.push(
      'Fibonacci -- Enter one number per line and receive the Fibonacci number of it:'
        .cyan
    );
  }

  /**
   * Process each line as number and get Fibonacci number of it
   *
   * @param line the stdin input
   */
  public processLine(line: string): void {
    line = line.trim(); // be forgiving if there are spaces at start / end

    if (isNaN(+line)) {
      throw new Error(`Line "${line}" is not a number!`);
    }

    if (
      +line < FibonacciCli.allowedNumberRange[0] ||
      +line > FibonacciCli.allowedNumberRange[1]
    ) {
      throw new Error(
        `Given number "${line}" is not in range between ${
          FibonacciCli.allowedNumberRange.join('-').yellow
        }}!`
      );
    }

    // store the start time for the first processing, to abort in x sec
    if (FibonacciCli._startTime === 0) {
      FibonacciCli._startTime = performance.now();
    }

    this.output.push(
      `Die Fibonacci Zahl für ${line} ist: ` + fibonacci(parseInt(line))
    );

    if (this.isDebug) {
      const duration = performance.now() - FibonacciCli._startTime;
      console.debug('[DEBUG] Duration (' + (duration / 1000).toFixed(7) + 's)');
      const used = process.memoryUsage().heapUsed / 1024 / 1024;
      console.debug(`[DEBUG] The script process uses ~${used.toFixed(3)} Mb`);
    }
  }
}
