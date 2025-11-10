import { IsProduction } from '@common/util';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          url: encodeURI(configService.get('DATABASE_URL')),
          synchronize: false,
          logging: IsProduction
            ? ['warn', 'error']
            : ['info', 'query', 'warn', 'error'],
          useUTC: true,
          entities: [`${__dirname}/../**/entity/*.entity.{js,ts}`],
        };
      },
      async dataSourceFactory(options) {
        if (!options) {
          throw new Error('Invalid DataSource Option Passed');
        }

        return addTransactionalDataSource(new DataSource(options));
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
