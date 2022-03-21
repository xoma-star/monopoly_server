import {editCompanyData, getAllCompanies} from "../firebase";
import {Worker} from "../objects/workers";
const hash = require('object-hash')

function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
}

const generate = (): Worker => {
    const names = ['Obama Nigger', 'Will Smith', 'Vladimeer Puteen', 'ZHirik']
    const a = {
        gender: getRandomInt(0,2) > 0 ? 'female' : 'male',
        name: names[getRandomInt(0, names.length)],
        baseProduction: 500,
        highEducated: getRandomInt(0,2) > 0,
        salary: 5000
    }
    return  <Worker>{...a, hash: hash(a)}
}

const main = async () => {
    let data = await getAllCompanies([{field: 'recruiting', condition: '==', value: true}])
    data.docs.map(async v => {
        let old = [...v.data().summaries]
        old.push(generate())
        await editCompanyData(v.id, {summaries: old})
        return 0
    })
}

main()