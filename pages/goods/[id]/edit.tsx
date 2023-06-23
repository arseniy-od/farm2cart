import { createRouter } from 'next-connect'
import {
    GetServerSideProps,
    GetStaticPaths,
    GetStaticProps,
    NextApiRequest,
    NextApiResponse,
} from 'next'
import Link from 'next/link'
import axios from 'axios'
import { useState, MouseEvent, ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'

import Layout from '@/app/layout'
import container from '@/server/container'
import { category } from '@/app/interfaces'

interface Good {
    title: string
    description: string
    imageUrl: string
    price: string
    categories: number[]
    file: File | null
    available: string
}

export default function Home({
    good,
    categories,
}: {
    good: good
    categories: category[]
}) {
    const { push } = useRouter()
    const [goodData, setGoodData] = useState<Good>({ ...good })

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const file = event.target.files[0]
            setGoodData({ ...goodData, file })
        } else {
            console.error('[File change] File not found')
        }
    }

    const handleCategoryChange = (event: ChangeEvent<HTMLInputElement>) => {
        const category = parseInt(event.target.name)
        const isChecked = event.target.checked
        if (isChecked) {
            setGoodData({
                ...goodData,
                categories: [...goodData.categories, category],
            })
        } else {
            setGoodData({
                ...goodData,
                categories: goodData.categories.filter((c) => c !== category),
            })
        }
    }

    const handleSubmit = async (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        const formData = new FormData()
        // console.log("GOOD FILE: ", good.file)

        formData.append('id', good.id)
        if (goodData.file) {
            formData.append('file', goodData.file)
        }
        formData.append('title', goodData.title)
        formData.append('description', goodData.description)
        formData.append('imageUrl', goodData.imageUrl)
        formData.append('price', goodData.price)
        formData.append('available', goodData.available)
        // formData.append('NewCategory', good.NewCategory)
        formData.append('active', '1')

        goodData.categories.forEach((category) => {
            formData.append('categories', category.toString())
        })
        console.log('Good object: ', good)
        const config = {
            headers: { 'content-type': 'multipart/form-data' },
        }

        const response = await axios.put('/api/goods', formData, config)
        console.log('Response id: ', response.data.id)
        push('/goods/' + response.data.id)
    }

    return (
        <div id="app" className="">
            <Layout>
                <div className="mt-6 grid place-items-center">
                    <form className="content-center">
                        <h3 className="text-xl">Edit product</h3>
                        <div className="mt-4">
                            <div>
                                <div>
                                    <label htmlFor="title">Title: </label>
                                </div>
                                <input
                                    type="text"
                                    id="title"
                                    value={goodData.title}
                                    onChange={(event) =>
                                        setGoodData({
                                            ...goodData,
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
                                    value={goodData.description}
                                    onChange={(event) =>
                                        setGoodData({
                                            ...goodData,
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
                                    value={goodData.price}
                                    onChange={(event) =>
                                        setGoodData({
                                            ...goodData,
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
                                    <label htmlFor="available">
                                        available:{' '}
                                    </label>
                                </div>
                                <input
                                    type="number"
                                    min="1"
                                    id="available"
                                    value={goodData.available}
                                    onChange={(event) =>
                                        setGoodData({
                                            ...goodData,
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
                                            <label
                                                htmlFor={category.id.toString()}
                                            >
                                                {' '}
                                                {category.text}
                                            </label>
                                            <input
                                                type="checkbox"
                                                name={category.id.toString()}
                                                checked={goodData.categories.includes(
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
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const good = await container.resolve('GoodController').getGood(ctx)
    const categories = await container
        .resolve('CategoryController')
        .getCategoriesWithGoods()
    return { props: { ...good, ...categories } }
}
