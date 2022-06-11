import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Keyword } from './entities/Keyword.entity';
import { SearchResult } from './entities/SearchResult.entity';
import { KeywordRepository } from './repositories/Keyword';
import { SearchResultRepository } from './repositories/SearchResult';
var axios = require('axios');
var qs = require('qs');

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(KeywordRepository) private keywordsRepository: KeywordRepository,
    @InjectRepository(SearchResultRepository) private resultsRepository: SearchResultRepository
  ) { }

  async getKeywords(): Promise<Keyword[]> {
    return await this.keywordsRepository.find();
  }

  findKeyword(id: number): Promise<Keyword> {
    return this.keywordsRepository.findOne(id);
  }

  async createKeyword(Keyword: Keyword): Promise<Keyword> {
    return this.keywordsRepository.save(Keyword);
  }

  async removeKeyword(id: number): Promise<void> {
    await this.keywordsRepository.delete(id);
  }

  async getSearchResults(id: number): Promise<SearchResult[]> {
    return await this.resultsRepository.createQueryBuilder("result").where("result.keywordId = :id", { id }).getMany();
  }

  findSearchResult(id: number): Promise<SearchResult> {
    return this.resultsRepository.findOne(id);
  }

  async removeSearchResult(id: number): Promise<void> {
    await this.resultsRepository.delete(id);
  }

  async parseKeyword(_keyword: string="", language:string="", country:string=""): Promise<Keyword | SearchResult[] | { error: string } | { processing: boolean,id:number }> {
    const keyword = await this.keywordsRepository.findOne({ keyword: _keyword })
    if (!keyword || keyword.status=='error') {
      let new_keyword = new Keyword()
      if(!keyword){
        new_keyword.keyword = _keyword;
        new_keyword.status = 'processing';
        new_keyword.createdAT = new Date();
        new_keyword = await this.createKeyword(
          new_keyword
        )
      }else{
        new_keyword=keyword
        new_keyword.status='processing'
      }
      var data = qs.stringify({
        'project': 'google_search_engine',
        'spider': 'Google',
        'keyword': _keyword,
        'id': new_keyword.id,
      });

      try {
        const resp = await axios.post('http://localhost:6800/schedule.json', data, {
          'Content-Type': 'application/x-www-form-urlencoded'
        });
        new_keyword.job = resp.data.jobid
        await new_keyword.save()
        return new_keyword
      } catch (err) {
        console.error(err);
      }
      return new_keyword
    }
    else if (keyword.status == 'finished') {
      return this.getSearchResults(keyword.id);
    }
    else {
      return {
        id:keyword.id,
        processing: true
      }
    }
  }

  async updateKeywordStatus(id: number): Promise<Keyword> {
    const editedKeyword = await this.keywordsRepository.findOne(id);
    const results = await this.getSearchResults(id);
    console.log(results)
    if (!editedKeyword) {
      throw new NotFoundException(`Keyword ${id} is not found`);
    }
    if (results.length > 0){
      editedKeyword.status = 'finished';
    }
    else
      editedKeyword.status = 'error';
    await editedKeyword.save();
    return editedKeyword;
  }

  async checkKeywordStatus(id:number): Promise<Keyword | SearchResult[] | { error: string } | { processing: boolean,id:number }>{
    const keyword = await this.keywordsRepository.findOne(id);
    if(!keyword){
      return {
        error:"This keyword does not exist"
      }
    }
    else if(keyword.status == 'error'){
      return {
        error:`an error happened while scraping keyword ${keyword.keyword} with ID: ${keyword.id}`
      }
    }
    else if (keyword.status == 'processing'){
      return {
        id:keyword.id,
        processing: true
      }
    }
    else if (keyword.status=='finished'){
      return this.getSearchResults(keyword.id);
    }
  }

}
