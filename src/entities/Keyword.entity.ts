import { Column, Entity, OneToMany, PrimaryGeneratedColumn,BaseEntity } from "typeorm";
import { SearchResult } from "./SearchResult.entity";
@Entity()
export class Keyword extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    keyword: string;

    @Column()
    status: 'finished'|'processing'| 'error'

    @Column()
    createdAT: Date

    @Column()
    job: string

    @Column()
    language: string

    @Column()
    country: string

    @OneToMany(()=>SearchResult, result=>result.keyword)
    search_results: SearchResult[]
}
