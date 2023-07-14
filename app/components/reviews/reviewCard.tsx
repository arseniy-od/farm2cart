import Link from 'next/link'
import { review } from '../../types/interfaces'
import { formatDateTime } from '../../utils'
import { BlankStar, Star } from '../icons/star'
import { ReactElement } from 'react'
import { RootState } from '@/redux/store'
import { ConnectedProps, connect } from 'react-redux'

function ReviewCard({ review, author }: Props) {
    const countStars = review.score
    const stars: ReactElement[] = []
    for (let i = 0; i < 5; i++) {
        stars.push(i < countStars ? <Star key={i} /> : <BlankStar key={i} />)
    }
    return (
        <div className="mt-4 px-2 py-2 w-3/4 lg:w-1/2 xl:w-1/3 bg-gray-100 shadow-lg">
            <div>
                <div className="px-3 py-2 flex justify-between">
                    {author ? (
                        <Link href={'/users/' + author.id}>
                            <div>{author.username}</div>
                        </Link>
                    ) : (
                        <div>deleted</div>
                    )}

                    <div className="text-gray-700">
                        {formatDateTime(review.datepub)}
                    </div>
                </div>
            </div>
            <div className="ml-2 flex">{stars.map((star) => star)}</div>
            <div className="px-4 py-3">
                <p className="">{review.text}</p>
            </div>
        </div>
    )
}

const mapState = (state: RootState, ownProps) => ({
    author: state.entities.users?.[ownProps.review.author],
})

const connector = connect(mapState, null)
type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux & { review: review }
export default connector(ReviewCard)
