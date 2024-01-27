export interface Root {
  user: User
  token: string
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  name: string
  email: string
  phone: string
  phoneNumber: string
  craft: any
  bio: any
  address: {
    address: string;
    country: string;
    state: string;
    postalCode: string;
  }
  email_verified: boolean
  status: string
  is_vendor: boolean
  profilePicture: string
  avatar: string
  thumbnail: any
  created_at: string
  service_count: number
  product_count: number
  plan: any,
  role: string;
}

export interface WishlistProps {
  product: Product
  quantity: number
  price: number
}

export interface Product {
  productId: string
  productName: string
  productType: string
  productImages: any[]
  currency: string
  storeName: string
  size: any
  color: any
}

export interface ProductId {
  productType: string
  state: string
  productName: string
  description: string
  category: string
  subCategory: string
  brand: string
  quantity: number
  weight: number
  price: number
  currency: string
  productImages: string[]
  isVerified: string
  productOwner: string
  createdAt: string
  updatedAt: string
  id: string
}

export interface Item {
  quantity: number
  price: number
  productName: string
}

export interface ProductOwner {
  firstName: string
  lastName: string
  email: string
  status: string
  phoneNumber: string
  avatar: string
  isVerified: boolean
  role: string
  createdAt: string
  updatedAt: string
  id: string
}

interface DownloadCardProps {
  productId: string;
  downloadLink: string;
  productImages: string[];
  productName: string;
  __v: number
}

interface DocumentCardProps {
  url: string;
  title: string;
}