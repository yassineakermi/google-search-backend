import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Keyword } from './entities/Keyword.entity';
import { SearchResult } from './entities/SearchResult.entity';
import { KeywordRepository } from './repositories/Keyword';
import { SearchResultRepository } from './repositories/SearchResult';




@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      database: 'google',
      entities: [Keyword,SearchResult],
    }),
    TypeOrmModule.forFeature([SearchResultRepository,KeywordRepository])
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
