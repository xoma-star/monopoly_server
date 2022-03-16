import {Field, ObjectType} from "type-graphql";
import {Product} from "./product";

@ObjectType()
class WarehouseProduct extends Product{
    @Field({description: 'хранимое кол-во'})
    count: number
}

@ObjectType()
export class Warehouse{
    @Field({description: 'общая вместимость'})
    total: number
    @Field(() => WarehouseProduct, {description: 'хранимые ресурсы'})
    stored: WarehouseProduct[]
}