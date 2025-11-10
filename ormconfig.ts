import { DataSource } from 'typeorm';
import 'dotenv/config';

const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  migrations: [
    process.env.NODE_ENV === 'production'
      ? 'dist/migrations/*.js'
      : 'src/migrations/*.ts',
  ],
  logging: false,
  ssl: false,
  entities: ['src/module/**/entity/*.entity.ts'],
});

export default AppDataSource;
