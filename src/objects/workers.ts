import {Field, ObjectType} from "type-graphql";

@ObjectType()
export class Workers{
    @Field()
    total: number
    @Field()
    highEducated: number
}