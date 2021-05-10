import { Action } from './actions';

export class Event<I = void, O = void> {
  // Event is very similar to Action in theory -> possible inheritance? Could lead to nested actions
  name: string;
  actions: Action<any, any>[];

  constructor(name: string, actions?: Action<any, any>[]) {
    this.name = name;
    this.actions = actions ? actions : [];
  }

  next<N>(action: Action<O, N>): Event<I, N> {
    if (this.actions.length) {
      const lastAction = this.actions[this.actions.length - 1];
      lastAction.next = action;
    }
    this.actions.push(action);
    return new Event(this.name, this.actions);
  }

  execute(data: any) {
    return this.actions[0].execute(data);
  }
}
