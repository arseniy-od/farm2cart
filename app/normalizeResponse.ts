import { normalize, schema, NormalizedSchema } from 'normalizr'
import {
    cartItem,
    category,
    categoryGood,
    entities,
    good,
    order,
    orderGood,
    review,
    user,
} from './types/entities'

interface EntityMap {
    users: user
    goods: good
    categories: category
    reviews: review
    orders: order
    cartItems: cartItem
    orderGoods: orderGood
    categoryGoods: categoryGood
}

type NormalizedData = {
    [K in keyof EntityMap]: {
        [key: string]: EntityMap[K] & {
            error?: string
        }
    }
}

export const normalizeResponse = (
    responseData,
    schema: schema.Array | schema.Entity
): NormalizedSchema<NormalizedData, string[]> => {
    return normalize(responseData, schema)
}
