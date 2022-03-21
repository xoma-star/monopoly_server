import {Field, ObjectType} from "type-graphql";

@ObjectType()
export class Worker{
    @Field()
    salary: number
    @Field()
    highEducated: boolean
    @Field()
    name: string
    @Field()
    baseProduction: number
    @Field()
    gender: 'female' | 'male'
    @Field()
    hash: string
}