import { useEffect } from 'react'
import Paginator from '../navigation/paginator'
import GoodCard from './goodCard'
import { good } from '@/app/types/entities'

export default function GoodTable({
    goods,
    pageName,
    fetchAction,
    userId = undefined,
}: {
    goods: good[]
    pageName: string
    fetchAction: any
    userId?: number
}) {
    useEffect(() => console.log('Goods Table: ', goods), [goods])
    return (
        <>
            <div className="mx-auto flex flex-wrap justify-center">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {goods.map((good, i) => (
                        <div key={i}>
                            <GoodCard good={good} />
                        </div>
                    ))}
                </div>
            </div>
            <Paginator
                pageName={pageName}
                fetchAction={fetchAction}
                userId={userId}
            />
        </>
    )
}
