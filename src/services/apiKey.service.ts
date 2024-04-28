'use strict'
import apiKeyModel from '../models/apikey.model'
// const crypto = require('crypto')
const findById = async (key: string)=>{
    // const newKey = await apiKeyModel.create({ 
    //     key:crypto.randomBytes(64).toString('hex'), 
    //     permissions:['0000']})
    // console.log(newKey)
    const objKey  = await apiKeyModel.findOne({key, status:true}).lean()
    return objKey
}
export{
    findById
}