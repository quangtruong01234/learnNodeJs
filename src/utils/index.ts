'use strict'

import _ from 'lodash'

interface GetInfoDataParams<T> {
    fields: Array<keyof T>;
    object: T;
}
export function getInfoData<T>(params: GetInfoDataParams<T>) {
    return _.pick(params.object, params.fields);
}
// ['a','b'] = {a:1,b:1}
const getSelectData = (select:string[])=>{
    return Object.fromEntries(select.map(el=>[el,1]))
}
// ['a','b'] = {a:0,b:0}
const unGetSelectData = (select:string[])=>{
    return Object.fromEntries(select.map(el=>[el,0]))
}

export{
    getSelectData,
    unGetSelectData
}
