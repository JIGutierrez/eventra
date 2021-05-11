type GenericFunction<In, Out> = (data: In) => Out | Promise<Out>;

export class Action<I, O> {
  private executionFn: GenericFunction<I, O>;
  private compensation?: (data: O, previousData: I, err?: Error) => any;
  private retryFn?: GenericFunction<Error, boolean>;
  private next?: Action<O, any>;

  constructor(
    executionFn: GenericFunction<I, O>,
    compensation?: (data: O, previousData: I, err?: any) => any,
    retryFn?: GenericFunction<Error, boolean>
  ) {
    this.executionFn = executionFn;
    this.compensation = compensation;
    this.retryFn = retryFn;
  }

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

  setNext(action: Action<O, any>) {
    if (this.next) {
      throw new Error('Next action already exists.');
    }
    this.next = action;
  }

  compensate(compensation: (data: O, previousData: I, err?: Error) => any) {
    if (this.compensation) {
      throw new Error('Compensation already exists.');
    }
    this.compensation = compensation;
  }

  retry(retryFn: GenericFunction<Error, boolean>) {
    if (this.retryFn) {
      throw new Error('Retry function already exists.');
    }
    this.retryFn = retryFn;
  }
}
