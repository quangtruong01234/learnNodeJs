'use strict'

import _ from 'lodash'

interface GetInfoDataParams<T> {
    fields: Array<keyof T>;
    object: T;
}
export function getInfoData<T>(params: GetInfoDataParams<T>) {
    return _.pick(params.object, params.fields);
}
