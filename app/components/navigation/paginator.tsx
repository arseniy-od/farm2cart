import { fetchPage, fetchPaginatedGoods } from '@/redux/actions'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { ReactElement, useEffect } from 'react'

export default function Paginator({ pageName, fetchAction, userId }) {
    const pagination = useAppSelector((state) => state.pagination[pageName])
    const dispatch = useAppDispatch()
    useEffect(() => {
        if (!pagination?.count) {
            if (userId) {
                dispatch(fetchAction(userId, pageName, 1))
            } else {
                dispatch(fetchAction(pageName, 1))
            }
        }
    }, [dispatch, fetchAction, pagination, pageName, userId])
    const currentPage = pagination?.currentPage || 1
    const amount = Math.ceil(
        (pagination?.count || 0) / (pagination?.perPage || 1)
    )
    const pageNums: ReactElement[] = []

    function handlePage(index) {
        if (userId) {
            dispatch(fetchAction(userId, pageName, index))
        } else {
            dispatch(fetchAction(pageName, index))
        }
    }

    for (let index = 1; index <= amount; index++) {
        pageNums.push(
            <li key={index}>
                <button
                    type="button"
                    onClick={() => handlePage(index)}
                    className={`relative block rounded px-3 py-1.5 text-sm text-neutral-600 transition-all duration-300 hover:bg-neutral-100 ${
                        pagination.currentPage === index
                            ? 'bg-neutral-100'
                            : 'bg-transparent'
                    }`}
                >
                    {index}
                </button>
            </li>
        )
    }
    return (
        <nav aria-label="Page navigation example">
            <ul className="mt-4 list-style-none flex justify-center">
                <li>
                    <button
                        onClick={() => handlePage(currentPage - 1)}
                        type="button"
                        className={`relative block rounded bg-transparent px-3 py-1.5 text-sm transition-all duration-300 ${
                            (currentPage || 1) > 1
                                ? 'text-neutral-600 hover:bg-neutral-100'
                                : 'text-neutral-400'
                        }`}
                        disabled={(currentPage || 1) === 1}
                    >
                        Previous
                    </button>
                </li>

                {pageNums}

                <li>
                    <button
                        onClick={() => handlePage(currentPage + 1)}
                        type="button"
                        className={`relative block rounded bg-transparent px-3 py-1.5 text-sm transition-all duration-300 ${
                            (currentPage || 1) !== amount
                                ? 'text-neutral-600 hover:bg-neutral-100'
                                : 'text-neutral-400'
                        }`}
                        disabled={currentPage === amount}
                    >
                        Next
                    </button>
                </li>
            </ul>
        </nav>
    )
}
