import { Event } from '@asgard/common';
import { Task } from './task';

export class TaskCreatedV1 implements Event {
  name = 'TaskCreated';
  version = 1;
  detail: any;

  constructor(task: Task) {
    this.detail = task;
  }
}
