import { SlonikRepository } from '@asgard/common';
import { TaskRepository } from '../domain/task.repository';
import { Task } from '../domain/task';

export class SlonikTaskRepository
  extends SlonikRepository<Task>
  implements TaskRepository {}
