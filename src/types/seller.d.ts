export interface Root {
    businesses: Business[]
}

export interface Business {
    _id: string
    name: string
    email?: string
    cac: string
    identity: Identity
    phone: string
    terms: boolean
    userId: string
    businessAddress: BusinessAddress
    isVerified: boolean
    status: string
    adminAction: string
    logo: string
    __v: number
}

export interface Identity {
    iType: string
    iNumber: string
    file: string
}

export interface BusinessAddress {
    address: string
    state: string
    country: string
    postalCode: number
}

export interface CreateProductProps {
    type: string
    name: string
    description: string
    category: string
    subCategory: string
    brand: string
    color: string
    size: string
    quantity: number
    weight: string
    price: number
    currency: string;
    productImages: any[];
    state: string;
    downloadLink: string;
    [x: string]: any;
}

export interface BankCardProps {
    _id: string
    userId: string
    name: string
    accountName: string
    accountNumber: string
    country?: string;
    comment?: string;
    createdAt: string
    updatedAt: string
    __v: number
}
