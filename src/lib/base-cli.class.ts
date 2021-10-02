/**
 * Abstract class for CLI processing and output
 */
export abstract class BaseCli {
  /**
   * Is cli done mode flag
   */
  private _isDone = false;

  /**
   * Is interactive mode flag
   */
  private _isInteractive = false;

  /**
   * Is debug mode flag
   */
  private _isDebug = false;

  /**
   * Constructor of abstract class
   */
  constructor() {
    const args = process.argv.slice(2);
    this._isInteractive = args.includes('--interactive');
    this._isDebug = args.includes('--debug');
  }
  /**
   * Returns true if app was started with --debug
   *
   * @returns true if in debug mode
   */
  public get isDebug(): boolean {
    return this._isDebug;
  }

  /**
   * Is application started in interactive mode (= prints out some additional help)
   *
   * @returns true if app is done
   */
  public get isDone(): boolean {
    return this._isDone;
  }

  /**
   * Set if processing is complete
   */
  protected set isDone(value: boolean) {
    this._isDone = value;
  }

  /**
   * Is application started in interactive mode (= prints out some additional help)
   *
   * @returns true if in interactive mode
   */
  public get isInteractive(): boolean {
    return this._isInteractive;
  }

  /**
   * Process the stdin line
   *
   * @param line input line from stdin
   */
  public abstract processLine(line: string): void;

  /**
   * Print basic instructions about this cli mode
   */
  public abstract printInstructions(): void;

  /**
   * Prints out the stored output content to console (stdout) and clears it afterwards
   */
  public stdout(): void {
    this._output.forEach((msg) => console.log(msg));
    this.clearOutput();
  }

  /**
   * Stores output string for console
   */
  private _output: string[] = [];

  /**
   * Get current output, useful for printing or testing
   *
   * @returns stored string output
   */
  public get output(): string[] {
    return this._output;
  }

  /**
   * Clear the output
   */
  public clearOutput(): void {
    this._output = [];
  }
}
