import { GetStaticProps, GetStaticPaths } from 'next'
import Image from 'next/image';
import Link from 'next/link';

import Layout from '@/app/layout';
import GoodCard from '@/app/components/goodCard'
import container from '@/server/container';


export default function Good(props) {
    const category = props.parsedData
    const goods = category.goods
    console.log("[fg2g231g] Goods are: ", goods)

    return (
        <Layout>
            <div>
                <div>
                    <h1 className="ml-4 mt-4 text-2xl">{category.text}</h1>
                </div>
                {goods.map((good, i) => (
                    <div key={i}>
                        
                            <GoodCard good={good} categories={good.Categories}/>
                    
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
    // console.log("Got slug: ", params.slug);
    const categoryData = await container.resolve("CategoryService").getCategoryByText(params?.slug);
    // console.log("goodData is: ", categoryData);
    const parsedData = JSON.parse(JSON.stringify(categoryData));
    // console.log("parsedData is: ", parsedData)
    return {
        props: {
            parsedData
        }
    }
}