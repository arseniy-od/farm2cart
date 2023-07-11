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

export default function Home({ categories }: { categories: category[] }) {
    const { push } = useRouter()
    const good = {
        id: 0,
        title: '',
        description: '',
        imageUrl: '',
        price: 0,
        categories: [],
        available: 1,
        active: true,
        seller: 0,
    }

    return <GoodForm good={good} categories={categories} method="post" />
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const categories = await container
        .resolve('CategoryController')
        .getCategories()
    return { props: { categories } }
}
