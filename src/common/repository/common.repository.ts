import { Logger } from '@nestjs/common';
import {
  DeleteResult,
  FindOptionsOrder,
  FindOptionsRelationByString,
  FindOptionsRelations,
  FindOptionsWhere,
  In,
  ObjectLiteral,
  Repository,
} from 'typeorm';
import { PaginationResponseDto } from './repository.dto';

interface PaginationOptions {
  limit: number;
  page: number;
}

export class CommonRepository<Entity extends ObjectLiteral> {
  protected readonly logger: Logger;
  protected readonly repository: Repository<Entity>;

  async findOneById(id: string): Promise<Entity | null> {
    return this.repository.findOne({
      where: {
        id: id as NonNullable<Entity['id']>,
      },
    });
  }

  async findByIds(ids: string[]): Promise<Entity[]> {
    if (ids.length === 0) {
      return [];
    }
    return this.repository.findBy({
      id: In(ids),
    } as unknown as FindOptionsWhere<Entity>);
  }

  async findAll(): Promise<Entity[]> {
    return this.repository.find();
  }

  protected async findAllPagination({
    where,
    paginationOptions: { limit, page },
    order,
    relations,
    withDeleted,
  }: {
    where?: FindOptionsWhere<Entity> | FindOptionsWhere<Entity>[];
    paginationOptions: PaginationOptions;
    order: FindOptionsOrder<Entity>;
    relations?: FindOptionsRelations<Entity> | FindOptionsRelationByString;
    withDeleted?: boolean;
  }): Promise<PaginationResponseDto<Entity>> {
    const [list, totalCount] = await this.repository.findAndCount({
      where: where,
      skip: limit * (page - 1),
      take: limit,
      order,
      relations,
      withDeleted,
    });

    return { list, totalCount };
  }

  async save(entity: Entity): Promise<Entity> {
    return this.repository.save(entity);
  }

  async saveMany(entity: Entity[]): Promise<Entity[]> {
    return this.repository.save(entity);
  }

  async softDeleteById(id: string): Promise<DeleteResult> {
    return this.repository.softDelete({
      id: id as NonNullable<Entity['id']>,
    });
  }

  async softDeleteByIds(ids: string[]): Promise<DeleteResult> {
    if (ids.length === 0) {
      return;
    }
    return this.repository.softDelete(ids);
  }

  async deleteById(id: string): Promise<DeleteResult> {
    return this.repository.delete({
      id: id as NonNullable<Entity['id']>,
    });
  }

  async deleteByIds(ids: string[]): Promise<DeleteResult> {
    if (ids.length === 0) {
      return;
    }
    return this.repository.delete(ids);
  }
}
