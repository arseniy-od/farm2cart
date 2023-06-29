export async function fetchUserApi() {
    console.log('fetchUserApi called')

    const res = await fetch('/api/users/me')
    const data = await res.json()
    console.log('fetched user:', data.user)
    if (data.user) {
        return data.user
    }
    return {}
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
