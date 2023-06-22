import { NextApiRequest } from 'next'
import { Model } from 'sequelize'
import { InferAttributes, InferCreationAttributes } from 'sequelize'

export interface IOrderModel
    extends Model<
        InferAttributes<IOrderModel>,
        InferCreationAttributes<IOrderModel>
    > {
    id: number
    customerId: number
    total: number
    paymentStatus: string
}

export interface IGoodModel
    extends Model<
        InferAttributes<IGoodModel>,
        InferCreationAttributes<IGoodModel>
    > {
    title: string
    imageUrl: string
    description: string
    price: number
    seller_id: number
    available: number
    active: boolean
}

// export interface OrderWithGood extends IOrderModel{
//     goods: IGoodModel
// }

type userMin = {
    notFound?: boolean
    id: number
    username: string
    email: string
}

type company = {
    id: number
    name: string
    description: string
    address: string
    email: string
    sellers?: userMin
}

export type user = {
    notFound?: boolean
    id: number
    firstName: string
    lastName: string
    username: string
    password: string
    email: string
    phoneNumber: string
    role: string
    companyId: number
}

type userWithCompany = user & {
    company?: company
}

export type NextApiRequestWithUser = NextApiRequest & {
    user?: user
    session: { [key: string]: any }
    logIn: (user: user, cb: (error: any) => any) => void
    logOut: () => void
}

export type review = {
    new?: boolean
    id: number
    goodId: number
    text: string
    score: number
    authorId: number
    datepub: Date
    author: userMin
}

export type good = {
    notFound?: boolean
    id: number
    title: string
    imageUrl: string
    description: string
    price: number
    seller_id: number
    available: number
    active: boolean
    reviews: review[]
    categories: category[]
    seller: userMin
    averageScore?: number
    reviewsCount?: number
}

export type order = {
    notFound?: boolean
    id: number
    customerId: number
    total: number
    paymentStatus: string
}

type goodWithQuantity = good & {
    OrderGood: {
        quantity: number
    }
}

export type orderWithGoods = order & {
    goods: goodWithQuantity[]
}

type orderWithGoodsAndCustomer = orderWithGoods & {
    customer: userMin
}

export type orderWithGoodsCreate = order & {
    goods: { quantity: number; id: number }[]
}

export type category = {
    id: number
    text: string
}

export interface CategoryProps {
    category: {
        text: string
    }
    goods: object[]
}

export interface CompanyProps {
    notFound?: boolean
    companies: company[]
}

export interface GoodProps {
    good: good
}

export interface GoodsProps {
    goods: good[]
}

export interface OrderProps {
    order: orderWithGoods
}

export interface OrdersProps {
    notFound?: boolean
    orders: orderWithGoodsAndCustomer[]
}

export interface ReviewsProps {
    notFound?: boolean
    reviews: review[]
}

export interface UserGoodsProps {
    notFound?: boolean
    user: user
    goods: good[]
}

type userType = user & { error?: string; message?: string }
export interface UserGoodsOrdersProps {
    notFound?: boolean
    user: userType
    goods: good[]
    orders: orderWithGoods[]
}

export interface UsersProps {
    users: userWithCompany[]
}
