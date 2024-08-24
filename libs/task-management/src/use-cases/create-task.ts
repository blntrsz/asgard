import { Task, TaskAttributes } from '../domain/task';
import { TaskCreatedV1 } from '../domain/task.event';
import { TaskRepository } from '../domain/task.repository';
import { EventEmitter, Logger } from '@asgard/common';

type Request = TaskAttributes;

export class CreateTask {
  constructor(
    private readonly logger: Logger,
    private readonly taskRepository: TaskRepository,
    private readonly eventEmitter: EventEmitter,
  ) {}

  async execute(request: Request) {
    try {
      const task = new Task(request);

      await this.taskRepository.create(task);
      await this.eventEmitter.emit(new TaskCreatedV1(task));
    } catch (error) {
      this.logger.error(error as string);

      throw error;
    }
  }
}
