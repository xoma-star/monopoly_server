import {Field, ObjectType} from "type-graphql";

@ObjectType()
export class User{
    @Field()
    vkUserID: number
    @Field()
    firebaseDocID?: number
    @Field()
    companiesOwned: string[]
    @Field()
    balance: number
    @Field()
    notifications: string[]
}