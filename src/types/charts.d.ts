export interface SalesProp {
    _id: string
    totalSales: number[]
    totalAmount: number[]
}

//best sellers
export interface BestSellerProps {
    topProducts: TopProduct[]
    date: string
}

export interface TopProduct {
    productId: string
    productName: string
    averageSales: number
}