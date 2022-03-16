import {Arg, Int, Mutation, Resolver} from "type-graphql";
import {createUser, editCompanyData, editUserData, getCompanyByID, getUserByID} from "../firebase";

@Resolver()
export class UserResolver{
    @Mutation(() => String)
    async createUser(
        @Arg('vkUserID') vkUserID: number
    ):Promise<string>{
        return (await createUser(vkUserID))
    }
    @Mutation(() => Boolean)
    async pushUserCompany(
        @Arg('docID') docID: string,
        @Arg('companyID') companyID: string
    ): Promise<boolean>{
        let userData = (await getUserByID(docID)).data()
        if(userData?.companiesOwned) return await editUserData(docID, {companiesOwned: [...userData?.companiesOwned, companyID]})
        return false
    }
    @Mutation(() => Int)
    async transferBalanceToCompany(
        @Arg('docID') docID: string,
        @Arg('companyID') companyID: string,
        @Arg('value') value: number
    ): Promise<number>{
        let userData = (await getUserByID(docID)).data()
        let companyData = (await getCompanyByID(companyID)).data()
        if(value < 0) {
            if(typeof companyData === 'undefined') return 1
            if(companyData?.balance + value < 0) return 2
        }
        if(typeof userData === 'undefined') return 1
        if(userData?.balance - value < 0) return 2
        await editUserData(docID, {balance: userData?.balance - value})
        await editCompanyData(companyID, {balance: companyData?.balance + value})
        return 0
    }
}