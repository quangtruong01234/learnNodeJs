import inventory from "../inventory.model"

const insertInventory = async ({
    productId, shopId, stock,location = 'unKnow'
}:{productId:string, shopId:string, stock:number,location?:string})=>{
    return await inventory.create({
        inven_productId: productId,
        inven_stock: stock,
        inven_location: location,
        inven_shopId: shopId
    })
}

export{
    insertInventory,
}