import Link from 'next/link'
import { review } from '../interfaces'
import { formatDate } from '../utils'
import { BlankStar, Star } from './icons/star'

export default function ReviewCard({ review }: { review: review }) {
    const countStars = review.score
    const stars = []
    for (let i = 0; i < 5; i++) {
        stars.push(i < countStars ? <Star key={i} /> : <BlankStar key={i} />)
    }
    return (
        <div className="ml-5 mt-3 px-4 py-4 min-w-xs w-2/3 lg:w-1/2">
            <div>
                {review.new ? (
                    <div className="px-3 py-2 flex justify-between">
                        <div>You</div>
                        <div className="text-gray-700">Now</div>
                    </div>
                ) : (
                    <div className="px-3 py-2 flex justify-between">
                        <Link href={'/users/' + review.author.id}>
                            <div>{review.author.username}</div>
                        </Link>
                        <div className="text-gray-700">
                            {formatDate(review.datepub)}
                        </div>
                    </div>
                )}
            </div>
            <div className="flex">{stars.map((star) => star)}</div>
            <div className="px-4 py-3 shadow-lg">
                <p className="">{review.text}</p>
            </div>
        </div>
    )
}
