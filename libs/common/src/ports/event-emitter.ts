export interface Event {
  name: string;
  version: number;
  detail: any;
}

export interface EventEmitter {
  emit(event: Event): Promise<void>;
}
