import {IsNumber, IsOptional, IsString,IsNotEmpty } from 'class-validator';

export class KeywordDto {
    @IsOptional()
    @IsNumber()
    public id:number;

    @IsNotEmpty()
    @IsString()
    public keyword: string
    
}