import { createRouter } from 'next-connect'
import Link from 'next/link'

import Layout from '@/app/layout'
import container from '@/server/container'
import {
    NextApiRequest,
    NextApiResponse,
    GetServerSideProps,
    GetStaticProps,
} from 'next'
import { categoriesSchema } from '@/redux/normalSchemas'
import { RootState, wrapper } from '@/redux/store'
import { normalize } from 'normalizr'
import { updateEntities } from '@/redux/actions'
import { ConnectedProps, connect } from 'react-redux'

function Categories(props) {
    const categories = props.categories

    return (
        <Layout>
            {Object.values(categories).map((category, i) => (
                <div key={i}>
                    <div className="mt-4 ml-4 px-4 py-3 text-lg max-w-xs text-center bg-gray-100 shadow-lg">
                        <Link
                            href={'/categories/' + category.text.toLowerCase()}
                        >
                            <div className="">{category.text}</div>
                        </Link>
                    </div>
                </div>
            ))}
        </Layout>
    )
}

const mapState = (state: RootState, ownProps) => ({
    categories: state.entities.categories,
})

const connector = connect(mapState, null)
type PropsFromRedux = ConnectedProps<typeof connector>

export default connector(Categories)

export const getStaticProps: GetStaticProps = wrapper.getStaticProps(
    (store) => async (ctx) => {
        const categories = await container
            .resolve('CategoryController')
            .getCategories(ctx)
        // const categories = props
        console.log('categories:', categories)
        const normCategories = normalize(categories, categoriesSchema)
        console.log('normal categories:', normCategories)
        store.dispatch(updateEntities(normCategories))

        return { props: {} }
    }
)
