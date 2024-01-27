export interface AddReviewProps {
    productId: string;
    productRating: number
    comment: string;
    title: string;
}

export interface ReviewProps {
    title: string
    comment: string
    username: string
    userId: string
    verifiedBuyer: boolean
    productRating: number
    sellerReply: string;
    replyComment: any[]
    _id: string;
}

export interface CommentProps {
    reply: string;
    reviewId: string;
}

export interface ProductProps {
    type: string
    productType?: string
    name: string
    description: string
    category: string
    subCategory: string
    brand: string
    color: string[]
    size: string[]
    quantity: number
    weight: string
    price: number
    sellerPrice: number
    currency: string
    productImages: any[]
    product: string
    productSeller: any[]
    storeName: string;
    storeId: string;
    userId: string;
    isVerified: string
    createdAt: string
    updatedAt: string
    productReview: any[]
    _id: string;
    productId: string;
    status: string
    state: string;
    downloadLink: string
    affiliateUrl: string;
    moq: number;
    rating: {
        averageRating: number;
        totalReview: number;
    }
    stats: {
        purchases: number
        views: number
        clicks: number
    }
    adminAction: string
}

export interface CartItemProps {
    productID: string;
    price: number;
    productType: string;
    productName: string;
    quantity: number;
}