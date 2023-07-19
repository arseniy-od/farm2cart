export type user = {
    id?: number
    firstName?: string
    lastName?: string
    username?: string
    password?: string
    email?: string
    phoneNumber?: string
    role?: string
    companyId?: number
    registrationDate?: string
}

export type review = {
    id?: number
    text?: string
    score?: number
    datepub?: string
    author?: number
}

export type good = {
    quantity?: number
    id?: number
    title?: string
    imageUrl?: string
    description?: string
    price?: number
    available?: number
    active?: number | boolean
    reviews?: number[]
    categories?: number[]
    seller?: number
    averageScore?: number
    reviewsCount?: number
}

export type order = {
    id?: number
    customerId?: number
    total?: number
    paymentStatus?: string
    goods?: number[]
    OrderGoods?: number[]
}

export type category = {
    id?: number
    text?: string
    CategoryGood?: number
    goods?: number[]
}

export type categoryGood = {
    id?: number
    categoryId?: number
    goodId?: number
}

export type orderGood = {
    id?: number
    goodId?: number
    orderId?: number
    quantity?: number
}

export type cartItem = {
    id?: number
    quantity?: number
    good?: number
}

export type entities = {
    users?: {
        [key: string]: user
    }
    reviews?: {
        [key: string]: review
    }
    goods?: {
        [key: string]: good
    }
    orders?: {
        [key: string]: order
    }
    categories?: {
        [key: string]: category
    }
    categoryGoods?: {
        [key: string]: categoryGood
    }
    orderGoods?: {
        [key: string]: orderGood
    }
    cartItems?: {
        [key: string]: cartItem
    }
}
