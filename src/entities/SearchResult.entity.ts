import { Column, Entity, BaseEntity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { Keyword } from "./Keyword.entity";
@Entity()
export class SearchResult extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    link: string;

    @ManyToOne(()=>Keyword, keyword=>keyword.search_results)
    keyword: Keyword;

    @Column({ default: 'SEARCH_RESULT'})
    type: 'QUESTION' | 'SEARCH_RESULT';

    @Column()
    isDone: boolean

    @Column()
    createdAT: Date

    @Column()
    rank: number
}
