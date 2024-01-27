export interface RootProps {
    buyerName: string
    userAction: string
    phone: string
    country: string
    items: Item
    quantity: number
    productId: string
    itemId: string;
    productID: string
    productName: string
    productType: string
    color: string;
    size: string
}

export interface Item {
    quantity: number
    price: number
}

//
export interface OrderItem {
    _id: string
    buyer: Buyer
    product: Product
    buyerCancel: boolean
    sellerCancel: boolean
    currency: string
    totalAmount: number
    state: string
    status: string
    createdAt: string
    updatedAt: string
    __v: number
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

export interface Product {
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
    purchaseAmount: number
    sellerPrice: number
    rating: {
        averageRating: number;
        totalReview: number;
    }
    VAT: number
    serviceCharge: number
    shippingFee: number
}

