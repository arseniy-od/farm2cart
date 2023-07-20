import { GetServerSidePropsContext, NextApiRequest, PreviewData } from 'next'
import { ParsedUrlQuery } from 'querystring'
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

type userMin = {
    notFound?: boolean
    id: number
    username: string
    email: string
}

export type company = {
    id: number
    name: string
    description: string
    address: string
    email: string
    sellers?: userMin
}

export type user = {
    error?: boolean
    message?: string
    id: number
    firstName: string
    lastName: string
    username: string
    password?: string
    email: string
    phoneNumber?: string
    role: string
    companyId?: number
    registrationDate: Date
}

export interface IUser {
    id: number
    firstName: string
    lastName: string
    username: string
    password: string
    email: string
    phoneNumber?: string
    role: string
    companyId: number
    registrationDate: Date
}

export type NextApiRequestWithUser = NextApiRequest & {
    identity?: user
    session: { [key: string]: any }
    logIn: (user: user, cb: (error: any) => any) => void
    logOut: () => void
}

export type NextApiRequestFile = NextApiRequestWithUser & {
    file?: Express.Multer.File
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
    quantity?: number
    id: number
    title: string
    imageUrl: string
    description: string
    price: number
    seller_id?: number
    available: number
    active: boolean
    reviews?: review[]
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

export type orderWithGoodsCreate = order & {
    goods: { quantity: number; id: number }[]
}

export type category = {
    id: number
    text: string
}

export type ContextDynamicRoute = GetServerSidePropsContext<
    ParsedUrlQuery,
    PreviewData
> & {
    routeName?: string
}
