import {
    useState,
    MouseEvent,
    ReactElement,
    Dispatch,
    SetStateAction,
} from 'react'
import { BlankStar, Star } from '../icons/star'
import { useAppDispatch } from '@/redux/hooks'
import { RootState } from '@/redux/store'
import { ConnectedProps, connect } from 'react-redux'
import { review, good } from '@/app/types/entities'
import { createReview, updateEntities } from '@/redux/actions'

type ownProps = {
    good: good
}

function CreateReview({ good, createReview }: Props) {
    const [review, setReview] = useState({
        goodId: good.id,
        text: '',
        score: 5,
    })

    const handleSubmit = async (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        createReview(review, good.id)
        setReview({
            goodId: good.id,
            text: '',
            score: 5,
        })
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
    function starLink(star: ReactElement, rating: number): ReactElement {
        return (
            <button
                key={rating}
                type="button"
                onClick={() => setReview({ ...review, score: rating + 1 })}
            >
                {star}
            </button>
        )
    }
    const countStars = review.score
    const stars: ReactElement[] = []
    for (let i = 0; i < 5; i++) {
        stars.push(
            i < countStars
                ? starLink(<Star key={i} />, i)
                : starLink(<BlankStar key={i} />, i)
        )
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
                        className="mt-4 h-48 w-3/4 rounded-lg border px-3 py-2 text-gray-700 placeholder-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-600 xl:w-2/3"
                        placeholder="Enter your text here"
                    ></textarea>
                </div>
                <button
                    onClick={handleSubmit}
                    type="submit"
                    className="btn-submit"
                >
                    Submit
                </button>
            </form>
        </div>
    )
}

const mapState = (state: RootState, ownProps: ownProps) => ({})

const mapDispatch = {
    createReview,
}

const connector = connect(mapState, mapDispatch)
type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux & ownProps
export default connector(CreateReview)
