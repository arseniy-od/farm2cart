import { GetStaticProps, GetStaticPaths } from 'next'
import { findGoodById, getAllGoodIds } from '@/services/good'
import Image from 'next/image';
import Link from 'next/link';
import Layout from '@/app/layout';
import slugify from '@sindresorhus/slugify';
import GoodCard from '@/app/components/goodCard'


export default function Good(props) {
    const good = props.parsedData;
    const categories = good.Categories;


    return (
        <Layout>
            <div className="mx-auto flex flex-wrap justify-center">
                <GoodCard good={good} categories={categories}/>
            </div>
            
        </Layout>
        
    );

}

export const getStaticPaths: GetStaticPaths = async () => {
    const paths = await getAllGoodIds()
    return {
        paths,
        fallback: false
    }
}


export const getStaticProps: GetStaticProps = async ({ params }) => {
    // console.log("Got id: ", params.id);
    const goodData = await findGoodById(params?.id);
    // console.log("goodData is: ", goodData);
    const parsedData = JSON.parse(JSON.stringify(goodData));
    // console.log("Good parsedData is: ", parsedData)
    return {
        props: {
            parsedData
        }
    }
}