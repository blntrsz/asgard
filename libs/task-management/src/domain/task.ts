export type TaskAttributes = {
  name: string;
  description: string;
};

export class Task {
  static type = 'tasks';
  constructor(private readonly _attributes: TaskAttributes) {}

  attributes() {
    return this._attributes;
  }
}
