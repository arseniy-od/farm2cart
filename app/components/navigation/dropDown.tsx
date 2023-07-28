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
            <div className="absolute mt-3 bg-white right-0 w-48 py-2 shadow-xl xl:border">
                {isEmpty(user) || user.blank ? (
                    <>
                        <Link
                            href="/signup"
                            className="block hover:text-white mt-0 text-gray-800 px-4 py-2 hover:bg-indigo-500"
                        >
                            Sign up
                        </Link>
                        <Link
                            href="/login"
                            className="block hover:text-white mt-0 text-gray-800 px-4 py-2 hover:bg-indigo-500"
                        >
                            Login
                        </Link>
                    </>
                ) : (
                    <>
                        <Link
                            href="/users/me"
                            className="block hover:text-white mt-0 text-gray-800 px-4 py-2 hover:bg-indigo-500 font-semibold"
                        >
                            {user.username}
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="block hover:text-white mt-0 text-gray-800 px-4 py-2 hover:bg-indigo-500 w-full text-left"
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
                    className="px-2 py-2 flex items-center justify-center hover:shadow-lg hover:rounded"
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
                        className="z-30 fixed opacity-0 inset-0 cursor-default min-h-full min-w-full"
                    ></button>

                    <div className="relative z-40">
                        <Dropdown />
                    </div>
                </div>
            </div>
        </div>
    )
}
