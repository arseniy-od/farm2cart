import { GetServerSideProps } from 'next'
import { useRouter } from 'next/navigation';
import { useState, MouseEvent } from "react";

import Image from 'next/image';
import Link from 'next/link';

import Layout from '@/app/layout';
import GoodCard from '@/app/components/goodCard'
import { formatDate } from '@/app/utils'
import container from '@/server/container'
import { GoodProps, good } from '@/app/interfaces';


export default function Good({ good }: GoodProps) {
    const categories = good.categories;

    const { push } = useRouter();
    const [review, setReview] = useState({
        goodId: good.id,
        text: "",
        score: ""
    });

    const [reviews, setReviews] = useState(good.reviews);
    // setReviews(reviews.sort((a, b) => a.score - b.score))

    const handleDelete = async (event: MouseEvent<HTMLButtonElement>) => {
        const res = await fetch(`/api/goods/?id=${good.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            // query: JSON.stringify(good.id)
        });
        if (res.ok) {
            const deleted = await res.json();
            console.log("Good deleted");
            push('/goods');
        } else {
            console.log("Good not deleted")
        }
    };
    const handleSubmit = async (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();


        const res = await fetch('/api/reviews', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(review)
        });

        if (res.ok) {
            let newReview = await res.json();
            newReview = { ...newReview, new: true }
            setReviews([...reviews, newReview]);
            setReview({
                goodId: good.id,
                text: "",
                score: ""
            });
            console.log("Review creation ok")
        } else {
            console.log("Review creation not ok")
        }
    };

    if (good.notFound) {
        return (
            <Layout>
                <div className='ml-6 mt-6 text-2xl font-semibold'>
                    Good not found
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="mx-auto flex">
                <GoodCard good={good} categories={categories} />
                <button onClick={handleDelete} >Delete</button>
            </div>

            <div>
                {reviews.length !== 0
                    ? reviews.map((review, i) => (
                        <div key={i}>
                            <div className='ml-5 mt-3 px-4 py-4 border-2 border-gray-200 max-w-xs rounded-lg'>
                                <div>
                                    {review.new
                                        ?
                                        <div className='px-3 py-2 flex justify-between'>
                                            <div>You</div>
                                            <div className="text-gray-700">Now</div>
                                        </div>
                                        : <div className='px-3 py-2 flex justify-between'>
                                            <Link href={'/users/' + review.author.id}>
                                                <div>{review.author.username}</div>
                                            </Link>
                                            <div className="text-gray-700">{formatDate(review.datepub)}</div>
                                        </div>}
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
                                className="mt-2 px-4 py-3 w-full max-w-xs border-2" required/>

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


export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const { id } = ctx.query;
    if (!id || id instanceof Array) { return { props: { good: {notFound: true }} } }

    const good: good = await container.resolve("GoodService").getGoodById(id);
    // console.log("Before", parsedData.reviews)
    good.reviews.sort((a, b) => new Date(a.datepub).getTime() - new Date(b.datepub).getTime())
    // console.log("After", parsedData.reviews)
    return {
        props: {
            good
        }
    }
}