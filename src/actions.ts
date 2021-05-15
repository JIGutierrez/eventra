type GenericFunction<In, Out> = (data: In) => Out | Promise<Out>;

/**
 * Represents a single step in an event.
 */
export class Action<I, O> {
  private executionFn: GenericFunction<I, O>;
  private compensation?: (data?: O, previousData?: I, err?: Error) => any;
  private retryFn?: GenericFunction<Error, boolean>;
  private next?: Action<O, any>;

  private constructor(
    executionFn: GenericFunction<I, O>,
    compensation?: (data?: O, previousData?: I, err?: any) => any,
    retryFn?: GenericFunction<Error, boolean>
  ) {
    this.executionFn = executionFn;
    this.compensation = compensation;
    this.retryFn = retryFn;
  }

  /**
   * Create a new Action
   * @param executionFn Function to execute
   * @param compensation Function to undo this action's changes.
   * @param retryFn Function that indicates if to retry execution or not.
   * @returns A new action with the same input and output as `executionFn`
   */
  static new<I, O>(
    executionFn: GenericFunction<I, O>,
    compensation?: (data?: O, previousData?: I, err?: any) => any,
    retryFn?: GenericFunction<Error, boolean>) {
    return new Action<I, O>(executionFn, compensation, retryFn)
  }

  /**
   * Execute this action and subsequent ones recursively.
   * @param data Input data for the execution function
   * @returns If the final action in an event, returns a Promise of the output of `executionFn`. Otherwise, returns the next action's execution.
   */
  async execute<N>(data: I): Promise<O | N> {
    let newData: O;
    try {
      newData = await this.executionFn(data);
    } catch (err) {
      if (this.retryFn && (await this.retryFn(err))) {
        return await this.execute(data);
      } else {
        throw err;
      }
    }
    return await this.executeNext<N>(data, newData);
  }


  private async executeNext<N>(data: I, newData: O): Promise<O | N> {
    if (this.next) {
      try {
        return await this.next.execute<N>(newData);
      } catch (err) {
        if (this.compensation) {
          await this.compensation(newData, data, err);
        }
        throw err;
      }
    }
    return newData;
  }

  /**
   * Set the next action to be executed (only once).
   * @param action Next action to be executed. Must have the same input as this action's output.
   * @returns Itself
   */
  setNext(action: Action<O, any>): Action<I, O> {
    if (this.next) {
      throw new Error('Next action already exists.');
    }
    this.next = action;
    return this;
  }

  /**
   * Function to run if subsequent actions fail.
   * @param compensation Function that receives this action's output, input, and the thrown error.
   * @returns Itself
   */
  compensate(compensation: (data?: O, previousData?: I, err?: Error) => any): Action<I, O> {
    if (this.compensation) {
      throw new Error('Compensation already exists.');
    }
    this.compensation = compensation;
    return this;
  }

  /**
   * Set the function that decides if to retry the execution.
   * @param retryFn Function that recieves the thrown error and returns a boolean.
   * @returns Itself
   */
  retry(retryFn: GenericFunction<Error, boolean>): Action<I, O> {
    if (this.retryFn) {
      throw new Error('Retry function already exists.');
    }
    this.retryFn = retryFn;
    return this;
  }
}
