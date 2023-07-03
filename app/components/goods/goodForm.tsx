import { useRouter } from 'next/navigation'
import { ChangeEvent, Dispatch, MouseEvent, SetStateAction } from 'react'
import axios from 'axios'

import Layout from '@/app/layout'
import { category } from '@/app/types/interfaces'
import { useAppDispatch } from '@/redux/hooks'
import goods from '@/pages/api/goods'

interface IGood {
    id?: string
    title: string
    description: string
    imageUrl: string
    price: string
    categories: number[]
    file: File | null
    available: string
}

type Props = {
    good: IGood
    setGood: Dispatch<SetStateAction<IGood>>
    categories: category[]
    method: 'post' | 'put'
}

export default function GoodForm({ good, setGood, categories, method }: Props) {
    const { push } = useRouter()
    const dispatch = useAppDispatch()
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const file = event.target.files[0]
            setGood({ ...good, file })
        } else {
            console.error('[File change] File not found')
        }
    }

    const handleCategoryChange = (event: ChangeEvent<HTMLInputElement>) => {
        const categoryId = parseInt(event.target.name)
        const isChecked = event.target.checked
        if (isChecked) {
            setGood({ ...good, categories: [...good.categories, categoryId] })
        } else {
            setGood({
                ...good,
                categories: good.categories.filter((c) => c !== categoryId),
            })
        }
    }

    const handleSubmit = async (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        const formData = new FormData()
        if (!good.file) {
            console.log('[submit] File not found')
        } else {
            formData.append('file', good.file)
        }

        if (method === 'put' && good.id) {
            formData.append('id', good.id)
        }
        formData.append('title', good.title)
        formData.append('description', good.description)
        formData.append('imageUrl', good.imageUrl)
        formData.append('price', good.price)
        formData.append('available', good.available)
        formData.append('active', '1')

        good.categories.forEach((category) => {
            formData.append('categories', category.toString())
        })
        const config = {
            headers: { 'content-type': 'multipart/form-data' },
        }
        if (method === 'post') {
            const response = await axios.post('/api/goods', formData, config)
            if (response.status === 200) {
                const goodCategories = categories.filter((c) =>
                    good.categories.includes(c.id)
                )
                dispatch({
                    type: 'goods/create_good',
                    payload: {
                        ...good,
                        id: response.data.id,
                        price: parseFloat(good.price),
                        available: parseInt(good.available),
                        categories: goodCategories,
                    },
                })
                // console.log('Response: ', response)
                push('/goods/' + good.id)
            } else {
                console.error(response.statusText)
            }

            // console.log('Response id: ', response.data.id)
            push('/goods/' + response.data.id)
        } else if (method === 'put') {
            const response = await axios.put('/api/goods', formData, config)
            if (response.status === 200) {
                const goodCategories = categories.filter((c) =>
                    good.categories.includes(c.id)
                )
                dispatch({
                    type: 'goods/edit_good',
                    payload: {
                        ...good,
                        price: parseFloat(good.price),
                        available: parseInt(good.available),
                        categories: goodCategories,
                    },
                })
                // console.log('Response: ', response)
                push('/goods/' + good.id)
            } else {
                console.error(response.statusText)
            }
        } else {
            console.error(
                `Method ${method} is not implemented. Use 'post' or 'put'`
            )
        }
    }

    return (
        <Layout>
            <div className="mt-6 grid place-items-center">
                <form className="content-center">
                    <h3 className="text-xl">Add new product</h3>
                    <div className="mt-4">
                        <div>
                            <div>
                                <label htmlFor="title">Title: </label>
                            </div>
                            <input
                                type="text"
                                id="title"
                                value={good.title}
                                onChange={(event) =>
                                    setGood({
                                        ...good,
                                        title: event.target.value,
                                    })
                                }
                                className="mt-2 px-4 py-3 w-full max-w-xs border-2"
                                placeholder="title"
                                required
                            />
                        </div>
                        <div>
                            <div>
                                <label htmlFor="description">
                                    Description:{' '}
                                </label>
                            </div>

                            <textarea
                                id="description"
                                value={good.description}
                                onChange={(event) =>
                                    setGood({
                                        ...good,
                                        description: event.target.value,
                                    })
                                }
                                className="mt-2 px-4 py-3 w-full max-w-xs border-2"
                                placeholder="description"
                            />
                        </div>
                        <div>
                            <input
                                type="file"
                                name="file"
                                onChange={handleFileChange}
                                required
                            />
                        </div>
                        <div>
                            <div>
                                <label htmlFor="price">Price: </label>
                            </div>
                            <input
                                type="number"
                                min="0"
                                step="0.05"
                                id="price"
                                value={good.price}
                                onChange={(event) =>
                                    setGood({
                                        ...good,
                                        price: event.target.value,
                                    })
                                }
                                className="mt-2 px-4 py-3 w-full max-w-xs border-2"
                                placeholder="price"
                                required
                            />
                        </div>
                        <div>
                            <div>
                                <label htmlFor="available">available: </label>
                            </div>
                            <input
                                type="number"
                                min="1"
                                id="available"
                                value={good.available}
                                onChange={(event) =>
                                    setGood({
                                        ...good,
                                        available: event.target.value,
                                    })
                                }
                                className="mt-2 px-4 py-3 w-full max-w-xs border-2"
                                placeholder="available"
                            />
                        </div>
                        <h3>Choose categories: </h3>
                        <div className="grid grid-cols-2">
                            {categories.map((category, i) => (
                                <div key={i}>
                                    <p>
                                        <label htmlFor={category.id.toString()}>
                                            {' '}
                                            {category.text}
                                        </label>
                                        <input
                                            type="checkbox"
                                            name={category.id.toString()}
                                            checked={good.categories.includes(
                                                category.id
                                            )}
                                            onChange={handleCategoryChange}
                                        />
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleSubmit}
                        type="submit"
                        className="mt-4 inline-block items-center bg-gray-400 hover:bg-gray-600 focus:outline-none focus:shadow-outline rounded-lg shadow px-8 py-2"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </Layout>
    )
}
