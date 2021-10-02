import { basename } from 'path';
import readline from 'readline';

import colors from 'colors';

import { BaseCli } from './base-cli.class';
import { FibonacciCli } from './fib/fibonacci-cli.class';
import { LabyrinthCli } from './lab/labyrinth-cli.class';
import { CliMode } from './shared/cli-mode.enum';

/**
 * Active CLI application (exposed for testing)
 */
export let cliApp: BaseCli;

/**
 * Function to kickstart application
 */
export function bootstrap(): void {
  // init
  const args = process.argv.slice(2);

  // find out what app mode we want
  switch (args.length > 0 ? args[0] : 'N/A') {
    case CliMode.Fibonacci:
      cliApp = new FibonacciCli();
      break;
    case CliMode.Labyrinth:
      cliApp = new LabyrinthCli();
      break;
    default:
      console.error(
        'Invalid application mode as first parameters, usage: '.red
      );
      console.error(
        `${basename(__filename)} <${Object.values(CliMode)
          .map((c) => colors.cyan(c))
          .join('|')}> <${colors.yellow('(optional: input content)')}>`
      );
      process.exit(1);
  }

  // print out instructions if we have any (and if flag is set)
  cliApp.printInstructions();
  cliApp.stdout();

  // Read input handling
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });

  rl.on('line', function (line) {
    try {
      // process line...
      cliApp.processLine(line);
      // ... and output to stdout
      cliApp.stdout();

      // are we done? exit 0
      if (cliApp.isDone) {
        rl.close();
      }
    } catch (err) {
      // handle error and exit 1
      console.error('Fatal Error:'.red.bold, (err as Error).message.red);
      rl.close();
    }
  });

  // if we do not use stdin reading directly, we trigger the close and exit
  rl.on('close', function () {
    process.exit(cliApp.isDone ? 0 : 1);
  });

  // We have two modes, either read input continuously or we can also supply the whole content as 2nd argument and stop afterwards:
  if (args.length > 1 && !args[1].startsWith('--')) {
    // parse the content into lines (apparently newline char is not properly recognized)
    args[1].split(/\n|\\n|\\r\\n/).forEach((line) => {
      rl.emit('line', line);
    });
    // we are done, emit close after emitting line events
    rl.close();
  }
}
