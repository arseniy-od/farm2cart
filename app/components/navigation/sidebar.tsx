import Link from 'next/link'

import { Dispatch, SetStateAction, MouseEvent } from 'react'

import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { isEmpty } from '../../utils'
import { logoutSaga } from '@/redux/actions'

export default function Sidebar({
    setIsMenuOpen,
    home,
}: {
    setIsMenuOpen: Dispatch<SetStateAction<boolean>>
    home: boolean
}) {
    const dispatch = useAppDispatch()

    const user = useAppSelector((state) => state.user)
    const categories = useAppSelector((state) => state.entities.categories)
    console.log('Sidebar categories:', categories)

    const handleLogout = async (event: MouseEvent<HTMLButtonElement>) => {
        dispatch(logoutSaga())
    }

    return (
        <div className="xl:hidden">
            <div className="fixed left-0 start-0 z-20 min-h-screen w-2/3 bg-gray-100 md:w-1/3">
                <div className="flex flex-col border-b-2 py-2">
                    {isEmpty(user) || user.blank ? (
                        <div>
                            <Link
                                className="ml-4 block w-2/3 hover:shadow-lg"
                                href="/signup"
                            >
                                Sign up
                            </Link>
                            <Link
                                className="ml-4 mt-2 block w-2/3 hover:shadow-lg"
                                href="/login"
                            >
                                Login
                            </Link>
                        </div>
                    ) : (
                        <div className="">
                            <Link className="ml-4 block" href="/users/me">
                                <div className="mt-2 flex w-2/3 items-center hover:shadow-lg">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        height="1em"
                                        viewBox="0 0 448 512"
                                    >
                                        <path d="M304 128a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM49.3 464H398.7c-8.9-63.3-63.3-112-129-112H178.3c-65.7 0-120.1 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3z" />
                                    </svg>
                                    <div className="ml-2 font-semibold">
                                        {user.username}
                                    </div>
                                </div>
                            </Link>

                            <button
                                className="mt-2 block w-2/3 px-4 text-left hover:shadow-lg"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                            <Link
                                className="mt-2 block w-2/3 px-4 hover:shadow-lg"
                                href={`/orders`}
                            >
                                My orders
                            </Link>

                            {user.role === 'seller' && (
                                <>
                                    <Link
                                        className="mt-2 block  w-2/3 px-4 hover:shadow-lg"
                                        href="/users/me/goods"
                                    >
                                        My products
                                    </Link>
                                    <Link
                                        className="mt-2 block w-2/3 px-4 hover:shadow-lg"
                                        href="/goods/create"
                                    >
                                        Add new product
                                    </Link>
                                </>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex flex-col justify-between">
                    <div>
                        <div className="ml-4 mt-2 font-semibold">
                            Categories:
                        </div>
                        {categories &&
                            !isEmpty(categories) &&
                            Object.values(categories).map((category, i) => (
                                <div key={i}>
                                    <div className="ml-4 mt-1 w-2/3 hover:shadow-lg">
                                        <Link
                                            href={
                                                category.text
                                                    ? `/categories/${category.text.toLowerCase()}`
                                                    : '#'
                                            }
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            {category.text}
                                        </Link>
                                    </div>
                                </div>
                            ))}
                    </div>
                    <div className="mt-6">
                        {home || (
                            <Link
                                href="/"
                                className="ml-4 block w-1/2 px-4 py-2 shadow-lg hover:bg-gray-200"
                            >
                                Home page
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            <button onClick={() => setIsMenuOpen(false)} className="block">
                <div className="fixed z-10 min-h-screen w-screen cursor-default bg-gray-900 opacity-[50%]"></div>
            </button>
        </div>
    )
}
