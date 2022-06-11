import { SearchResult } from "src/entities/SearchResult.entity";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(SearchResult)
export class SearchResultRepository extends Repository<SearchResult> {}
