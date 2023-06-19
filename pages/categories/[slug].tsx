import { GetStaticProps, GetStaticPaths } from 'next'
import Image from 'next/image';
import Link from 'next/link';

import Layout from '@/app/layout';
import GoodCard from '@/app/components/goodCard'
import container from '@/server/container';
import { CategoryProps, category, good } from '@/app/interfaces';
import { IGoodModel } from '@/app/interfaces';

export default function Category({category, goods}: {category: category, goods: good[]}) {
    console.log("Goods: ", goods)
    return (
        <Layout>
            <div>
                <div>
                    <h1 className="ml-4 mt-4 text-2xl">{category.text}</h1>
                </div>
                {goods.map((good, i) => (
                    <div key={i}>
                        
                            <GoodCard good={good} categories={good.categories}/>
                    
                    </div>
                ))}
                <div>
                    <Link href="/categories" className='ml-4 mt-4 px-6 py-3 inline-block bg-gray-200 font-semibold rounded-lg shadow-lg'>
                        Go back
                    </Link>
                </div>
            </div>
        </Layout>
    );
}


export const getStaticPaths: GetStaticPaths = async () => {
    const paths = await container.resolve("CategoryService").getAllCategorySlugs()
    // console.log("Paths are: -------------------------\n", paths)
    return {
        paths,
        fallback: false
    }
}


export const getStaticProps: GetStaticProps = async ({ params }) => {
    if (!params) {
        console.error("No params at request")
        return { props: { category: {notFound: true }} }
    }
    const slug = params.slug
    if (!slug || slug instanceof Array) { return { props: { category: {notFound: true }} } }
    const categoryData = await container.resolve("CategoryService").getCategoryByText(slug);
    const category = JSON.parse(JSON.stringify(categoryData));
    const goods: good[] = []
    for (const good of category.goods) {
        goods.push(await  container.resolve("GoodService").getGoodById(good.id))
    }
    return {
        props: {
            category,
            goods
        }
    }
}
