import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
    Dispatch,
    SetStateAction,
    useEffect,
    useState,
    MouseEvent,
} from 'react'
import { category, user } from '../types/interfaces'

export default function Sidebar({
    setIsMenuOpen,
    home,
}: {
    setIsMenuOpen: Dispatch<SetStateAction<boolean>>
    home: boolean
}) {
    const [user, setUser] = useState<user | object>({})
    const [categories, setCategories] = useState<category[]>([])

    const { push } = useRouter()

    function fetchUser() {
        fetch('/api/users/me')
            .then((res) => res.json())
            .then((data) => {
                if (data.user) {
                    setUser(data.user)
                }
            })
    }

    function fetchCategories() {
        fetch('/api/categories')
            .then((res) => res.json())
            .then((data) => {
                setCategories(data)
            })
    }

    const handleLogout = async (event: MouseEvent<HTMLButtonElement>) => {
        setUser({})
        const res = await fetch('/api/auth/logout')
        if (res.ok) {
            console.log('Logout successful')
            home || push('/')
        } else {
            console.log('Logout error')
        }
    }

    useEffect(fetchUser, [])
    useEffect(fetchCategories, [])

    return (
        <div className="">
            <div className="fixed start-0 left-0 z-20 bg-gray-100 w-2/3 min-h-screen">
                <div className="py-2 flex flex-col border-b-2">
                    {Object.keys(user).length === 0 || user.error ? (
                        <div>
                            <Link
                                className="block ml-4 w-2/3 hover:shadow-lg"
                                href="http://localhost:3000/signup"
                            >
                                Sign up
                            </Link>
                            <Link
                                className="block ml-4 mt-2 w-2/3 hover:shadow-lg"
                                href="http://localhost:3000/login"
                            >
                                Login
                            </Link>
                        </div>
                    ) : (
                        <div className="">
                            <Link
                                className="block ml-4"
                                href="http://localhost:3000/users/me"
                            >
                                <div className="mt-2 flex items-center w-2/3 hover:shadow-lg">
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
                                className="mt-2 block px-4 w-2/3 text-left hover:shadow-lg"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                            <Link
                                className="mt-2 px-4 block w-2/3 hover:shadow-lg"
                                href={`/users/me/orders`}
                            >
                                My orders
                            </Link>

                            {user.role === 'seller' && (
                                <>
                                    <Link
                                        className="mt-2 px-4  block w-2/3 hover:shadow-lg"
                                        href="/users/me/goods"
                                    >
                                        My products
                                    </Link>
                                    <Link
                                        className="mt-2 block px-4 w-2/3 hover:shadow-lg"
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
                        {categories.length &&
                            categories.map((category, i) => (
                                <div key={i}>
                                    <div className="ml-4 mt-1 w-2/3 hover:shadow-lg">
                                        <Link
                                            href={`/categories/${category.text.toLowerCase()}`}
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
                                className="ml-4 px-4 py-2 w-1/2 shadow-lg block hover:bg-gray-200"
                            >
                                Home page
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            <button onClick={() => setIsMenuOpen(false)} className="block">
                <div className="z-10 fixed bg-gray-900 opacity-[50%] min-h-screen w-screen cursor-default"></div>
            </button>
        </div>
    )
}
