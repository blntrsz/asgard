export interface TaskAttributes {
  name: string;
  description: string;
}

export class Task {
  constructor(private readonly _attributes: TaskAttributes) {}

  attributes() {
    return this._attributes;
  }
}
