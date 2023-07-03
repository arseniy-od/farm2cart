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
import { category } from '@/app/types/interfaces'
import GoodForm from '@/app/components/goods/goodForm'

interface Good {
    id?: string
    title: string
    description: string
    imageUrl: string
    price: string
    categories: number[]
    file: File | null
    available: string
}

export default function Home({ categories }: { categories: category[] }) {
    const { push } = useRouter()
    const [good, setGood] = useState<Good>({
        title: '',
        description: '',
        imageUrl: '',
        price: '',
        categories: [],
        file: null,
        available: '1',
    })

    return (
        <GoodForm
            good={good}
            setGood={setGood}
            categories={categories}
            method="post"
        />
    )
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const categories = await container
        .resolve('CategoryController')
        .getCategories()
    return { props: { categories } }
}
