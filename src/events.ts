import { Action } from './actions';

/**
 * Set of actions that make up a transactional operation.
 */
export class Eventra<I = void, O = void> {
  private actions: Action<any, any>[];

  private constructor(actions?: Action<any, any>[]) {
    this.actions = actions ? actions : [];
  }

  /**
   * Create a new Event.
   * @param action Event's first operation.
   * @returns New Event with the same input and output as the action.
   */
  static new<U, V>(action: Action<U, V>) {
    return new Eventra<U, V>([action]);
  }

  /**
   * Add a new action to an event.
   * @param action Action with the same input as the event's output
   * @returns New event with the same input as the previous one, with the new action's output.
   */
  use<V>(action: Action<O, V>): Eventra<I, V> {
    const lastAction = this.actions[this.actions.length - 1];
    lastAction.setNext(action);

    const newEvent = new Eventra<I, V>([...this.actions, action]);

    return newEvent;
  }

  /**
   * Execute the event's actions, in order. Throws any error thrown within said actions.
   * @param data Data needed for the first action.
   * @returns Last action's output.
   */
  async execute(data: I): Promise<O> {
    return await this.actions[0].execute<O>(data);
  }
}
