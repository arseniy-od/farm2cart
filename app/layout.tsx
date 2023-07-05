import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import './globals.css'

import Sidebar from './components/sidebar'
import { useAppDispatch } from '@/redux/hooks'
import { ConnectedProps, connect } from 'react-redux'
import { RootState } from '@/redux/store'
import { fetchUser, fetchCategories } from '@/redux/actions'

export const siteTitle = 'farm2cart'

function Layout({
    children,
    home = false,
    dispatchUser,
    dispatchCategories,
    user,
    categories,
}: Props) {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    function getUser() {
        if (Object.keys(user).length === 0) {
            dispatchUser()
        }
    }
    function getCategories() {
        if (Object.keys(categories).length === 0) {
            dispatchCategories()
        }
    }

    useEffect(getUser, [dispatchUser, user])
    useEffect(getCategories, [dispatchCategories, categories])

    if (typeof window != 'undefined') {
        if (isMenuOpen) {
            document
                .getElementsByTagName('body')[0]
                .classList.add('overflow-y-hidden')
        } else {
            document
                .getElementsByTagName('body')[0]
                .classList.remove('overflow-y-hidden')
        }
    }

    return (
        <div className="bg-gray-100 min-h-screen text-gray-900">
            <div>
                <Head>
                    <title>{siteTitle}</title>
                </Head>

                <header className="sticky z-20 top-0 px-4 py-3 text-gray-900 bg-gray-100 border-2">
                    <div className="flex justify-between items-center">
                        {/* Menu button */}
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
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
                            <h2 className="text-2xl font-semibold tracking-widest">
                                FARM2CART
                            </h2>
                        ) : (
                            <Link href="/">
                                <h2 className="text-2xl font-semibold tracking-widest">
                                    FARM2CART
                                </h2>
                            </Link>
                        )}

                        {/* Cart icon */}
                        <Link href="/cart" className="inline-block">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="1em"
                                viewBox="0 0 576 512"
                            >
                                <path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z" />
                            </svg>
                        </Link>
                    </div>
                </header>

                {/* Sidebar menu */}
                {isMenuOpen && (
                    <Sidebar setIsMenuOpen={setIsMenuOpen} home={home} />
                )}

                <main className="">{children}</main>
            </div>
        </div>
    )
}

const mapState = (state: RootState) => ({
    user: state.user,
    categories: state.categories,
})

const mapDispatch = {
    dispatchUser: fetchUser,
    dispatchCategories: fetchCategories,
}

const connector = connect(mapState, mapDispatch)
type Props = ConnectedProps<typeof connector> & {
    home: boolean
    [key: string]: any
}

export default connector(Layout)
