export interface CreateDiscount {
    code: string, start_date: Date, end_date: Date, is_active: boolean,
    shopId: string, min_order_value: number, product_ids: string, applies_to: string, name: string,
    description: string, type: string, value: string, max_uses: number, uses_count: string, max_uses_per_user: number,
    max_value:string,users_used:string,
}