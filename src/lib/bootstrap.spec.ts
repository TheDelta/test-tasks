import testParallel from 'ava';
import sinon from 'sinon';

import { bootstrap, cliApp } from './bootstrap';
import { mockExampleLabyrinth } from './mock';
import { CliMode } from './shared/cli-mode.enum';

// ! these tests mut be run serial or stub will fail due to parallel / async !
const test = testParallel.serial;

/**
 * Sandbox which can be restored
 */
const sandbox = sinon.createSandbox();
/**
 * console.error stub
 */
let errorSpy: sinon.SinonStub;
/**
 * console.log stub
 */
let logSpy: sinon.SinonStub;

test.beforeEach(() => {
  errorSpy = sandbox.stub(console, 'error');
  logSpy = sandbox.stub(console, 'log');
  process.argv = ['a', 'b'];
});

test.afterEach(() => {
  sandbox.restore();
  process.argv = [];
});

// Mode Error handling

test('should throw error if no app mode was supplied', (t) => {
  const exitSpy = sandbox.stub(process, 'exit').callsFake((code) => {
    throw new EvalError(code?.toString()); // we need to fake a throw and validate it, because process.exit must stop execution
  });

  t.throws(() => bootstrap(), { message: '1', instanceOf: EvalError });
  t.true(exitSpy.calledWith(1));
  t.truthy(errorSpy.callCount);
});

test('should throw error if invalid mode was supplied', (t) => {
  process.argv = ['a', 'b', 'test'];
  const exitSpy = sandbox.stub(process, 'exit').callsFake((code) => {
    throw new EvalError(code?.toString()); // we need to fake a throw and validate it, because process.exit must stop execution
  });

  t.throws(() => bootstrap(), { message: '1', instanceOf: EvalError });
  t.true(exitSpy.calledWith(1));
  t.truthy(errorSpy.callCount);
});

// Fibonacci

test('should bootstrap Fibonacci', (t) => {
  process.argv = process.argv.concat([CliMode.Fibonacci]);

  t.notThrows(() => bootstrap());
  t.truthy(cliApp);
  t.false(cliApp.isDone);
  t.true(!errorSpy.callCount);
});

// Labyrinth

test('should bootstrap Labyrinth', (t) => {
  process.argv = process.argv.concat([CliMode.Labyrinth]);

  t.notThrows(() => bootstrap());
  t.truthy(cliApp);
  t.false(cliApp.isDone);
  t.false(cliApp.isInteractive);
  t.true(!errorSpy.callCount);
});

test('should go through the example successfully', (t) => {
  process.argv = process.argv.concat([CliMode.Labyrinth, mockExampleLabyrinth]);
  const exitSpy = sandbox.stub(process, 'exit').callsFake(((code) => {
    if (code === 0) {
      t.pass('Application successfully exited');
    } else {
      t.fail('Application exit code: ' + code);
    }
  }) as (code: number | undefined) => never);

  bootstrap();
  t.true(exitSpy.called);

  process.stdin.emit('close');

  t.truthy(cliApp);
  t.true(cliApp.isDone);
  t.false(cliApp.isInteractive);
  t.true(!errorSpy.callCount);
  t.truthy(logSpy.callCount);
});

// Flag tests

test('should bootstrap Labyrinth with --interactive', (t) => {
  process.argv = process.argv.concat([CliMode.Labyrinth, '--interactive']);

  t.notThrows(() => bootstrap());
  t.truthy(cliApp);
  t.false(cliApp.isDone);
  t.true(cliApp.isInteractive);
  t.true(!errorSpy.callCount);
  t.truthy(logSpy.callCount);
});

test('should bootstrap Fibonacci with --interactive', (t) => {
  process.argv = process.argv.concat([CliMode.Fibonacci, '--interactive']);

  t.notThrows(() => bootstrap());
  t.truthy(cliApp);
  t.false(cliApp.isDone);
  t.true(cliApp.isInteractive);
  t.true(!errorSpy.callCount);
  t.truthy(logSpy.callCount);
});

// Handle error in processing

test('should handle thrown error in Fibonacci', (t) => {
  process.argv = process.argv.concat([CliMode.Fibonacci, 'invalid_number']);

  sandbox.stub(process, 'exit').callsFake((code) => {
    if (code === 1) {
      t.pass('Application recognized error and terminated with exit code');
    }
    throw new EvalError('1337');
  });

  t.throws(() => bootstrap(), { instanceOf: EvalError, message: '1337' });
  t.truthy(cliApp);
  t.false(cliApp.isDone);
  t.true(errorSpy.callCount === 1);
});
