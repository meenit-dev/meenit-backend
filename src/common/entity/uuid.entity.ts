import { UUID } from '@common/type';
import { PrimaryGeneratedColumn } from 'typeorm';
import { v7 } from 'uuid';

export class UUIDEntity {
  @PrimaryGeneratedColumn('uuid')
  id: UUID = v7();
}
