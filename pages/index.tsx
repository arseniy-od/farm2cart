import Link from 'next/link'
import Layout from '../app/layout'


export default function Home() {

    function SiteLink({href, text}) {
        return (
            <div className="ml-3 mt-2 max-w-xs">
                <Link className="px-5 py-3 text-gray-900 inline-block bg-gray-300 hover:bg-gray-400 min-w-full border-2 rounded-lg text-center" href={href}>{text}</Link>
            </div>
        )
    }

    return (
        <div id="app" className="">
            <Layout home>
                <div className="mt-6">
                    <SiteLink href="/users" text="Users"/>
                    <SiteLink href="/reviews" text="Reviews"/>
                    <SiteLink href="/goods" text="Goods"/>
                    <SiteLink href="/orders" text="Orders"/>
                    <SiteLink href="/categories" text="Categories"/>
                    <SiteLink href="/companies" text="Companies"/>
                </div>

            </Layout>
        </div>
);
}