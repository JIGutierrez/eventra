import { Action } from './actions';

export class Event<I = void, O = void> {
  private name: string;
  private actions: Action<any, any>[];

  private constructor(name: string, actions?: Action<any, any>[]) {
    this.name = name;
    this.actions = actions ? actions : [];
  }

  static new<U, V>(name: string, action: Action<U, V>) {
    return new Event<U, V>(name, [action]);
  }

  use<V>(action: Action<O, V>): Event<I, V> {
    const lastAction = this.actions[this.actions.length - 1];
    lastAction.setNext(action);

    const newEvent = new Event<I, V>(this.name, [...this.actions, action]);

    return newEvent;
  }

  async execute(data: I): Promise<O> {
    return await this.actions[0].execute<O>(data);
  }
}
