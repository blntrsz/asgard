import { Task, TaskAttributes } from '../domain/task';
import { TaskRepository } from '../domain/task.repository';
import { Logger } from '@asgard/common';

type Request = TaskAttributes;

export class CreateTask {
  constructor(
    private readonly logger: Logger,
    private readonly taskRepository: TaskRepository,
  ) {}

  async execute(request: Request) {
    try {
      const task = new Task(request);
      this.taskRepository.create(task);
    } catch (error) {
      this.logger.error(error as string);
    }
  }
}
