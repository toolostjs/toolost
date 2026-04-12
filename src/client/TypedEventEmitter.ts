/**
 * Small strongly-typed event emitter used by SDK classes.
 */
export class TypedEventEmitter<TEventMap extends Record<string, unknown>> {
  private readonly listeners: {
    [K in keyof TEventMap]?: Set<(payload: TEventMap[K]) => void>;
  } = {};

  /** Subscribes to an event. */
  public on<K extends keyof TEventMap>(
    event: K,
    listener: (payload: TEventMap[K]) => void,
  ): this {
    const eventListeners =
      (this.listeners[event] as
        | Set<(payload: TEventMap[K]) => void>
        | undefined) ?? new Set<(payload: TEventMap[K]) => void>();

    eventListeners.add(listener);
    this.listeners[event] = eventListeners as Set<
      (payload: TEventMap[keyof TEventMap]) => void
    >;

    return this;
  }

  /** Subscribes to an event and auto-unsubscribes after first emission. */
  public once<K extends keyof TEventMap>(
    event: K,
    listener: (payload: TEventMap[K]) => void,
  ): this {
    const wrappedListener = (payload: TEventMap[K]) => {
      this.off(event, wrappedListener);
      listener(payload);
    };

    return this.on(event, wrappedListener);
  }

  /** Removes an event listener. */
  public off<K extends keyof TEventMap>(
    event: K,
    listener: (payload: TEventMap[K]) => void,
  ): this {
    const eventListeners = this.listeners[event] as
      | Set<(payload: TEventMap[K]) => void>
      | undefined;
    eventListeners?.delete(listener);
    return this;
  }

  /** Emits an event payload. */
  public emit<K extends keyof TEventMap>(
    event: K,
    payload: TEventMap[K],
  ): boolean {
    const eventListeners = this.listeners[event] as
      | Set<(payload: TEventMap[K]) => void>
      | undefined;

    if (!eventListeners || eventListeners.size === 0) {
      return false;
    }

    for (const listener of eventListeners) {
      listener(payload);
    }

    return true;
  }

  /** Returns the count of listeners currently registered for an event. */
  protected listenerCount<K extends keyof TEventMap>(event: K): number {
    return this.listeners[event]?.size ?? 0;
  }
}
