export type ShippingClasses = ShippingClass[]

export interface ShippingClass {
    _id: string
    name: string
    zone: string
    classFunction: string
    percentage: number
    description: string
    __v: number
}
