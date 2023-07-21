import { fetchPage, pageFetching } from '@/redux/actions'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { ReactElement } from 'react'

export default function Paginator({ pageName }) {
    const pagination = useAppSelector((state) => state.pagination[pageName])
    const dispatch = useAppDispatch()
    const amount = Math.ceil(pagination.count / pagination.perPage)
    const pageNums: ReactElement[] = []

    function handlePage(index) {
        dispatch(fetchPage(pageName, index))
    }

    for (let index = 1; index <= amount; index++) {
        pageNums.push(
            <li key={index}>
                <button
                    type="button"
                    onClick={() => handlePage(index)}
                    className={`relative block rounded bg-transparent px-3 py-1.5 text-sm text-neutral-600 transition-all duration-300 hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-700 dark:hover:text-white ${
                        pagination.currentPage === index && 'bg-neutral-100'
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
                {pagination.currentPage > 1 && (
                    <li>
                        <button
                            type="button"
                            className="relative block rounded bg-transparent px-3 py-1.5 text-sm text-neutral-600 transition-all duration-300 hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-700 dark:hover:text-white"
                        >
                            Previous
                        </button>
                    </li>
                )}
                {pageNums}
                {pagination.currentPage < amount && (
                    <li>
                        <button
                            type="button"
                            className="relative block rounded bg-transparent px-3 py-1.5 text-sm text-neutral-600 transition-all duration-300 hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-700 dark:hover:text-white"
                        >
                            Next
                        </button>
                    </li>
                )}
            </ul>
        </nav>
    )
}
