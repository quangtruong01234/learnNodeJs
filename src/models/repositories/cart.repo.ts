import { convertToObjectIdMongodb } from "@/utils"
import cart from "../cart.model"


const findCartById = async (cartId: string) => {
    return await cart.findOne({ _id: convertToObjectIdMongodb(cartId), cart_state: 'active' }).lean()

}


export {
    findCartById
}