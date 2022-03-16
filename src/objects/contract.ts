import {Field, ObjectType} from "type-graphql";
import {Product} from "./product";

@ObjectType()
export class Contract {
    @Field({description: 'исполнитель (компания)'})
    contractor: string
    @Field({description: 'заказчик (компания)'})
    customer: string
    @Field({description: 'начало контракта'})
    start: number
    @Field({description: 'окончание контракта'})
    end: number
    @Field({description: 'контракт выполнен'})
    fulfilled: boolean
    @Field({description: 'общее кол-во поставляемого продукта'})
    totalCount: number
    @Field(() => Product, {description: 'поставляемый продукт'})
    product: Product
    @Field({description: ''})
    id: string
}