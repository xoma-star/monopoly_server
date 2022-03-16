import express from 'express'
import 'reflect-metadata'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from "type-graphql"
import {CompanyResolver} from "./resolvers/company"
import 'reflect-metadata'
import cors from 'cors'
import {UserResolver} from "./resolvers/user";
import path from 'path'

const main = async() => {
    const app = express()
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [CompanyResolver, UserResolver],
            validate: false
        })
    })

    app.use(cors({
        origin: '*'
    }))
    await apolloServer.start()

    apolloServer.applyMiddleware({app, cors: false})

    app.use(express.static(path.join(__dirname, '../client/build')))
    app.get('*', (_, res: any) => {
        res.sendFile(path.join(__dirname, '../client/build/index.html'))
    })

    app.listen(process.env.PORT || 4000, () => console.log('server started'))
}

main()