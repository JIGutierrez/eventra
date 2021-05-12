export class Retry {
  static new(times: number, delay?: number) {
    let i = 0;
    return async () => {
      if (i < times) {
        await new Promise((res) => setTimeout(res, delay || 0));
        i++;
        return true;
      }
      return false;
    };
  }
}
