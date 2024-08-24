export interface Paginated<TEntity> {
  count: number;
  limit: number;
  page: number;
  data: TEntity[];
}

export interface Repository<TEntity> {
  getOne(id: string): Promise<TEntity>;
  getManyPaginated(id: string): Promise<Paginated<TEntity>>;
  create(entity: TEntity): Promise<void>;
  update(entity: TEntity): Promise<void>;
  remove(id: string): Promise<void>;
}
