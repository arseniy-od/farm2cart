import { GetStaticProps, GetStaticPaths } from 'next'
import { findGoodById, getAllGoodIds } from '@/services/good'
import Image from 'next/image';
import Link from 'next/link';
import Layout from '@/app/layout';
import slugify from '@sindresorhus/slugify';
import GoodCard from '@/app/components/goodCard'
import { formatDate } from '@/app/utils'
import { useState } from 'react'
import { useRouter } from 'next/navigation';


export default function Good(props) {
    const good = props.parsedData;
    const categories = good.Categories;

    // const { push } = useRouter();
    const [review, setReview] = useState({
        goodId: good.id,
        text: "",
        score: null
    });

    const [reviews, setReviews] = useState(good.reviews);
    // setReviews(reviews.sort((a, b) => a.score - b.score))

    const handleSubmit = async (event) => {
        event.preventDefault();
        

        const res = await fetch('/api/reviews', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(review)
        });

        if (res.ok) {
            const newReview = await res.json();
            console.log("--------------NEW--------------");
            console.log(newReview);
            setReviews([...reviews, newReview]);
            setReview({
                goodId: good.id,
                text: "",
                score: null
            });
            console.log("Review creation ok")
        } else {
            console.log("Review creation not ok")
        }
    };

    return (
        <Layout>
            <div className="mx-auto flex">
                <GoodCard good={good} categories={categories} />
            </div>

            <div>
                {reviews.length !== 0 
                ? reviews.map((review, i) => (
                    <div key={i}>
                        <div className='ml-5 mt-3 px-4 py-4 border-2 border-gray-200 max-w-xs rounded-lg'>
                            <div className='px-3 py-2 flex justify-between'>
                            <div>{review.author.username}</div>
                            <div className="text-gray-700">{formatDate(review.datepub)}</div>
                            </div>
                            <div>Score: {review.score}</div>
                            <div className="px-4 py-3 shadow-lg rounded-lg">
                                
                                <p className=''>{review.text}</p>
                            </div>
                            
                        </div>
                    </div>
                ))
                : null
                }
                <div className="mt-6">
                    <form className="text-center">
                        <h3 className="text-xl">Add your review: </h3>
                        <div>
                            <label htmlFor="score">Score: </label>
                            <input type="number" id="score" value={review.score} onChange={(event) => setReview({ ...review, score: event.target.value })}
                                className="mt-2 px-4 py-3 w-full max-w-xs border-2" />
        
                        </div>
                        <div>
                            <label htmlFor="review">Review: </label>
                            <textarea 
                            id="review" 
                                value={review.text} 
                                onChange={(event) => setReview({ ...review, text: event.target.value })}
                                className="w-full h-48 px-3 py-2 placeholder-gray-400 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" placeholder="Enter your text here">          
                            </textarea>
                        </div>
                        <button
                            onClick={handleSubmit}
                            type="submit" className="mt-4 inline-block items-center bg-gray-400 hover:bg-gray-600 focus:outline-none focus:shadow-outline rounded-lg shadow px-8 py-2">Submit</button>
                    </form>
                </div>
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
    console.log("Before", parsedData.reviews)
    parsedData.reviews.sort((a, b,) => new Date(a.datepub) - new Date(b.datepub))
    console.log("After", parsedData.reviews)
    // console.log("Good parsedData is: ", parsedData)
    return {
        props: {
            parsedData
        }
    }
}