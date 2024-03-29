import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import './globals.css'

import Sidebar from './components/navigation/sidebar'
import { useAppDispatch } from '@/redux/hooks'
import { ConnectedProps, connect } from 'react-redux'
import { RootState } from '@/redux/store'
import { fetchUser, fetchCategories } from '@/redux/actions'
import { isEmpty } from './utils'
import OptionalHeader from './components/navigation/optionalHeader'
import DropdownMenu from './components/navigation/dropDown'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export const siteTitle = 'farm2cart'

function Layout({
    children,
    home = false,
    handleSearch = null,
    fetchUser,
    fetchCategories,
    user,
    categories,
    cartItems,
}: Props) {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    function getUser() {
        if (isEmpty(user)) {
            fetchUser()
        }
    }
    function getCategories() {
        if (!categories || isEmpty(categories)) {
            fetchCategories()
        }
    }

    useEffect(getUser, [fetchUser, user])
    useEffect(getCategories, [fetchCategories, categories])

    // to disable scrolling when sidebar is open
    if (typeof window != 'undefined') {
        if (isMenuOpen) {
            document
                .getElementsByTagName('body')[0]
                .classList.add('overflow-y-hidden', 'xl:overflow-auto')
        } else {
            document
                .getElementsByTagName('body')[0]
                .classList.remove('overflow-y-hidden')
        }
    }

    return (
        <div className="min-h-screen bg-gray-200 text-gray-900">
            <div>
                <Head>
                    <title>{siteTitle}</title>
                </Head>

                <header className="sticky top-0 z-20 bg-gray-100 text-gray-900">
                    <div className="flex items-center justify-between py-3">
                        {/* Menu button */}
                        <button
                            className="ml-4 xl:hidden"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="1em"
                                    viewBox="0 0 384 512"
                                >
                                    <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                                </svg>
                            ) : (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="1em"
                                    viewBox="0 0 448 512"
                                >
                                    <path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z" />
                                </svg>
                            )}
                        </button>

                        {/* Home icon */}
                        {home ? (
                            <h2 className="text-2xl font-semibold tracking-widest xl:ml-6 xl:text-4xl">
                                FARM2CART
                            </h2>
                        ) : (
                            <Link href="/">
                                <h2 className="text-2xl font-semibold tracking-widest xl:ml-6 xl:text-4xl">
                                    FARM2CART
                                </h2>
                            </Link>
                        )}

                        {/* Cart icon */}
                        <div className="mx-2 flex items-center">
                            <OptionalHeader user={user} />
                            {handleSearch && (
                                <div className="hidden px-2 lg:block">
                                    <form onSubmit={handleSearch}>
                                        <input
                                            name="search"
                                            type="text"
                                            placeholder="Search..."
                                            className="w-full rounded border-none"
                                        />
                                    </form>
                                </div>
                            )}
                            <Link
                                href="/cart"
                                className="block px-2 py-2 hover:rounded hover:shadow-lg"
                            >
                                {cartItems && !isEmpty(cartItems) ? (
                                    <svg
                                        className="h-4 xl:h-5"
                                        xmlns="http://www.w3.org/2000/svg"
                                        height="1em"
                                        viewBox="0 0 576 512"
                                    >
                                        <path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96zM252 160c0 11 9 20 20 20h44v44c0 11 9 20 20 20s20-9 20-20V180h44c11 0 20-9 20-20s-9-20-20-20H356V96c0-11-9-20-20-20s-20 9-20 20v44H272c-11 0-20 9-20 20z" />
                                    </svg>
                                ) : (
                                    <svg
                                        className="h-4 xl:h-5"
                                        xmlns="http://www.w3.org/2000/svg"
                                        height="1em"
                                        viewBox="0 0 576 512"
                                    >
                                        <path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z" />
                                    </svg>
                                )}
                            </Link>

                            <DropdownMenu user={user} />
                        </div>
                    </div>
                    <ToastContainer position="top-center" />
                </header>

                {isMenuOpen && (
                    <Sidebar setIsMenuOpen={setIsMenuOpen} home={home} />
                )}
                {handleSearch && (
                    <form
                        onSubmit={handleSearch}
                        className="flex w-full justify-end border-2 border-gray-200 bg-gray-100 py-2 lg:hidden"
                    >
                        <input
                            name="search"
                            type="text"
                            placeholder="Search..."
                            className="mx-4 w-full rounded border-none sm:w-2/3 md:w-1/2 lg:w-1/3"
                        />
                    </form>
                )}

                <main className="">{children}</main>
                <footer className="mt-4 py-6 text-center">
                    All rights reserved, farm2cart 2023
                </footer>
            </div>
        </div>
    )
}

const mapState = (state: RootState) => ({
    cartItems: state.entities.cartItems,
    user: state.user,
    categories: state.entities.categories,
})

const mapDispatch = {
    fetchUser,
    fetchCategories,
}

const connector = connect(mapState, mapDispatch)
type Props = ConnectedProps<typeof connector> & {
    home: boolean
    [key: string]: any
}

export default connector(Layout)
