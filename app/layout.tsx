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
            <header className="px-4 py-3 text-gray-900 text-2xl bg-gray-500">
                {home ? (
                    <h1 className="">Index page</h1>
                ) : (
                    <h2>
                        <Link href="/">
                            Home
                        </Link>
                    </h2>
                )}
            </header>
            <main className="">
                {children}
            </main>

        </div>
    );
}