import { useState, MouseEvent } from 'react'
import { BlankStar, Star } from './icons/star'

export default function CreateReview({ good, reviews, setReviews }) {
    const [review, setReview] = useState({
        goodId: good.id,
        text: '',
        score: 5,
    })

    const handleSubmit = async (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()

        const res = await fetch('/api/reviews', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(review),
        })

        if (res.ok) {
            let newReview = await res.json()
            newReview = { ...newReview, new: true }
            setReviews([...reviews, newReview])
            setReview({
                goodId: good.id,
                text: '',
                score: 5,
            })
            console.log('Review creation ok')
        } else {
            console.log('Review creation not ok')
        }
    }

    function incrementScore() {
        if (review.score < 5) {
            setReview({ ...review, score: review.score + 1 })
        }
    }

    function decrementScore() {
        if (review.score > 1) {
            setReview({ ...review, score: review.score - 1 })
        }
    }

    const countStars = review.score
    const stars = []
    for (let i = 0; i < 5; i++) {
        stars.push(i < countStars ? <Star key={i} /> : <BlankStar key={i} />)
    }

    return (
        <div className="mt-6">
            <form className="text-center">
                <h3 className="text-xl">Add your review: </h3>
                <div>
                    <div className="mt-4 flex items-center justify-center">
                        <button
                            type="button"
                            onClick={decrementScore}
                            className="ml-2 px-2"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="1em"
                                viewBox="0 0 448 512"
                            >
                                <path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z" />
                            </svg>
                        </button>
                        <div className="ml-2 flex">
                            {stars.map((star) => star)}
                        </div>
                        <button
                            type="button"
                            onClick={incrementScore}
                            className="ml-2 px-2"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="1em"
                                viewBox="0 0 448 512"
                            >
                                <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div>
                    <textarea
                        id="review"
                        value={review.text}
                        onChange={(event) =>
                            setReview({
                                ...review,
                                text: event.target.value,
                            })
                        }
                        className="mt-4 w-3/4 h-48 px-3 py-2 placeholder-gray-400 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent xl:w-2/3"
                        placeholder="Enter your text here"
                    ></textarea>
                </div>
                <button
                    onClick={handleSubmit}
                    type="submit"
                    className="mt-4 inline-block items-center bg-gray-400 hover:bg-gray-600 focus:outline-none focus:shadow-outline rounded-lg shadow px-8 py-2"
                >
                    Submit
                </button>
            </form>
        </div>
    )
}