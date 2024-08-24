import { Repository } from '@asgard/common';
import { Task } from './task';

export interface TaskRepository extends Repository<Task> {}
