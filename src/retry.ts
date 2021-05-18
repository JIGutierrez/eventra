/**
 * Options for custom retry function.
 */
interface RetryOptions {
  /**
   * Number of times to retry. Default 1.
   */
  amount?: number;
  /**
   * Time in ms to wait before retrying. Run before custom function. Default 0.
   */
  delay?: number;
  /**
   * Function which recieves an error and returns a boolean, or a promise of a boolean. Default `() => true`.
   */
  custom?: (err?: Error) => boolean | Promise<boolean>;
}

const defaultOptions: Required<RetryOptions> = {
  amount: 1,
  delay: 0,
  custom: () => true
}

/** Helper class for making custom retry functions. */
export class Retry {

  private static sleep(delay: number) {
    return new Promise((res) => setTimeout(res, delay))
  }

  /**
   * Creates a new retry function.
   * @param options Options for the retry function with the following (optional) properties:
   * @returns New retry function.
   */
  static new(options: RetryOptions) {
    const opt = Object.assign({ ...defaultOptions }, options)
    let retries = opt.amount;

    return async (err?: Error) => {
      if (retries > 0) {
        await Retry.sleep(opt.delay)
        retries--;
        return await opt.custom(err);
      }
      return false;
    };
  }
}
