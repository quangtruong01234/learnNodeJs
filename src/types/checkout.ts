export interface ShopOrderItem {
    shopId: string,
    shop_discounts: CheckDiscount[],
    item_products: CheckProduct[],
}

export interface CheckProduct {
    productId: string;
    quantity: number;
    price: number
}
export interface CheckDiscount {
    codeId:string
}