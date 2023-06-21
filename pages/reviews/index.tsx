import Layout from '@/app/layout'
import { createRouter } from 'next-connect'
import { GetServerSideProps, NextApiRequest, NextApiResponse } from 'next'

import container from '@/server/container'
import { ReviewsProps } from '@/app/interfaces'

export default function Review({ reviews }: ReviewsProps) {
    return (
        <Layout>
            {reviews.map((review, i) => (
                <div key={i}>
                    <div className="mt-4 ml-4 px-4 py-3 text-lg border-2 max-w-xs text-center bg-gray-200 rounded-lg">
                        Review: {review.text}
                    </div>
                </div>
            ))}
        </Layout>
    )
}

const router = createRouter().get(async (req, res) => {})

export const getServerSideProps: GetServerSideProps = async function (ctx) {
    const reviews = await container.resolve('ReviewController').getReviews()
    return { props: reviews }
}
