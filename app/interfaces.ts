type userMin = {
    id: number
    username: string
    email: string
}


type company = {
    id: number
    name: string
    description: string
    address: string,
    email: string
    sellers?: userMin
}

type review = {
    new?: boolean
    id: number
    goodId?: number,
    text: string,
    score: number,
    authorId: number,
    datepub: Date
    author: userMin
}


export type good = {
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

}

type category = {
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

