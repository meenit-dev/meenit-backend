import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';
import { UUIDEntity } from './uuid.entity';

export class CommonBaseEntity extends UUIDEntity {
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date | null;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date | null;
}
