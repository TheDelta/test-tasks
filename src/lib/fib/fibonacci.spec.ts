import test from 'ava';

import { fibonacci } from './fibonacci';

test('should throw error for number is not positive', (t) => {
  t.throws(() => fibonacci(-1), { instanceOf: Error });
});

test('should throw error for invalid number', (t) => {
  t.throws(() => fibonacci('abc' as unknown as number), { instanceOf: Error });
});

test('should handle (bad performing) recursive', (t) => {
  const argv = process.argv;
  process.argv.push('--fib-recursive');
  t.deepEqual(fibonacci(0), '0');
  t.deepEqual(fibonacci(1), '1');
  t.deepEqual(fibonacci(5), '5');
  t.deepEqual(fibonacci(7), '13');
  process.argv = argv;
});
