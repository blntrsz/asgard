import { Paginated, Repository } from '../ports/repository';

export class SlonikRepository<TEntity> implements Repository<TEntity> {
  constructor() {}
  getOne(id: string): Promise<TEntity> {
    throw new Error('Method not implemented.');
  }
  getManyPaginated(id: string): Promise<Paginated<TEntity>> {
    throw new Error('Method not implemented.');
  }
  create(entity: TEntity): Promise<void> {
    throw new Error('Method not implemented.');
  }
  update(entity: TEntity): Promise<void> {
    throw new Error('Method not implemented.');
  }
  remove(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
