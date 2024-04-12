'use strict'

import _ from 'lodash'

interface GetInfoDataParams<T> {
    fields: Array<keyof T>;
    object: T;
}
const getInfoData = <T>(params: GetInfoDataParams<T>) => {
    return _.pick(params.object, params.fields);
};
// ['a','b'] = {a:1,b:1}
const getSelectData = (select: string[]) => {
    return Object.fromEntries(select.map(el => [el, 1]))
}
// ['a','b'] = {a:0,b:0}
const unGetSelectData = (select: string[]) => {
    return Object.fromEntries(select.map(el => [el, 0]))
}

const removeUndefinedObject = <T extends object>(obj: T) => {
    Object.keys(obj).forEach(k => {
        if (obj[k as keyof T] === null) {
            delete obj[k as keyof T];
        }
    })

    return obj;
}
/*
    const a= {
        c:{
            d:1,
            e:2
        }
    }
    db.collection.updateOne({
        `c.d`:1,
        `c.e`:2,
    })
 */

const updateNestedObjectParser = <T extends object>(obj: T) => {
    console.log(`[1]::`, obj);
    const final: any = {};
    Object.keys(obj|| {}).forEach(k => {
        const key = k as keyof T;
        const value = obj[key] as object;
        console.log(`[3]::`, k);
        if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
            const response = updateNestedObjectParser(value);
            Object.keys(response || {}).forEach(a => {
                console.log(`[4]::`, a);
                final[`${k}.${a}`] = response[a];
            });
        } else {
            final[k] = value;
        }
    });
    console.log(`[2]::`, final);
    return final;
};

export {
    getInfoData,
    getSelectData,
    unGetSelectData,
    removeUndefinedObject,
    updateNestedObjectParser
}
