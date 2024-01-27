
export interface TransactionProps {
    _id: string
    userId: string
    amount: number
    currency: string
    type: string
    bankInfo: BankInfo
    state: string
    createdAt: string
    updatedAt: string
    __v: number
}

export interface BankInfo {
    userId: string
    name: string
    accountName: string
    accountNumber: string
    _id: string
    createdAt: string
    updatedAt: string
    __v: number
}
