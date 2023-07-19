import GoodForm from '@/app/components/goods/goodForm'

export default function Home() {
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

    return <GoodForm good={good} method="post" />
}
