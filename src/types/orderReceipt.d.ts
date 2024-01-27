export interface Root {
    _id: string
    buyer: Buyer
    products: any[]
    status: string
    orderBreakdown: OrderBreakdown
    orders: Order[]
    createdAt: string
    updatedAt: string
    __v: number
    paymentId: string
    paymentType: string
}

export interface Buyer {
    buyerId: string
    buyerName: string
    email: string
    hotline: string
    shippingAddress: ShippingAddress
}

export interface ShippingAddress {
    address: string
    state: string
    country: string
    postalCode: number
}

export interface OrderBreakdown {
    subTotal: number
    VAT: number
    serviceCharge: number
    shippingFee: number
    grandTotal: number
    currency: string
}

export interface Order {
    buyer: Buyer2
    product: Product
    buyerCancel: boolean
    sellerCancel: boolean
    state: string
    status: string
    _id: string
    createdAt: string
    updatedAt: string
    __v: number
}

export interface Buyer2 {
    buyerId: string
    buyerName: string
    email: string
    hotline: string
    shippingAddress: ShippingAddress2
}

export interface ShippingAddress2 {
    address: string
    state: string
    country: string
    postalCode: number
}

export interface Product {
    itemId: string
    productId: string
    productName: string
    productType: string
    description: string
    productImages: string[]
    productQuantity: number
    pricePerUnit: number
    currency: string
    storeId: string
    storeName: string
    size: string
    color: string
    purchaseQuantity: number
    sellerPrice: number
    purchaseAmount: number
    rating: Rating
    VAT: number
    serviceCharge: number
    shippingFee: number
}

export interface Rating {
    averageRating: number
    totalReview: number
}
