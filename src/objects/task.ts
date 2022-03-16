import {Field, ObjectType} from "type-graphql";
import {Product} from "./product";

@ObjectType()
export class Task{
    @Field({nullable: true})
    id?: string
    @Field({description: 'начало задание'})
    startAt: number
    @Field({description: 'окончание задания'})
    endAt: number
    @Field({description: 'производимый продукт'})
    produce: Product
    @Field({description: 'количество'})
    count: number
}