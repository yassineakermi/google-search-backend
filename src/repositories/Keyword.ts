import { Keyword } from "src/entities/Keyword.entity";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(Keyword)
export class KeywordRepository extends Repository<Keyword> {}
