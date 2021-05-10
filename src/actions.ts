type GenericFunction<In, Out> = (data: In) => Out | Promise<Out>;

export class Action<I, O> {
  executionFn: GenericFunction<I, O>;
  compensation?: Action<any, any>;
  retryFn?: GenericFunction<any, boolean>;
  previousAction?: Action<any, I>;
  next?: Action<O, any>;

  constructor(
    executionFn: GenericFunction<I, O>,
    compensation?: Action<O, I>,
    retryFn?: GenericFunction<any, boolean>,
    previousAction?: Action<any, I>
  ) {
    this.executionFn = executionFn;
    this.compensation = compensation;
    this.retryFn = retryFn;
    this.previousAction = previousAction;
  }

  async execute(data: I): Promise<O> {
    try {
      const newData = await this.executionFn(data);
      if (this.next) {
        return this.next.execute(newData);
      }
      return newData;
    } catch (err) {
      if (this.retryFn && this.retryFn(err)) {
        return this.execute(data);
      }
      throw err;
    }
  }
}
