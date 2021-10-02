import { FibonacciCli } from './fibonacci-cli.class';

/**
 * Entry function for fibonacci, does some validation before going into {@link fibonacci_recursive}
 *
 * @param num input number to get fibonacci number of
 * @returns fibonacci number or error if input number ins invalid
 */
export function fibonacci(num: number): string {
  if (typeof num !== 'number') {
    throw new Error('Invalid number');
  }

  if (num < 0) {
    throw new Error('Only positive numbers are allowed!');
  }

  // don't use this unless you want to waste your time
  if (!process.argv.includes('--fib-recursive')) {
    return fibonacci_cached_loop(BigInt(num));
  }

  return fibonacci_recursive(BigInt(num)).toString();
}

/**
 * Recursive function to calculate fibonacci number
 *
 * First attempt and horrible performance :)
 *
 * @param n number to get fibonacci number from
 * @returns number (as string) or throws error
 */
function fibonacci_recursive(n: bigint): bigint {
  FibonacciCli.maxDurationCheck();

  if (n >= 2) {
    return (
      fibonacci_recursive(n - BigInt(1)) + fibonacci_recursive(n - BigInt(2))
    );
  }

  return n;
}

/**
 * Loop + cache for faster calculation of fibonacci number
 *
 * NOTE we could keep the cache for future calculation or also store it in a file later usage
 *
 * @param n number to get fibonacci number from
 * @returns number (as string) or throws error
 */
function fibonacci_cached_loop(n: bigint): string {
  const f: { [index: string]: bigint } = {};
  f[0] = BigInt(0);
  f[1] = BigInt(1);
  for (let i = 2; i <= n; i++) {
    FibonacciCli.maxDurationCheck();
    f[i] = f[i - 1] + f[i - 2];
  }

  return f[n.toString()].toString();
}
