import {Arg, Field, InputType, Int, Mutation, ObjectType, Query, Resolver} from 'type-graphql'
import {createCompany, createProdLine, editCompanyData, getAllCompanies, getCompanyByID} from "../firebase";
import {firestore} from "firebase-admin";
import DocumentData = firestore.DocumentData;
import {Company} from "../objects/company";
import {Product, products} from "../objects/product";
import {Worker} from "../objects/workers";

@ObjectType()
@InputType('FiltersInput')
export class Filter {
    @Field()
    field: string
    @Field()
    condition: "<" | "<=" | "==" | "!=" | ">=" | ">" | "array-contains" | "in" | "not-in" | "array-contains-any"
    @Field(() => String || Boolean || Number)
    value: string | boolean | number
}

@Resolver()
export class CompanyResolver{
    @Query(() => [Product])
    getProductMeta(

    ): Product[]{
        return products
    }
    @Query(() => Company, {nullable: true})
    async company(
        @Arg('id') id: string
    ): Promise<DocumentData | undefined>{
        const d = await getCompanyByID(id)
        return {...d.data(), id: d.id}
    }

    @Query(() => [Company])
    async getAllCompanies(
        @Arg('filters', () => [Filter], {nullable: true}) filters?: Filter[],
        @Arg('offset', () => Int, {nullable: true}) offset?: number
    ): Promise<Company[] | undefined>{
        let allData = (await getAllCompanies(filters, offset)).docs.map(value => {
            let data = value.data()
            return {
                id: value.id,
                name: data.name,
                logo: data.logo,
                owner: data.owner,
                location: data.location,
                balance: data.balance,
                contracts: data.contracts,
                debt: data.debt,
                production: data.production,
                registered: data.registered,
                warehouses: data.warehouses,
                workers: data.workers,
                prodLines: data.prodLines,
                recruiting: data.recruiting,
                summaries: data.summaries
            }
        })
        const nameFilter = filters?.find((v: Filter) => v.field === 'name')?.value
        if(nameFilter) allData = allData.filter((v: Company) => {
            return v.name.toLowerCase().indexOf(nameFilter.toString().toLowerCase()) > -1;
        })
        return allData
    }

    @Mutation(() => String)
    async createCompany(
        @Arg('name') name: string,
        @Arg('location') location: string,
        @Arg('owner') owner: string,
        @Arg('logo', {nullable: true}) logo: string
    ): Promise<string>{
        const a = await createCompany({name, logo, location, owner})
        return a.id
    }
    @Mutation(() => Number)
    async createProdLine(
        @Arg('companyID') companyID: string
    ): Promise<number>{
        return await createProdLine(companyID)
    }
    @Mutation(() => Number)
    async switchRecruiting(
        @Arg('companyID') companyID: string,
        @Arg('value') value: boolean
    ): Promise<number>{
        await editCompanyData(companyID, {recruiting: value})
        return 1
    }
    @Mutation(() => [Worker])
    async recruit(
        @Arg('companyID') companyID: string,
        @Arg('workerHash') workerHash: string
    ): Promise<Worker[]>{
        const companyData = await getCompanyByID(companyID)
        const newSummaries = [...companyData?.data()?.summaries]
        const newWorkers = [...companyData?.data()?.workers, newSummaries.find(v => v.hash === workerHash)]
        let i = newSummaries.findIndex(v => v.hash === workerHash)
        if(i > -1) newSummaries.splice(i, 1)
        await editCompanyData(companyID, {summaries: newSummaries, workers: newWorkers})
        return <Worker[]> newSummaries
    }
}