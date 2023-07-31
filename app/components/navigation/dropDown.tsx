import { useEffect, useState } from 'react'
import Link from 'next/link'
import { isEmpty } from '@/app/utils'
import { useAppDispatch } from '@/redux/hooks'
import { logoutSaga } from '@/redux/actions'

export default function DropdownMenu({ user }) {
    const [isOpen, setIsOpen] = useState(false)
    const dispatch = useAppDispatch()

    const handleLogout = async () => {
        dispatch(logoutSaga())
    }

    function Dropdown() {
        return (
            <div className="absolute right-0 mt-3 w-48 bg-white py-2 shadow-xl xl:border">
                {isEmpty(user) || user.blank ? (
                    <>
                        <Link
                            href="/signup"
                            className="mt-0 block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white"
                        >
                            Sign up
                        </Link>
                        <Link
                            href="/login"
                            className="mt-0 block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white"
                        >
                            Login
                        </Link>
                    </>
                ) : (
                    <>
                        <Link
                            href="/users/me"
                            className="mt-0 block px-4 py-2 font-semibold text-gray-800 hover:bg-indigo-500 hover:text-white"
                        >
                            {user.username}
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="mt-0 block w-full px-4 py-2 text-left text-gray-800 hover:bg-indigo-500 hover:text-white"
                        >
                            Logout
                        </button>
                    </>
                )}
            </div>
        )
    }

    useEffect(() => {
        const handleEscape = (event) => {
            if (event.keyCode === 27) {
                setIsOpen(false)
            }
        }

        document.addEventListener('keydown', handleEscape)

        return () => {
            document.removeEventListener('keydown', handleEscape)
        }
    }, [])

    const toggle = () => {
        setIsOpen(!isOpen)
    }

    return (
        <div className="hidden xl:block">
            <div className="relative">
                <button
                    type="button"
                    onClick={toggle}
                    className="flex items-center justify-center px-2 py-2 hover:rounded hover:shadow-lg"
                >
                    <svg
                        className="h-5"
                        xmlns="http://www.w3.org/2000/svg"
                        height="1em"
                        viewBox="0 0 448 512"
                    >
                        <path d="M304 128a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM49.3 464H398.7c-8.9-63.3-63.3-112-129-112H178.3c-65.7 0-120.1 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3z" />
                    </svg>
                </button>
                <div className={`${!isOpen ? 'hidden' : 'block'}`}>
                    {/* Button on all screen to exit on click  */}
                    <button
                        onClick={() => {
                            setIsOpen(false)
                        }}
                        className="fixed inset-0 z-30 min-h-full min-w-full cursor-default opacity-0"
                    ></button>

                    <div className="relative z-40">
                        <Dropdown />
                    </div>
                </div>
            </div>
        </div>
    )
}
