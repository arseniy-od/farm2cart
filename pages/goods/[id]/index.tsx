import { MouseEvent, ReactElement } from 'react'
import { ConnectedProps, connect } from 'react-redux'
import { normalize } from 'normalizr'

import container from '@/server/container'

import { RootState } from '@/redux/store'
import {
    activateGoodSaga,
    deactivateGoodSaga,
    updateEntities,
} from '@/redux/actions'
import { categoriesSchema, goodSchema } from '@/redux/normalSchemas'

import Layout from '@/app/layout'
import { HalfStar, BlankStar, Star } from '@/app/components/icons/star'
import CreateReview from '@/app/components/reviews/createReview'
import ReviewCard from '@/app/components/reviews/reviewCard'

import { ContextDynamicRoute } from '@/app/types/interfaces'
import GoodFull from '@/app/components/goods/goodFull'
import ErrorMessage from '@/app/components/utils/errorMessage'
import clientContainer from '@/redux/container'
import { isEmpty } from '@/app/utils'
import initServerStore from '@/server/initServerStore'

function Good({
    good,
    reviews,
    goodCategories,
    seller,
    activateGoodSaga,
    deactivateGoodSaga,
    user,
}: Props) {
    if (!good || isEmpty(good)) {
        return (
            <Layout>
                <ErrorMessage message="Good not found" />
            </Layout>
        )
    }

    function roundHalf(num: number) {
        return Math.round(num * 2) / 2
    }

    let stars: ReactElement[] = []
    if (good.averageScore) {
        let score = roundHalf(good.averageScore)
        for (let i = 0; i < 5; i++) {
            if (score === 0.5) {
                stars.push(<HalfStar />)
                score = 0
            } else if (score === 0) {
                stars.push(<BlankStar />)
            } else {
                stars.push(<Star />)
                score -= 1
            }
        }
    }

    const handleDelete = async () => {
        if (!good?.active) {
            activateGoodSaga(good)
        } else {
            deactivateGoodSaga(good)
        }
    }

    return (
        <Layout>
            <div className="flex flex-col justify-center">
                <GoodFull
                    good={good}
                    seller={seller}
                    stars={stars}
                    categories={goodCategories}
                    handleDelete={handleDelete}
                    user={user}
                />

                <div className="flex flex-col items-center justify-center">
                    {reviews.length !== 0
                        ? reviews.map((review, i) => {
                              return <ReviewCard review={review} key={i} />
                          })
                        : null}
                </div>
                <CreateReview good={good} />
            </div>
        </Layout>
    )
}

function getReviews(state, goodId) {
    const good = state.entities.goods?.[goodId]
    if (!good) {
        return []
    }
    console.log('getReviews good: ', goodId)
    if (good.reviews) {
        const reviews = good.reviews.reduce((acc, reviewId) => {
            acc.push(state.entities.reviews[reviewId])
            return acc
        }, [])
        return reviews
    } else {
        const reviews = []
        return reviews
    }
}

function getCategories(state, goodId) {
    const good = state.entities.goods?.[goodId]
    if (!good) {
        return []
    }
    const categories = good.categories.reduce((acc, categoryId) => {
        acc.push(state.entities.categories[categoryId])
        return acc
    }, [])
    return categories
}

const mapState = (state: RootState, ownProps) => ({
    user: state.user,
    good: state.entities.goods?.[ownProps.query.id],
    reviews: getReviews(state, ownProps.query.id),
    goodCategories: getCategories(state, ownProps.query.id),
    seller: state.entities.users?.[
        state.entities.goods?.[ownProps.query.id]?.seller || ''
    ],
})

const mapDispatch = {
    activateGoodSaga,
    deactivateGoodSaga,
}

const connector = connect(mapState, mapDispatch)
type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux & { id: number }

export const getServerSideProps = clientContainer
    .resolve('redux')
    .wrapper.getServerSideProps(
        initServerStore(
            [
                container.resolve('GoodController'),
                container.resolve('CategoryController'),
            ],
            '/goods/:id'
        )
    )

export default connector(Good)
