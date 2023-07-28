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
                <div className="flex justify-between items-center">
                    <Link
                        className="mt-2 px-4 block w-2/3 hover:shadow-lg"
                        href={`/orders`}
                    >
                        My orders
                    </Link>

                    {user.role === 'seller' && (
                        <>
                            <Link
                                className="mt-2 px-4  block w-2/3 hover:shadow-lg whitespace-nowrap"
                                href="/users/me/goods"
                            >
                                My products
                            </Link>
                            <Link
                                className="mt-2 block px-4 w-2/3 hover:shadow-lg whitespace-nowrap"
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
