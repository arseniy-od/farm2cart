import Layout from '@/app/layout'
import { createRouter } from "next-connect";

import container from '@/server/container'


export default function Review({ reviews }) {

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

    );
}


const router = createRouter()
    .get(async (req, res) => {
        const reviews = await container.resolve("ReviewService").getReviews();
        if (!reviews) {
            return { props: { notFound: true } };
        }
        return { props: { reviews: JSON.parse(JSON.stringify(reviews)) } };
    });


export async function getServerSideProps({ req, res }) {
    return await router.run(req, res);
}

