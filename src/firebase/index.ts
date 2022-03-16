import * as admin from 'firebase-admin';

import serviceAccount from './service-account.json';
import {Company} from "../objects/company";
import {User} from "../objects/user";
import {Filter} from "../resolvers/company";
import {ProductionLine} from "../objects/prodLine";

admin.initializeApp({
    // @ts-ignore
    credential: admin.credential.cert(serviceAccount)
});

export const getCompanyByID = async (id: string) => {
    return await admin.firestore().collection('companies').doc(id).get()
}

export const getUserByID = async (id: string) => {
    return await admin.firestore().collection('users').doc(id).get()
}

interface comapyCreateProps {
    logo: string,
    name: string,
    location: string,
    owner: string
}
export const createCompany = async (props: comapyCreateProps) => {
    const data: Company = {
        ...props,
        workers: {
            highEducated: 0,
            total: 0
        },
        warehouses: [],
        registered: new Date().getTime(),
        debt: [],
        production: null,
        contracts: [],
        balance: 0
    }
    return await admin.firestore().collection('companies').add(data)
}

export const getAllProdLines = async (owner?: string): Promise<ProductionLine[]> => {
    let ref
    if(owner) ref = admin.firestore().collection('prodLines').where('owner', '==', owner)
    else ref = admin.firestore().collection('prodLines')
    return (await ref.get()).docs.map((v) => {
        return {
            id: v.id,
            product: v.data().product,
            owner: v.data().owner,
            active: v.data().active
        }
    })
}

export const getAllCompanies = async (filters?: Filter[], offset?: number) => {
    if(!offset) offset = 0
    if(filters) {
        let path: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> = await admin.firestore().collection('companies')
        for(let i = 0; i < filters.length; i++) {
            if(filters[i].field === 'name') continue
            path = path.where(filters[i].field, filters[i].condition, filters[i].value)
        }
        return await path.offset(offset).limit(50).get()
    }
    return await admin.firestore().collection('companies').offset(offset).limit(50).get()
}

export const createUser = async (vkUserID: number) => {
    const docID = (await admin.auth().createUser({email: `${vkUserID}@mono.poly`, password: `123456`})).uid
    const data: User = {
        vkUserID,
        balance: 0,
        companiesOwned: [],
        notifications: []
    }
    await admin.firestore().collection('users').doc(docID).set(data)
    return docID
}

export const editUserData = async (docID: string, data: any) => {
    await admin.firestore().collection('users').doc(docID).update(data)
    return true
}
export const editCompanyData = async (docID: string, data: any) => {
    await admin.firestore().collection('companies').doc(docID).update(data)
    return true
}

export const createProdLine = async (docID: string) => {
    const data: ProductionLine = {
        owner: docID,
        active: false,
        product: null
    }
    let companyData = (await getCompanyByID(docID)).data()
    if(companyData?.balance - 300 < 0) return 1
    const response = await admin.firestore().collection('prodLines').add(data)
    if(!response) return 2
    await editCompanyData(docID, {prodLines: [...companyData?.prodLines, response.id], balance: companyData?.balance - 300})
    return 0
}