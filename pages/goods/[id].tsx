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
    
    function formatDate(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // Add 1 because getMonth() returns a zero-based index
        const day = date.getDate();

        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();

        const formattedDate = `${day}/${month}/${year}`;
        const formattedDateTime = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
        return formattedDateTime
    }


    return (
        <Layout>
            <div className="mx-auto flex">
                <GoodCard good={good} categories={categories} />
            </div>
            <div>
                {good.reviews.length !== 0 
                ? good.reviews.map((review, i) => (
                    <div key={i}>
                        <div className='ml-5 mt-3 px-4 py-4 border-2 border-gray-200 max-w-xs rounded-lg'>
                            <div className='px-3 py-2 flex justify-between'>
                            <div>{review.author.username}</div>
                            <div className="text-gray-700">{formatDate(review.datepub)}</div>
                            </div>
                            <div className="px-4 py-3 shadow-lg rounded-lg">
                                
                                <p className=''>{review.text}</p>
                            </div>
                            
                        </div>
                    </div>
                ))
                : null
            }
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