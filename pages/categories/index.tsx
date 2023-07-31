import Link from 'next/link'

import Layout from '@/app/layout'
import container from '@/server/container'
import { GetStaticProps } from 'next'
import { categoriesSchema } from '@/redux/normalSchemas'
import { RootState } from '@/redux/store'
import { normalize } from 'normalizr'
import { updateEntities } from '@/redux/actions'
import { ConnectedProps, connect } from 'react-redux'
import ErrorMessage from '@/app/components/utils/errorMessage'
import clientContainer from '@/redux/container'
import { ContextDynamicRoute } from '@/app/types/interfaces'
import initServerStore from '@/server/initServerStore'

function Categories({ categories }: PropsFromRedux) {
    if (!categories) {
        return (
            <Layout>
                <ErrorMessage message="Categories not found" />
            </Layout>
        )
    }
    return (
        <Layout>
            {Object.values(categories).map((category, i) => (
                <div key={i}>
                    <div className="ml-4 mt-4 max-w-xs bg-gray-100 px-4 py-3 text-center text-lg shadow-lg">
                        <Link
                            href={
                                category.text
                                    ? '/categories/' +
                                      category.text.toLowerCase()
                                    : '/categories'
                            }
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

export const getStaticProps: GetStaticProps = clientContainer
    .resolve('redux')
    .wrapper.getStaticProps(
        initServerStore(container.resolve('CategoryController'), '/categories')
    )
