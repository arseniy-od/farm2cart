import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import './globals.css'

import Sidebar from './components/sidebar'

export const siteTitle = 'farm2cart'

export default function Layout({ children, home = false }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

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

                <header className="sticky z-10 top-0 px-4 py-3 text-gray-900 bg-gray-100 border-2">
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
                        <Link href="/">
                            <h2 className="text-2xl font-semibold tracking-widest">
                                FARM2CART
                            </h2>
                        </Link>

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
                {isMenuOpen && <Sidebar setIsMenuOpen={setIsMenuOpen} />}

                <main className="">{children}</main>
            </div>
        </div>
    )
}

// export const getStaticProps: GetStaticProps = async ({ params }) => {
//     const categories = await container
//         .resolve('CategoryController')
//         .getCategoriesWithGoods()
//     return { props: categories }
// }

//! old sidebar
// <div className="relative">
//     <div className="absolute fixed z-20 bg-gray-100 w-2/3 min-h-screen">
//         <div className="py-2 flex flex-col border-b-2">
//             {!user || user.error ? (
//                 <div>
//                     <Link
//                         className="block "
//                         href="http://localhost:3000/signup"
//                     >
//                         Sign up
//                     </Link>
//                     <Link className="block " href="http://localhost:3000/login">
//                         Login
//                     </Link>
//                 </div>
//             ) : (
//                 <div className="">
//                     <Link
//                         className="block ml-4"
//                         href="http://localhost:3000/users/me"
//                     >
//                         <div className="mt-2 flex items-center">
//                             <svg
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 height="1em"
//                                 viewBox="0 0 448 512"
//                             >
//                                 <path d="M304 128a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM49.3 464H398.7c-8.9-63.3-63.3-112-129-112H178.3c-65.7 0-120.1 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3z" />
//                             </svg>
//                             <div className="ml-2 font-semibold">
//                                 {user.username}
//                             </div>
//                         </div>
//                     </Link>

//                     {user.role === 'seller' && (
//                         <Link className="mt-2 block px-4" href="/goods/create">
//                             Add new product
//                         </Link>
//                     )}
//                     <button className="mt-2 block px-4" onClick={handleLogout}>
//                         Logout
//                     </button>
//                 </div>
//             )}
//         </div>

//         <div>
//             <div className="ml-4 mt-2 font-semibold">Categories:</div>
//             {categories.length &&
//                 categories.map((category, i) => (
//                     <div key={i}>
//                         <div className="ml-4 mt-1">
//                             <Link
//                                 href={`/categories/${category.text.toLowerCase()}`}
//                             >
//                                 {category.text}
//                             </Link>
//                         </div>
//                     </div>
//                 ))}
//         </div>
//     </div>

//     <button onClick={() => setIsMenuOpen(false)} className="block">
//         <div className="absolute z-10 fixed bg-gray-900 opacity-[50%] min-h-screen w-screen cursor-default"></div>
//     </button>
// </div>
