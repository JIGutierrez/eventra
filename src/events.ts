import { Action } from './actions';

export class Eventra<I = void, O = void> {
  private name: string;
  private actions: Action<any, any>[];

  private constructor(name: string, actions?: Action<any, any>[]) {
    this.name = name;
    this.actions = actions ? actions : [];
  }

  static new<U, V>(name: string, action: Action<U, V>) {
    return new Eventra<U, V>(name, [action]);
  }

  use<V>(action: Action<O, V>): Eventra<I, V> {
    const lastAction = this.actions[this.actions.length - 1];
    lastAction.setNext(action);

    const newEvent = new Eventra<I, V>(this.name, [...this.actions, action]);

    return newEvent;
  }

  async execute(data: I): Promise<O> {
    return await this.actions[0].execute<O>(data);
  }
}
