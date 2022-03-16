import {Field, ObjectType} from "type-graphql";
import {Product} from "./product";

@ObjectType()
export class ProductionLine{
    @Field()
    id?: string
    @Field({description: 'id компании'})
    owner: string
    @Field(() => Product, {description: 'производимый продукт', nullable: true})
    product: Product | null
    @Field({description: 'работает ли сейчас'})
    active: boolean
}