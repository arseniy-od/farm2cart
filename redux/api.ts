export async function fetchUserApi() {
    console.log('fetchUserApi called')

    const res = await fetch('/api/users/me')
    const data = await res.json()
    let user = {}
    if (data.user) {
        user = data.user
    }
    return user
}

export async function fetchCategoriesApi() {
    console.log('fetchCategoriesApi called')

    const res = await fetch('/api/categories')
    const data = await res.json()
    console.log('fetched categories:', data)
    if (data) {
        return data
    }
}

export async function fetchGoodsApi() {
    console.log('fetchGoodsApi called')

    const res = await fetch('/api/goods')
    const data = await res.json()
    console.log('fetched goods:', data)
    if (data) {
        return data
    }
}

// todo: fetch only specific goods
export async function fetchMyGoodsApi() {
    console.log('fetchMyGoodsApi called')

    const res = await fetch('/api/goods')
    const data = await res.json()
    console.log('fetched goods:', data)
    if (data) {
        return data
    }
}

export async function fetchOrdersApi() {
    console.log('fetchOrdersApi called')

    const res = await fetch('/api/orders')
    const data = await res.json()
    console.log('fetched orders:', data)
    if (data) {
        return data
    }
}
