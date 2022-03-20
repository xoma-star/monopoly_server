import {Field, ObjectType} from "type-graphql";
import {Warehouse} from "./warehouse";
import {Worker} from "./workers";
import {Production} from "./product";
import {Contract} from "./contract";

@ObjectType()
export class Company {
    @Field({description: 'firebase doc id'})
    id?: string
    @Field({description: 'firebase doc id'})
    owner: string;
    @Field({description: 'расположение штаб-квартиры'})
    location: string
    @Field({description: 'url логотипа'})
    logo: string
    @Field({description: 'название компании'})
    name: string
    @Field(() => [Worker], {description: 'рабочие'})
    workers: Worker[]
    @Field({description: 'кол-во средств на балансе компании'})
    balance: number
    @Field(() => Number,{description: 'долг'})
    debt: number[]
    @Field(() => [Warehouse], {description: 'склады'})
    warehouses: Warehouse[]
    @Field({description: 'дата основания компании'})
    registered: number
    @Field(() => Production, {description: 'производство deprecated', nullable: true})
    production: Production | null
    @Field(() => [Contract], {description: 'контракты'})
    contracts: Contract[]
    @Field(() => [String], {description: 'id производственных линий'})
    prodLines: string[]
    @Field({description: 'ведется ли прием резюме'})
    recruiting: boolean
    @Field(() => [Worker],{description: 'текущие резюме'})
    summaries: Worker[]
}