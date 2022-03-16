import {Arg, Resolver, Query} from "type-graphql";
import {getAllProdLines} from "../firebase";
import {ProductionLine} from "../objects/prodLine";

@Resolver()
export class ProdLinesResolver{
    @Query(() => [ProductionLine])
    async getProdLines(
        @Arg('owner', {nullable: true}) owner?: string
    ): Promise<ProductionLine[]>{
        return await getAllProdLines(owner)
    }
}