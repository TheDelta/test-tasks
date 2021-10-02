import { randomInt } from 'crypto';
import { performance } from 'perf_hooks';

import test from 'ava';
import sinon from 'sinon';

import { FibonacciCli } from './fibonacci-cli.class';

test('should process Fibonacci example correctly', (t) => {
  const example = [5, 7, 11];

  const app = new FibonacciCli();
  example.forEach((line) => {
    app.processLine(line.toString());
  });
  t.deepEqual(app.output, [
    'Die Fibonacci Zahl für 5 ist: 5',
    'Die Fibonacci Zahl für 7 ist: 13',
    'Die Fibonacci Zahl für 11 ist: 89',
  ]);
});

test('some more fibonacci tests', (t) => {
  const app = new FibonacciCli();
  app.processLine('1000');
  t.deepEqual(app.output, [
    'Die Fibonacci Zahl für 1000 ist: 43466557686937456435688527675040625802564660' +
      '51737178040248172908953655541794905189040387984007925516929592259308032263477' +
      '5209689623239873322471161642996440906533187938298969649928516003704476137795166849228875',
  ]);
});

test(`523 random numbers should be faster than ${FibonacciCli.maxDuration}s`, (t) => {
  const app = new FibonacciCli();
  const start = performance.now();
  app.processLine('1000');
  for (let i = 0; i < 523; i++) {
    app.processLine(randomInt(5000).toString());
  }
  const duration = performance.now() - start;
  t.log(`Duration was: ${duration}ms`);
  t.true(duration <= FibonacciCli.maxDuration * 1000);
});

test('Should throw if max execution exceeded', (t) => {
  const performanceStub = sinon
    .stub(performance, 'now')
    .callsFake(() => FibonacciCli.maxDuration + FibonacciCli.startTime + 10);
  t.throws(() => FibonacciCli.maxDurationCheck(), { instanceOf: Error });
  performanceStub.restore();
});

test('Should throw if number is NaN', (t) => {
  const app = new FibonacciCli();
  t.throws(() => app.processLine('invalid'), { instanceOf: Error });
});

test('Should throw if number is out of range', (t) => {
  const app = new FibonacciCli();
  t.throws(
    () => app.processLine((FibonacciCli.allowedNumberRange[0] - 1).toString()),
    { instanceOf: Error }
  );
  t.throws(
    () => app.processLine((FibonacciCli.allowedNumberRange[1] + 1).toString()),
    { instanceOf: Error }
  );
});

test('Should output some debug info with --debug', (t) => {
  const argv = process.argv;

  const debugSpy = sinon.spy(console, 'debug');

  // without debug
  let app = new FibonacciCli();

  app.processLine('500');
  t.true(!debugSpy.called);

  // with debug
  process.argv.push('--debug');
  app = new FibonacciCli();

  app.processLine('500');
  t.true(debugSpy.called);

  // restore
  debugSpy.restore();
  process.argv = argv;
});
