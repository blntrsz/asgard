import { Event, EventEmitter } from '../ports/event-emitter';

export class EventBridgeEventEmitter implements EventEmitter {
  emit(event: Event): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
