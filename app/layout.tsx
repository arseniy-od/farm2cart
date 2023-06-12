import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import './globals.css'


import { useRouter } from 'next/navigation';

export const siteTitle = 'farm2cart';

export default function Layout({ children, home }) {
    const { push } = useRouter();
    const [user, setUser] = useState(null);


    const handleLogout = async (event) => {
        setUser(null);
        const res = await fetch('/api/auth/logout')
        if (res.ok) {
            console.log("Logout successful")
            push('/')
        } else {
            console.log("Logout error")
        }
        
    };

    function fetchUser() {
        fetch('/api/users/me')
            .then((res) => res.json())
            .then((data) => {
                setUser(data);
            });
    }



    useEffect(fetchUser, []);

    return (
        <div className="bg-gray-100 min-h-screen text-gray-900">
            <Head>
                <title>{siteTitle}</title>
            </Head>
            <header className="px-4 py-3 text-gray-900 bg-gray-500">
                <div className="flex justify-between items-center">
                    {home ? (
                        <h1 className="text-2xl">Index page</h1>
                    ) : (
                        <h2>
                            <Link className="text-2xl " href="/">
                                Home
                            </Link>
                        </h2>
                    )}
                    {!user || user.error ?
                        <div>
                            <Link className="" href="http://localhost:3000/signup">Sign up</Link>
                            <Link className="ml-4" href="http://localhost:3000/login">Login</Link>
                        </div>
                        :
                        <div>
                            {user.role === "seller"
                            ? <Link className='px-4 inline-block' href="/goods/create">Add new product</Link>
                            : null}
                            <button className="ml-4 px-4 inline-block" onClick={handleLogout} className="">Logout</button>
                            <Link className="ml-4" href="http://localhost:3000/users/me">{user.username}</Link>
                        </div>
                    }

                </div>
            </header>
            <main className="">
                {children}
            </main>

        </div>
    );
}