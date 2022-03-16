import {Field, ObjectType} from "type-graphql";

export type productTypes = 'iron' | 'processor'

@ObjectType()
class ProductRequirements{
    @Field()
    type: productTypes
    @Field()
    count: number
}

@ObjectType()
export class Product{
    @Field({description: 'производимый ресурс'})
    type: productTypes
    @Field(() => [ProductRequirements], {description: 'затраты ресурсов на 1 ед. продукта'})
    requires: ProductRequirements[]
    @Field({description: 'кол-во работников для производства 1 ед. ресурса за период'})
    workersPerProduct: number
    @Field({description: 'требование высшее образование'})
    requiresHighEducation: boolean
    @Field({description: 'стоимость транспортировки 1 ед. продукта'})
    transportationCost: number
    @Field({description: 'сколько места занимает 1 ед. продукта'})
    spaceRequirements: number
    @Field({description: 'затраты времени на 1 ед. продукта'})
    timeCosts: number
}

export const products: Product[] = [
    {type: "iron", requires: [], requiresHighEducation: false, spaceRequirements: 4, timeCosts: 5, transportationCost: 5, workersPerProduct: 5},
    {type: "processor", requires: [{type: "iron", count: 5}], workersPerProduct: 5, transportationCost: 5, timeCosts: 5, spaceRequirements: 5, requiresHighEducation: true}
]

@ObjectType()
export class Production{
    @Field(() => Product, {description: 'производимый продукт'})
    type: Product
    @Field(() => String,{description: 'автоматическая поставка по контракту'})
    contracts: string[]
}