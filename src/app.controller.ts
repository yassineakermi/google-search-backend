import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ParseIntPipe } from '@nestjs/common/pipes/parse-int.pipe';
import { Keyword } from './entities/Keyword.entity';
import { SearchResult } from './entities/SearchResult.entity';
import { AppService } from './app.service';
import { IS_LATLONG } from 'class-validator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('keywords')
  findAllKeywords(){
    return this.appService.getKeywords()
  }

  @Get('keywords/:id')
  findKeyword(@Param('id', ParseIntPipe) id) {
    return this.appService.findKeyword(id);
  }


  @Get('search_results/:id')
  findSearchResultsbyKeyword(@Param('id',ParseIntPipe) id){
    console.log(id)
    return this.appService.getSearchResults(id);
  }

  @Post('parse_keyword')
  parseKeyword(@Body('keyword') keyword,@Body('language') lang, @Body('country') loc ){
    console.log(lang,loc,keyword)
    return this.appService.parseKeyword(keyword,lang,loc)
  }

  @Get('update_keyword/:id')
  updateKeyword(@Param('id', ParseIntPipe) id){
    console.log(id)
    return this.appService.updateKeywordStatus(id);
  }

  @Get('check_status/:id')
  checkKeywordStatus(@Param('id', ParseIntPipe) id){
    console.log(id)
    return this.appService.checkKeywordStatus(id);
  }


}
