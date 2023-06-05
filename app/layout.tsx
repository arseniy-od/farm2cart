import Head from 'next/head';
import Link from 'next/link';
import './globals.css'

export const siteTitle = 'farm2cart';

export default function Layout({ children, home }) {
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
                    <div>
                        <Link className="" href="http://localhost:3000/signup">Sign up</Link>
                        <Link className="ml-4" href="http://localhost:3000/login">Login</Link>
                    </div>
                </div>
            </header>
            <main className="">
                {children}
            </main>

        </div>
    );
}