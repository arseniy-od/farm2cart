import Link from 'next/link'
import { MouseEvent } from 'react'
import { logoutSaga } from '@/redux/actions'
import { useAppDispatch } from '@/redux/hooks'
import { isEmpty } from '@/app/utils'

export default function OptionalHeader({ user }) {
    const dispatch = useAppDispatch()
    const handleLogout = async (event: MouseEvent<HTMLButtonElement>) => {
        dispatch(logoutSaga())
    }

    return (
        <div className="hidden xl:block">
            {!isEmpty(user) && !user.error && !user.blank && (
                <div className="flex items-center justify-between">
                    <Link
                        className="mt-2 block w-2/3 px-4 hover:shadow-lg"
                        href={`/orders`}
                    >
                        My orders
                    </Link>

                    {user.role === 'seller' && (
                        <>
                            <Link
                                className="mt-2 block  w-2/3 whitespace-nowrap px-4 hover:shadow-lg"
                                href="/users/me/goods"
                            >
                                My products
                            </Link>
                            <Link
                                className="mt-2 block w-2/3 whitespace-nowrap px-4 hover:shadow-lg"
                                href="/goods/create"
                            >
                                Add new product
                            </Link>
                        </>
                    )}
                </div>
            )}
        </div>
    )
}
