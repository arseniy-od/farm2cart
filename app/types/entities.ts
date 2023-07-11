export type user = {
    error?: boolean
    message?: boolean
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

export type review = {
    id: number
    goodId: number
    text: string
    score: number
    datepub: Date
    author: number
}

export type good = {
    notFound?: boolean
    quantity?: number
    id: number
    title: string
    imageUrl: string
    description: string
    price: number
    available: number
    active: boolean
    reviews?: number[]
    categories: number[]
    seller: number
    averageScore?: number
    reviewsCount?: number
}

export type order = {
    notFound?: boolean
    id: number
    customerId: number
    total: number
    paymentStatus: string
    goods?: number[]
    OrderGoods?: number[]
}

export type category = {
    id: number
    text: string
    CategoryGood?: number
}

export type categoryGood = {
    id: number
    categoryId: number
    goodId: number
}

export type orderGood = {
    id: number
    goodId: number
    orderId: number
    quantity: number
}

export type entities = {
    users?: {
        [key: number]: user
    }
    reviews?: {
        [key: number]: review
    }
    goods?: {
        [key: number]: good
    }
    orders?: {
        [key: number]: order
    }
    categories?: {
        [key: number]: category
    }
    categoryGoods?: {
        [key: number]: categoryGood
    }
    orderGoods?: {
        [key: number]: orderGood
    }
}
